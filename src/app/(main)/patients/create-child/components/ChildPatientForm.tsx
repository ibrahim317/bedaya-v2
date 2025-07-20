import { Form, Button } from "antd";
import BasicInformationTop from "../../components/BasicInformationTop";
import PatientDetails from "./PatientDetails";
import ComplaintSection from "../../components/ComplaintSection";
import FamilyAndPastHistorySection from "./FamilyAndPastHistorySection";
import DetailedHistorySection from "./DetailedHistorySection";
import GeneralExaminationSection from "./GeneralExaminationSection";
import ReferralSection from "./ReferralSection";
import LocalExaminationSection from "./LocalExaminationSection";
import ScreeningSection from "./ScreeningSection";

interface ChildPatientFormProps {
  initialValues: any;
  onFinish: (values: any) => void;
  onFinishAndCreateNext?: (values: any) => void;
  submitLabel?: string;
  form?: any;
  loading?: boolean;
  patient?: any;
}

const ChildPatientForm = ({
  initialValues,
  onFinish,
  onFinishAndCreateNext,
  submitLabel = "Create Patient",
  form,
  loading = false,
  patient,
}: ChildPatientFormProps) => {
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
      <ComplaintSection />
      <FamilyAndPastHistorySection />
      <DetailedHistorySection />
      <GeneralExaminationSection />
      <LocalExaminationSection />
      <ReferralSection />
      <ScreeningSection />
      <Form.Item className="mt-6">
        <Button
          type="primary"
          className="mr-4"
          htmlType="submit"
          size="large"
          loading={loading}
        >
          {submitLabel}
        </Button>

        {onFinishAndCreateNext && (
          <Button
            type="default"
            size="large"
            loading={loading}
            onClick={() => onFinishAndCreateNext(usedForm.getFieldsValue())}
          >
            {submitLabel} & Create Next
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default ChildPatientForm;

