"use client";

import { useMemo } from 'react';
import { Card, Form } from "antd";
import { PatientType } from "@/types/Patient";
import { createPatient } from "@/clients/patientClient";
import { message } from "antd";
import AdultPatientForm from "./components/AdultPatientForm";
import { useRouter } from "next/navigation";
import { useOfflineForm } from '@/hooks/useOfflineForm';
import { formPersistenceService } from '@/services/formPersistenceService';
import { FormType } from '@/types/IndexedDB';

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

  // Generate a unique, stable ID for this form session
  const formId = useMemo(() => formPersistenceService.generateFormId(), []);

  // Use the offline form hook
  const { onValuesChange, cleanupSavedForm } = useOfflineForm({
    form,
    formId,
    formType: FormType.PATIENT_CREATE,
  });

  const onFinish = async (values: any, redirect: boolean = true) => {
    try {
      await createPatient(values);
      message.success("Patient created successfully");
      await cleanupSavedForm(); // Clean up the saved form data on success
      form.resetFields();
      if (redirect) {
        router.push("/patients");
      } else {
        // When creating another, we don't redirect, but we should start a new form session
        // This is complex, for now we just reset. A better way would be to generate a new formId.
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
          onValuesChange={onValuesChange} // Pass the handler to the form
          submitLabel="Create Patient"
        />
      </Card>
    </div>
  );
};

export default CreatePatientPage;