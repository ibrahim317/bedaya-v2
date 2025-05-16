"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, Spin, message } from "antd";
import ChildPatientForm from "../../create-child/components/ChildPatientForm";
import { fetchPatientById, updatePatient } from "@/clients/patientClient";
import { IPatient } from "@/types/Patient";

const UpdateChildPatientPage = () => {
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
        setInitialValues(patient);
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
        title="Update Child Patient"
        className="max-w-7xl mx-auto"
      >
        <ChildPatientForm
          initialValues={initialValues}
          onFinish={onFinish}
          submitLabel="Update Patient"
          loading={formLoading}
        />
      </Card>
    </div>
  );
};


export default UpdateChildPatientPage; 