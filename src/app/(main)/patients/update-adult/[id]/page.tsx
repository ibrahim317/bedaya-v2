"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, Spin, message } from "antd";
import AdultPatientForm from "../../create-adult/components/AdultPatientForm";
import { fetchPatientById, updatePatient } from "@/clients/patientClient";
import { IPatient } from "@/types/Patient";

const UpdateAdultPatientPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const patientId = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<IPatient | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patient = await fetchPatientById(patientId);
        setInitialValues(setOtherEnabled(patient));
      } catch (error: any) {
        message.error(error.message || "Failed to fetch patient data");
        router.push("/patients");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId, router]);

  const onFinish = async (values: any) => {
    setFormLoading(true);
    try {
      await updatePatient(patientId, values);
      message.success("Patient updated successfully");
      router.push("/patients");
    } catch (error: any) {
      message.error(error.message || "Failed to update patient");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading || !initialValues) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="md:p-6">
      <Card
        title="Update Adult Patient"
        className="max-w-7xl mx-auto"
      >
        <AdultPatientForm
          initialValues={initialValues}
          onFinish={onFinish}
          submitLabel="Update Patient"
          loading={formLoading}
        />
      </Card>
    </div>
  );
};

const setOtherEnabled = (patient: IPatient) => {
  if (patient.familyHistory) {
    patient.familyHistory.otherEnabled = patient.familyHistory.other ? true : false;
  }
  if (patient.drugsForChronicDisease) {
    patient.drugsForChronicDisease.otherEnabled = patient.drugsForChronicDisease.other ? true : false;
  }
  if(patient.medicalHistory) {
    patient.medicalHistory.otherEnabled = patient.medicalHistory.other ? true : false;
  }
  if(patient.contraceptionMethod && patient.contraceptionMethod.enabled) {
    patient.contraceptionMethod.otherEnabled = patient.contraceptionMethod.other ? true : false;
  }
  if(patient.surgicalHistory && patient.surgicalHistory.enabled) {
    patient.surgicalHistory.otherEnabled = patient.surgicalHistory.other ? true : false;
  }
  if(patient.icuHistory && patient.icuHistory.enabled) {
    patient.icuHistory.otherEnabled = patient.icuHistory.other ? true : false;
  }
  if(patient.surgicalHistory && patient.surgicalHistory.enabled) {
    patient.surgicalHistory.otherEnabled = patient.surgicalHistory.other ? true : false;
  }
  return patient;
};

export default UpdateAdultPatientPage; 