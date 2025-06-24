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
  followUpImages: [],
  screeningImages: [],
};

const CreatePatientPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any, redirect: boolean = true) => {
    try {
      await createPatient(values);
      message.success("Patient created successfully");
      form.resetFields();
      if (redirect) {
        router.push("/patients");
      }
      else {
        router.push("/patients/create-adult");
      }
    } catch (error: any) {
      message.error(error.message || "Failed to create patient");
    }
  };

  const onFinishAndCreateNext = async (values: any) => {
    await onFinish(values, false);
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
          onFinishAndCreateNext={onFinishAndCreateNext}
          submitLabel="Create Patient"
        />
      </Card>
    </div>
  );
};

export default CreatePatientPage;