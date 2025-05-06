import { Card, Form, Button } from "antd";
import { PatientType } from "@/types/Patient";
import BasicInformationTop from "./BasicInformationTop";
import PatientDetails from "./PatientDetails";
import HabitsSection from "./HabitsSection";
import FemaleSpecificSection from "./FemaleSpecificSection";
import ComplaintSection from "./ComplaintSection";
import PastHistorySection from "./PastHistorySection";
import ExaminationAndScreeningSection from "./ExaminationAndScreeningSection";
import ReferralSection from "./ReferralSection";

interface AdultPatientFormProps {
  initialValues: any;
  onFinish: (values: any) => void;
  onFinishAndCreateNext: (values: any) => void;
  submitLabel?: string;
  form?: any;
  loading?: boolean;
}

const AdultPatientForm = ({
  initialValues,
  onFinish,
  onFinishAndCreateNext,
  submitLabel = "Create Patient",
  form,
  loading = false,
}: AdultPatientFormProps) => {
  const [internalForm] = Form.useForm();
  const usedForm = form || internalForm;

  return (
    <Form
      form={usedForm}
      onFinish={onFinish}
      layout="vertical"
      initialValues={initialValues}
    >
      <BasicInformationTop form={usedForm} />
      <PatientDetails />
      <HabitsSection />
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
        <Button type="primary" className="mr-4" htmlType="submit" size="large" loading={loading}>
          {submitLabel}
        </Button>

        <Button type="default" htmlType="submit" size="large" loading={loading} onClick={() => onFinishAndCreateNext(usedForm.getFieldsValue())}>
          {submitLabel} & Create Next
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdultPatientForm; 