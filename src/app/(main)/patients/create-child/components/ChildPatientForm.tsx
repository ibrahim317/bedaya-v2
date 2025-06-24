import { Form, Button, Tabs } from "antd";
import BasicInformationTop from "../../components/BasicInformationTop";
import PatientDetails from "./PatientDetails";
import ComplaintSection from "../../components/ComplaintSection";
import FamilyAndPastHistorySection from "./FamilyAndPastHistorySection";
import DetailedHistorySection from "./DetailedHistorySection";
import GeneralExaminationSection from "./GeneralExaminationSection";
import ReferralSection from "./ReferralSection";
import LocalExaminationSection from "./LocalExaminationSection";
import ScreeningSection from "./ScreeningSection";
import ImageUploader from "../../components/ImageUploader";

const { TabPane } = Tabs;

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

  const handleFollowUpUpload = (urls: string[]) => {
    usedForm.setFieldsValue({ followUpImages: urls });
  };

  const handleScreeningUpload = (urls: string[]) => {
    usedForm.setFieldsValue({ screeningImages: urls });
  };

  return (
    <Form
      form={usedForm}
      onFinish={onFinish}
      layout="vertical"
      initialValues={initialValues}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Patient Data" key="1">
          <BasicInformationTop form={usedForm} />
          <PatientDetails />
          <ComplaintSection />
          <FamilyAndPastHistorySection />
          <DetailedHistorySection />
          <GeneralExaminationSection />
          <LocalExaminationSection />
          <ReferralSection />
          <ScreeningSection />
        </TabPane>
        <TabPane tab="Follow up" key="2">
          <Form.Item name="followUpImages">
            <ImageUploader
              onUpload={handleFollowUpUpload}
              fieldName="followUpImages"
              initialImageUrls={patient?.followUpImages}
            />
          </Form.Item>
        </TabPane>
        <TabPane tab="Screening" key="3">
          <Form.Item name="screeningImages">
            <ImageUploader
              onUpload={handleScreeningUpload}
              fieldName="screeningImages"
              initialImageUrls={patient?.screeningImages}
            />
          </Form.Item>
        </TabPane>
      </Tabs>
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
            htmlType="submit"
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

