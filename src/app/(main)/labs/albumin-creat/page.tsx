"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Typography,
  Collapse,
  Checkbox,
  Radio,
  message,
  Card,
  App,
} from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchPatientById,
  updateLabTest,
} from "@/clients/patientClient";
import {
  IPatient,
  PatientLabTestStatus,
  PatientType,
} from "@/types/Patient";

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

interface TestItem {
  name: string;
  label: string;
  refValue: string;
  type: "input" | "select";
  options?: string[];
  placeholder?: string;
  unit?: string;
}

const AlbuminCreatLabPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = App.useApp();

  const [patient, setPatient] = useState<IPatient | null>(null);

  const patientId = searchParams.get("patientId");

  useEffect(() => {
    if (patientId) {
      const fetchAndSetPatient = async () => {
        try {
          const fetchedPatient = await fetchPatientById(patientId);
          setPatient(fetchedPatient);

          const albuminCreatTest = fetchedPatient.labTest?.find(
            (test) => test.labTestName === "Albumin-Creat"
          );

          if (albuminCreatTest && albuminCreatTest.results) {
            const formValues = albuminCreatTest.results.reduce((acc, result) => {
              acc[result.name] = result.value;
              return acc;
            }, {} as any);

            formValues.checkedOutAlbuminCreat =
              albuminCreatTest.status === PatientLabTestStatus.CheckedOut
                ? "Yes"
                : "No";

            form.setFieldsValue(formValues);
          }
        } catch (error) {
          message.error("Failed to load patient data.");
        }
      };
      fetchAndSetPatient();
    }
  }, [patientId, message, form]);

  const onFinish = async (values: any) => {
    if (!patient) {
      message.error("Please select a patient first.");
      return;
    }

    const { checkedOutAlbuminCreat, ...results } = values;

    const labTestResults = Object.keys(results).map((key) => {
      // Find the corresponding test item to get refValue and unit
      const testItem = [
        ...albuminCreatTestItems,
      ].find((item) => item.name === key);
      return {
        name: key,
        value: results[key],
        refValue: testItem?.refValue || "",
        unit: testItem?.unit || "",
      };
    });
  
    try {
      await updateLabTest(String(patient._id), {
        labTestName: "Albumin-Creat",
        status:
          checkedOutAlbuminCreat === "Yes"
            ? PatientLabTestStatus.CheckedOut
            : PatientLabTestStatus.CheckedIn,
        results: labTestResults,
      });
      message.success("Albumin-Creat lab test submitted successfully!");
      router.push("/labs");
    } catch (error) {
      message.error("Failed to submit lab test.");
    }
  };

  const renderTestItem = (item: TestItem) => (
    <Row
      key={item.name}
      align="middle"
      style={{ marginBottom: 12, width: "100%" }}
      gutter={16}
    >
      <Col xs={24} sm={8}>
        <Text strong>{item.label}:</Text>
      </Col>
      <Col xs={24} sm={8}>
        <Form.Item name={item.name} noStyle>
          {item.type === "select" ? (
            <Select placeholder={item.placeholder || "Select"} style={{ width: "100%" }}>
              {item.options?.map((opt: string) => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>
          ) : (
            <Input placeholder={item.placeholder || "result"} />
          )}
        </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
        <Text type="secondary">{item.refValue}</Text>
      </Col>
    </Row>
  );


  const albuminCreatTestItems: TestItem[] = [
      { name: "Albumin", label: "Albumin", refValue: "<30 mg/g", type: "input" },
      { name: "Creat", label: "Creat", refValue: "20-275 mg/dl in Females 20-320 mg/dl in male", type: "input" },
      { name: "Albumin-Creat ratio", label: "Albumin/Creat ratio", refValue: "Normal < 30 mg/dl Microalbuminuria 30-300 mg/g Macroalbuminuria > 300 mg/g", type: "input" },
  ];


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center mb-6">
        Albumin/Creat Lab For {patient?.name} ({patient?.code})
      </Title>
      {patient ? (
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Collapse defaultActiveKey={["1"]} >
          <Panel header="Albumin/Creat test" key="1">
            {albuminCreatTestItems.map(renderTestItem)}
          </Panel>
        </Collapse>
        
        <Card className="mt-6">
            <Form.Item name="checkedOutAlbuminCreat" label="Checked out Albumin/Creat">
                <Radio.Group>
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                </Radio.Group>
            </Form.Item>
        </Card>

        <div className="text-center mt-6">
          <Button type="primary" htmlType="submit" size="large">
            Save & Done
          </Button>
        </div>
      </Form>
      ) : (
        <div className="text-center p-10">
            <Text>{patientId ? "Loading patient data..." : "No patient selected."}</Text>
        </div>
      )}

    </div>
  );
};


const AlbuminCreatLabPageWrapper = () => (
    <App>
        <AlbuminCreatLabPage />
    </App>
)

export default AlbuminCreatLabPageWrapper;