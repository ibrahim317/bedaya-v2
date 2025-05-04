"use client";

import { Card, Form, Button } from "antd";
import { PatientType } from "@/types/Patient";

// Import the new components
import BasicInformationTop from "./components/BasicInformationTop";
import PatientDetails from "./components/PatientDetails";
import HabitsSection from "./components/HabitsSection";
import FemaleSpecificSection from "./components/FemaleSpecificSection";
import ComplaintSection from "./components/ComplaintSection";
import PastHistorySection from "./components/PastHistorySection";
import ExaminationAndScreeningSection from "./components/ExaminationAndScreeningSection";
import ReferralSection from "./components/ReferralSection";

const CreatePatientPage = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    // TODO: Implement form submission
    console.log(values);
  };

  return (
    <div className="md:p-6">
      <Card
        title="Bedaya Medical Caravan – Adult Sheet"
        className="max-w-7xl mx-auto"
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical" // Consistent vertical layout often looks better with complex forms
          initialValues={{
            type: PatientType.Adult,
            checkupDay: 1,
            followUp: false,
            communityDevelopment: false,
            // Sensible defaults for potentially undefined nested objects if needed
            // allergy: { has: false },
            // bloodTransfusion: { has: false },
            // surgical: { operation: { enabled: false } },
            // chronicDrugs: { other: { enabled: false } },
            // familyHistory: { other: { enabled: false } },
            // smokingStatus: { enabled: false },
            // smokingCessation: { enabled: false },
            // contraceptionMethod: { enabled: false },
          }}
        >
          {/* Use the imported components */}
          <BasicInformationTop form={form} />

          <PatientDetails />

          <HabitsSection />

          {/* Conditionally render FemaleSpecificSection based on Sex */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.sex !== currentValues.sex
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("sex") === "F" ? <FemaleSpecificSection /> : null
            }
          </Form.Item>

          <ComplaintSection />

          <PastHistorySection />

          <ExaminationAndScreeningSection />

          <ReferralSection />

          <Form.Item className="mt-6">
            <Button type="primary" htmlType="submit" size="large">
              Create Patient
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePatientPage;