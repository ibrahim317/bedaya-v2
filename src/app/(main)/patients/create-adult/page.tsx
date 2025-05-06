"use client";

import { Card, Form } from "antd";
import { PatientType } from "@/types/Patient";
import { createPatient } from "@/clients/patientClient";
import { message } from "antd";
import AdultPatientForm from "./components/AdultPatientForm";
import { useRouter } from "next/navigation";

const initialValues = {
  type: PatientType.Adult,
  name: "",
  sex: "",
  code: "",
  checkupDay: 1,
};

const CreatePatientPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      await createPatient(values);
      message.success("Patient created successfully");
      form.resetFields();
      router.push("/patients");
    } catch (error: any) {
      message.error(error.message || "Failed to create patient");
    }
  };

  return (
    <div className="md:p-6">
      <Card
        title="Bedaya Medical Caravan – Adult Sheet"
        className="max-w-7xl mx-auto"
      >
        <AdultPatientForm
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          submitLabel="Create Patient"
        />
      </Card>
    </div>
  );
};

export default CreatePatientPage;