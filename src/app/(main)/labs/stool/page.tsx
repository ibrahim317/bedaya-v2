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
} from "@/types/Patient";

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

interface TestItem {
  name: string;
  label: string;
  type: "input" | "radio" | "select";
  options?: string[];
  placeholder?: string;
}

const StoolLabPage = () => {
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

          const stoolTest = fetchedPatient.labTest?.find(
            (test) => test.labTestName === "Stool"
          );

          if (stoolTest && stoolTest.results) {
            const formValues = stoolTest.results.reduce((acc, result) => {
              acc[result.name] = result.value;
              return acc;
            }, {} as any);

            formValues.checkedOutStool =
              stoolTest.status === PatientLabTestStatus.CheckedOut
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

    const { checkedOutStool, ...results } = values;

    const labTestResults = Object.keys(results).map((key) => ({
      name: key,
      value: results[key],
      refValue: "",
      unit: "",
    }));

    try {
      await updateLabTest(String(patient._id), {
        labTestName: "Stool",
        status:
          checkedOutStool === "Yes"
            ? PatientLabTestStatus.CheckedOut
            : PatientLabTestStatus.CheckedIn,
        results: labTestResults,
      });
      message.success("Stool lab test submitted successfully!");
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
      <Col xs={24} sm={16}>
        <Form.Item name={item.name} noStyle>
          {item.type === "radio" ? (
            <Radio.Group>
              {item.options?.map((opt) => (
                <Radio key={opt} value={opt}>
                  {opt}
                </Radio>
              ))}
            </Radio.Group>
          ) : (
            <Input placeholder={item.placeholder || "Result"} />
          )}
        </Form.Item>
      </Col>
    </Row>
  );

  const physicalDataItems: TestItem[] = [
    { name: "Consistency", label: "Consistency", type: "radio", options: ["Formed", "Semi formed", "Loose"] },
    { name: "Blood", label: "Blood", type: "radio", options: ["+VE", "-VE"] },
    { name: "Mucus", label: "Mucus", type: "radio", options: ["+VE", "-VE"] },
    { name: "Color", label: "Color", type: "input" },
    { name: "Worm", label: "Worm", type: "input" },
    { name: "Odour", label: "Odour", type: "input" },
  ];
  
  const microscopicDataItems: TestItem[] = [
    { name: "Fasciola", label: "Fasciola", type: "radio", options: ["+VE", "-VE"] },
    { name: "Sch. Mansoni", label: "Sch. Mansoni", type: "radio", options: ["+VE", "-VE"] },
    { name: "H.nana", label: "H.nana", type: "radio", options: ["+VE", "-VE"] },
    { name: "Tinea", label: "Tinea", type: "radio", options: ["+VE", "-VE"] },
    { name: "Ascaris", label: "Ascaris", type: "radio", options: ["+VE", "-VE"] },
    { name: "T.trichuria", label: "T.trichuria", type: "radio", options: ["+VE", "-VE"] },
    { name: "Hook worm", label: "Hook worm", type: "radio", options: ["+VE", "-VE"] },
    { name: "Entrobious", label: "Entrobious", type: "radio", options: ["+VE", "-VE"] },
    { name: "E.coli", label: "E.coli", type: "radio", options: ["+VE", "-VE"] },
    { name: "E.histolitica", label: "E.histolitica", type: "radio", options: ["+VE", "-VE"] },
    { name: "Giardia", label: "Giardia", type: "radio", options: ["+VE", "-VE"] },
    { name: "Strongyloides larvae", label: "Strongyloides larvae", type: "radio", options: ["+VE", "-VE"] },
    { name: "Giardia trophozoite", label: "Giardia trophozoite", type: "radio", options: ["+VE", "-VE"] },
    { name: "E.histolitica trophozoite", label: "E.histolitica trophozoite", type: "radio", options: ["+VE", "-VE"] },
    { name: "Blastocyat hominis", label: "Blastocyat hominis", type: "radio", options: ["+VE", "-VE"] },
    { name: "Candida albicans", label: "Candida albicans", type: "radio", options: ["+VE", "-VE"] },
    { name: "Wbcs", label: "Wbcs", type: "input" },
    { name: "Rbcs", label: "Rbcs", type: "input" },
    { name: "H-pylori", label: "H-pylori", type: "radio", options: ["+VE", "-VE"] },
    { name: "Fecal occult blood", label: "Fecal occult blood", type: "radio", options: ["+VE", "-VE"] },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center mb-6">
        Stool Lab For {patient?.name} ({patient?.code})
      </Title>

      {patient ? (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Collapse defaultActiveKey={["1", "2"]}>
            <Panel header="Physical data" key="1">
              {physicalDataItems.map(renderTestItem)}
            </Panel>
            <Panel header="Microscopic data" key="2">
              {microscopicDataItems.map(renderTestItem)}
            </Panel>
          </Collapse>
          
          <Card className="mt-6">
            <Form.Item name="checkedOutStool" label="Checked out:">
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

const StoolLabPageWrapper = () => (
  <App>
    <StoolLabPage />
  </App>
);

export default StoolLabPageWrapper;