"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Select, Form, Spin, Button, message, Table, Image, Row, Col, Statistic, Tabs } from 'antd';
import { clinicsClient, IClinic } from '@/clients/clinicsClient';
import { searchPatients } from '@/clients/patientClient';
import { IPatient } from '@/types/Patient';
import ImageUploader from '@/app/(main)/patients/components/ImageUploader';
import { IClinicVisit } from '@/types/ClinicVisit';
import { drugsClient } from '@/clients/drugsClient';
import { IDrugWithId } from '@/types/Drug';

const { TabPane } = Tabs;

interface ClinicPageProps {
  params: {
    'clinic-id': string;
  };
}

const ClinicPage = ({ params }: ClinicPageProps) => {
  const [clinic, setClinic] = useState<IClinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [followUpImages, setFollowUpImages] = useState<string[]>([]);
  const [radiologyImages, setRadiologyImages] = useState<string[]>([]);
  const [searchedPatients, setSearchedPatients] = useState<IPatient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitHistory, setVisitHistory] = useState<IClinicVisit[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [stats, setStats] = useState<{ totalVisits: number; referredVisits: number } | null>(null);
  const [availableDrugs, setAvailableDrugs] = useState<IDrugWithId[]>([]);

  const clinicId = params['clinic-id'];

  const fetchClinic = useCallback(async () => {
    setLoading(true);
    try {
      const clinic = await clinicsClient.getClinicById(clinicId);
      setClinic(clinic);
    } catch (error) {
      message.error('Failed to fetch clinic data.');
    } finally {
      setLoading(false);
    }
  }, [clinicId]);

  useEffect(() => {
    fetchClinic();
  }, [fetchClinic]);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const drugsData = await drugsClient.getDrugs(1, 10000, ''); // Fetch all drugs
        const available = drugsData.drugs.filter(drug => drug.quantityByPills > 0);
        setAvailableDrugs(available);
      } catch (error) {
        message.error('Failed to fetch available drugs.');
      }
    };
    fetchDrugs();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const clinicStats = await clinicsClient.getClinicStats(clinicId);
        setStats(clinicStats);
      } catch (error) {
        message.error("Failed to fetch clinic stats.");
      }
    };
    fetchStats();
  }, [clinicId]);

  useEffect(() => {
    const fetchVisitHistory = async () => {
      if (selectedPatient) {
        setLoadingHistory(true);
        try {
          const history = await clinicsClient.getPatientVisitHistory(clinicId, selectedPatient);
          setVisitHistory(history);
        } catch (error) {
          message.error("Failed to fetch patient's visit history.");
        } finally {
          setLoadingHistory(false);
        }
      } else {
        setVisitHistory([]);
      }
    };
    fetchVisitHistory();
  }, [selectedPatient, clinicId]);

  const handlePatientSearch = async (query: string) => {
    if (query) {
      setIsSearching(true);
      const result = await searchPatients(query);
      setSearchedPatients(result.data);
      setIsSearching(false);
    } else {
      setSearchedPatients([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatient) {
      message.error("Please select a patient.");
      return;
    }
    if (selectedDiagnoses.length === 0 && selectedTreatments.length === 0) {
        message.error("Please select at least one diagnosis or treatment.");
        return;
    }

    setIsSubmitting(true);
    try {
        const existingDiagnosisNames = clinic?.commonDiagnoses.map(d => d.name) ?? [];
        const newDiagnosisNames = selectedDiagnoses.filter(d => !existingDiagnosisNames.includes(d));

        if (newDiagnosisNames.length > 0) {
            await clinicsClient.addBulkDiagnoses(clinicId, newDiagnosisNames);
        }

        const existingTreatmentNames = clinic?.commonTreatments.map(t => t.name) ?? [];
        const newTreatmentNames = selectedTreatments.filter(t => !existingTreatmentNames.includes(t));

        if (newTreatmentNames.length > 0) {
            await clinicsClient.addBulkTreatments(clinicId, newTreatmentNames);
        }

        await clinicsClient.createClinicVisit(clinicId, {
            patientId: selectedPatient,
            diagnoses: selectedDiagnoses,
            treatments: selectedTreatments,
            followUpImages,
            radiologyImages,
        });
        message.success("Visit saved successfully!");
        setSelectedPatient(null);
        setSelectedDiagnoses([]);
        setSelectedTreatments([]);
        setFollowUpImages([]);
        setRadiologyImages([]);
        setSearchedPatients([]);
        const history = await clinicsClient.getPatientVisitHistory(clinicId, selectedPatient);
        setVisitHistory(history);
        fetchClinic();
    } catch (error: any) {
        message.error(error.message || "Failed to save records.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{clinic?.name}</h1>
      <Row gutter={16} className="mb-6">
        <Col span={12}>
          <Card>
            <Statistic title="Total Visits" value={stats?.totalVisits ?? '...'} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Referred from Check-up" value={stats?.referredVisits ?? '...'} />
          </Card>
        </Col>
      </Row>
      <Form layout="vertical" className="mb-6" onFinish={handleSubmit}>
        <Form.Item label="Patient">
          <Select
            showSearch
            value={selectedPatient}
            placeholder="Search for a patient by name or code"
            onSearch={handlePatientSearch}
            onChange={(value) => setSelectedPatient(value)}
            loading={isSearching}
            filterOption={false}
            notFoundContent={isSearching ? <Spin size="small" /> : null}
          >
            {searchedPatients.map((p) => (
              <Select.Option key={p._id?.toString() || ''} value={p._id?.toString() || ''}>
                {p.name} - {p.code}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Diagnosis">
          <Select
            mode="tags"
            allowClear
            placeholder="Select or create diagnoses"
            value={selectedDiagnoses}
            onChange={(values) => setSelectedDiagnoses(values)}
          >
            {clinic?.commonDiagnoses.map((d) => (
              <Select.Option key={d._id?.toString()} value={d.name}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {clinic?.enableImages && (
          <Tabs>
            <TabPane tab="Follow up" key="1">
              <Form.Item>
                <ImageUploader
                  onUpload={setFollowUpImages}
                  fieldName="followUpImages"
                  initialImageUrls={[]}
                />
              </Form.Item>
            </TabPane>
            <TabPane tab="Radiology" key="2">
              <Form.Item>
                <ImageUploader
                  onUpload={setRadiologyImages}
                  fieldName="radiologyImages"
                  initialImageUrls={[]}
                />
              </Form.Item>
            </TabPane>
          </Tabs>
        )}
        <Form.Item label="Treatment">
          <Select
            mode="tags"
            allowClear
            placeholder="Select or create treatments"
            value={selectedTreatments}
            onChange={(values) => setSelectedTreatments(values)}
          >
            {[
              ...(clinic?.commonTreatments.map((t) => (
                <Select.Option key={t._id?.toString()} value={t.name}>
                  {t.name}
                </Select.Option>
              )) || []),
              ...availableDrugs.map((drug) => (
                <Select.Option key={drug._id} value={drug.name}>
                  {drug.name}
                </Select.Option>
              )),
            ]}
          </Select>
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Submit
            </Button>
        </Form.Item>
      </Form>
      {selectedPatient && (
        <Card title="Patient Visit History" className="mt-6">
          <Table
            dataSource={visitHistory}
            loading={loadingHistory}
            rowKey="_id"
            columns={[
              {
                title: 'Date',
                dataIndex: 'createdAt',
                key: 'createdAt',
                render: (text) => new Date(text).toLocaleDateString(),
              },
              {
                title: 'Diagnoses',
                dataIndex: 'diagnoses',
                key: 'diagnoses',
                render: (diagnoses: string[]) => diagnoses.join(', '),
              },
              {
                title: 'Treatments',
                dataIndex: 'treatments',
                key: 'treatments',
                render: (treatments: string[]) => treatments.join(', '),
              },
            ]}
            expandable={{
              expandedRowRender: (record) => (
                <div>
                  {record.followUpImages && record.followUpImages.length > 0 && (
                    <>
                      <p style={{ margin: '16px 0 8px' }}>Follow up Images:</p>
                      <Image.PreviewGroup>
                        {record.followUpImages.map((url, index) => (
                          <Image key={`follow-up-${index}`} width={100} src={url} />
                        ))}
                      </Image.PreviewGroup>
                    </>
                  )}
                  {record.radiologyImages && record.radiologyImages.length > 0 && (
                    <>
                      <p style={{ margin: '16px 0 8px' }}>Radiology Images:</p>
                      <Image.PreviewGroup>
                        {record.radiologyImages.map((url, index) => (
                          <Image key={`radiology-${index}`} width={100} src={url} />
                        ))}
                      </Image.PreviewGroup>
                    </>
                  )}
                  {(!record.followUpImages || record.followUpImages.length === 0) &&
                   (!record.radiologyImages || record.radiologyImages.length === 0) &&
                   'No images for this visit.'
                  }
                </div>
              ),
              rowExpandable: (record) => (record.followUpImages && record.followUpImages.length > 0) || (record.radiologyImages && record.radiologyImages.length > 0),
            }}
            pagination={false}
          />
        </Card>
      )}
    </div>
  );
}

export default ClinicPage;