"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Select, Form, Spin, Button, message, Table, Image } from 'antd';
import { clinicsClient, IClinic } from '@/clients/clinicsClient';
import { searchPatients } from '@/clients/patientClient';
import { IPatient } from '@/types/Patient';
import ImageUploader from '@/app/(main)/patients/components/ImageUploader';
import { IClinicVisit } from '@/types/ClinicVisit';

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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [searchedPatients, setSearchedPatients] = useState<IPatient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitHistory, setVisitHistory] = useState<IClinicVisit[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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
            images: imageUrls,
        });
        message.success("Visit saved successfully!");
        setSelectedPatient(null);
        setSelectedDiagnoses([]);
        setSelectedTreatments([]);
        setImageUrls([]);
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
          <Form.Item label="Images">
            <ImageUploader
              onUpload={setImageUrls}
              fieldName="clinicRecordImages"
              initialImageUrls={[]}
            />
          </Form.Item>
        )}
        <Form.Item label="Treatment">
          <Select
            mode="tags"
            allowClear
            placeholder="Select or create treatments"
            value={selectedTreatments}
            onChange={(values) => setSelectedTreatments(values)}
          >
            {clinic?.commonTreatments.map((t) => (
              <Select.Option key={t._id?.toString()} value={t.name}>
                {t.name}
              </Select.Option>
            ))}
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
                  <p style={{ margin: 0 }}>Images:</p>
                  {record.images && record.images.length > 0 ? (
                     <Image.PreviewGroup>
                        {record.images.map((url, index) => (
                            <Image key={index} width={100} src={url} />
                        ))}
                    </Image.PreviewGroup>
                  ) : (
                    'No images for this visit.'
                  )}
                </div>
              ),
              rowExpandable: (record) => record.images && record.images.length > 0,
            }}
            pagination={false}
          />
        </Card>
      )}
    </div>
  );
}

export default ClinicPage;