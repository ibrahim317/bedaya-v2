"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Collapse,
  Card,
  App,
  Divider,
} from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchPatientById,
  updateLabTest,
} from "@/clients/patientClient";
import {
  IPatient,
  PatientLabTestStatus,
  PatientLabTestResult,
} from "@/types/Patient";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface TestItem {
  name: string;
  label: string;
  refValue: string;
}

const BloodLabPage = () => {
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

          const bloodTest = fetchedPatient.labTest?.find(
            (test) => test.labTestName === "Blood"
          );

          if (bloodTest && bloodTest.results) {
            const formValues = bloodTest.results.reduce((acc, result) => {
              acc[result.name] = result.value;
              return acc;
            }, {} as any);
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

    const allItems = [...cbcItems, esrItem, ...lipidProfileItems];

    const labTestResults: PatientLabTestResult[] = Object.keys(values).map(
      (key) => {
        const item = allItems.find((i) => i.name === key);
        return {
          name: key,
          value: values[key],
          refValue: item?.refValue || "",
          unit: item?.refValue.split(" ")[1] || "",
        };
      }
    );

    try {
      await updateLabTest(String(patient._id), {
        labTestName: "Blood",
        status: PatientLabTestStatus.CheckedOut, // Defaulting to CheckedOut as per form design
        results: labTestResults,
      });
      message.success("Blood lab test submitted successfully!");
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
        <Text strong>{item.label}</Text>
      </Col>
      <Col xs={24} sm={8}>
        <Form.Item name={item.name} noStyle>
          <Input placeholder="Result" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
        <Text type="secondary">{item.refValue}</Text>
      </Col>
    </Row>
  );

  const cbcItems: TestItem[] = [
    { name: "WBC", label: "WBC", refValue: "10*3/ul" },
    { name: "Lymph#", label: "Lymph#", refValue: "10*3/ul" },
    { name: "Mid#", label: "Mid#", refValue: "10*3/ul" },
    { name: "Gran#", label: "Gran#", refValue: "10*3/ul" },
    { name: "Lymph% H", label: "Lymph% H", refValue: "%" },
    { name: "Mid %", label: "Mid %", refValue: "%" },
    { name: "Gran% L", label: "Gran% L", refValue: "%" },
    { name: "RBC", label: "RBC", refValue: "10*6/ul" },
    { name: "HGB L", label: "HGB L", refValue: "g/dl" },
    { name: "HCT L", label: "HCT L", refValue: "%" },
    { name: "MCV L", label: "MCV L", refValue: "fL" },
    { name: "MCH L", label: "MCH L", refValue: "pg" },
    { name: "MCHC", label: "MCHC", refValue: "g/dl" },
    { name: "RDW.CV", label: "RDW.CV", refValue: "%" },
    { name: "RDW.SD L", label: "RDW.SD L", refValue: "fL" },
    { name: "PLT H", label: "PLT H", refValue: "10*3/ul" },
    { name: "MPV", label: "MPV", refValue: "fL" },
    { name: "PDW", label: "PDW", refValue: "-" },
    { name: "PCT", label: "PCT", refValue: "%" },
    { name: "P-LCC L", label: "P-LCC L", refValue: "10*9/l" },
    { name: "P-LCR L", label: "P-LCR L", refValue: "-" },
  ];

  const esrItem: TestItem = {
    name: "ESR",
    label: "ESR",
    refValue: "M<19 / F<20 mm/hr",
  };

  const lipidProfileItems: TestItem[] = [
    { name: "Cholesterol", label: "Cholesterol", refValue: "<200 mg/dl" },
    { name: "TG", label: "TG", refValue: "35-160 mg/dl" },
    { name: "HDL", label: "HDL", refValue: ">60 mg/dl" },
    { name: "LDL", label: "LDL", refValue: "<100 mg/dl" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center mb-6">
        Blood Lab For {patient?.name} ({patient?.code})
      </Title>

      {patient ? (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Collapse defaultActiveKey={["1", "2", "3"]}>
            <Panel header="CBC" key="1">
              <div
              >
                {cbcItems.map(renderTestItem)}
              </div>
            </Panel>
            <Panel header="ESR" key="2">
              {renderTestItem(esrItem)}
            </Panel>
            <Panel header="Lipid Profile" key="3">
              {lipidProfileItems.map(renderTestItem)}
            </Panel>
          </Collapse>

          <div className="text-center mt-6">
            <Button type="primary" htmlType="submit" size="large">
              Save & Continue
            </Button>
          </div>
        </Form>
      ) : (
        <div className="text-center p-10">
          <Text>
            {patientId ? "Loading patient data..." : "No patient selected."}
          </Text>
        </div>
      )}
    </div>
  );
};

const BloodLabPageWrapper = () => (
  <App>
    <BloodLabPage />
  </App>
);

export default BloodLabPageWrapper;