"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Select, Form, Spin, Button, message } from 'antd';
import { clinicsClient, IClinic } from '@/clients/clinicsClient';
import { searchPatients } from '@/clients/patientClient';
import { IPatient } from '@/types/Patient';

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
  const [searchedPatients, setSearchedPatients] = useState<IPatient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        await clinicsClient.createPatientRecords(clinicId, {
            patientId: selectedPatient,
            diagnoses: selectedDiagnoses,
            treatments: selectedTreatments,
        });
        message.success("Records saved successfully!");
        setSelectedPatient(null);
        setSelectedDiagnoses([]);
        setSelectedTreatments([]);
        setSearchedPatients([]);
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
    </div>
  );
}

export default ClinicPage;