"use client";

import { Card, Form } from "antd";
import { PatientType } from "@/types/Patient";
import ChildPatientForm from "./components/ChildPatientForm";
import { useRouter } from "next/navigation";
import { createPatient } from "@/clients/patientClient";
import { message } from "antd";

const initialValues = {
  type: PatientType.Child,
  name: "",
  sex: "",
  code: "",
  checkupDay: 1,
};
const CreatePatientPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any, redirect: boolean = true) => {
    try {
      console.log("values", values);
      await createPatient(values);
      message.success("Patient created successfully");
      form.resetFields();
      if (redirect) {
        router.push("/patients");
      } else {
        router.push("/patients/create-child");
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
        title="Bedaya Medical Caravan – Pediatric Sheet"
        className="max-w-7xl mx-auto"
      >
        <ChildPatientForm
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
