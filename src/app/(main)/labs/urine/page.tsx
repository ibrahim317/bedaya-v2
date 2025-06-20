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

const UrineLabPage = () => {
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

          const urineTest = fetchedPatient.labTest?.find(
            (test) => test.labTestName === "Urine"
          );

          if (urineTest && urineTest.results) {
            const formValues = urineTest.results.reduce((acc, result) => {
              if (result.name === "Abnormal Findings") {
                acc["abnormalFindings"] = result.value;
              } else if (result.name === "Additional Comments") {
                acc["additionalComments"] = result.value;
              } else {
                acc[result.name] = result.value;
              }
              return acc;
            }, {} as any);

            formValues.checkedOutUrine =
              urineTest.status === PatientLabTestStatus.CheckedOut
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

    const { checkedOutUrine, additionalComments, abnormalFindings, ...results } = values;

    const labTestResults = Object.keys(results).map((key) => {
      // Find the corresponding test item to get refValue and unit
      const testItem = [
        ...physicalExamItems,
        ...chemicalExamItems,
        ...microscopicExamItems,
      ].find((item) => item.name === key);
      return {
        name: key,
        value: results[key],
        refValue: testItem?.refValue || "",
        unit: testItem?.unit || "",
      };
    });
    
    // Add abnormal findings and comments
    labTestResults.push({
      name: 'abnormalFindings',
      value: abnormalFindings,
      refValue: '',
      unit: ''
    });
     labTestResults.push({
      name: 'additionalComments',
      value: additionalComments,
      refValue: '',
      unit: ''
    });

    try {
      await updateLabTest(String(patient._id), {
        labTestName: "Urine",
        status:
          checkedOutUrine === "Yes"
            ? PatientLabTestStatus.CheckedOut
            : PatientLabTestStatus.CheckedIn,
        results: labTestResults,
      });
      message.success("Urine lab test submitted successfully!");
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

  const powerLevelOptions = ["positive", "trace", "+", "++", "+++" ];

  const physicalExamItems: TestItem[] = [
    {
      name: "Colour",
      label: "Colour",
      refValue: "Amber yellow",
      type: "input",
    },
    { name: "Aspect", label: "Aspect", refValue: "Clear", type: "input" },
  ];

  const chemicalExamItems: TestItem[] = [
    {
      name: "Blood",
      label: "Blood",
      refValue: "-ve",
      type: "select",
      options: powerLevelOptions,
    },
    {
      name: "Urobilinogen",
      label: "Urobilinogen",
      refValue: "0.5-1 mg/dl",
      type: "select",
      options: ["negative", "2", "4", "8" ],
    },
    {
      name: "Bilirubin",
      label: "Bilirubin",
      refValue: "-ve",
      type: "select",
      options: powerLevelOptions,
    },
    {
      name: "Protein",
      label: "Protein",
      refValue: "-",
      type: "select",
      options: powerLevelOptions,
    },
    {
      name: "Nitrite",
      label: "Nitrite",
      refValue: "-ve",
      type: "select",
      options: ["negative", "positive"],
    },
    {
      name: "Ketone bodies",
      label: "Ketone bodies",
      refValue: "-ve",
      type: "select",
      options: powerLevelOptions,
    },
    {
      name: "Glucose",
      label: "Glucose",
      refValue: "-ve",
      type: "select",
      options: powerLevelOptions,
    },
    { name: "PH", label: "PH", refValue: "4.5-7.5", type: "input" },
    {
      name: "Leukocyte esterase",
      label: "Leukocyte esterase",
      refValue: "-ve",
      type: "select",
      options: ["negative", "trace", "positive"],
    },
    {
      name: "Specific gravity",
      label: "Specific gravity",
      refValue: "-ve",
      type: "select",
      options: ["1,000","1,005","1,010","1,015","1,020","1,025","1,030"]
    },
  ];

  const microscopicExamItems: TestItem[] = [
    { name: "RBCs", label: "RBCs", refValue: "0-3/HPF", type: "input" },
    { name: "Pus cells", label: "Pus cells", refValue: "0-3/HPF", type: "input" },
    { name: "Epithelial cells", label: "Epithelial cells", refValue: "Few/HPF", type: "input" },
    {
      name: "Calcium Oxalate",
      label: "Calcium Oxalate",
      refValue: "Absent",
      type: "select",
      options: powerLevelOptions,
    },
    {
      name: "Uric acid",
      label: "Uric acid",
      refValue: "Absent",
      type: "select",
      options: powerLevelOptions,
    },
    {
      name: "Triple phosphate",
      label: "Triple phosphate",
      refValue: "Absent",
      type: "select",
      options: powerLevelOptions,
    },
    {
      name: "Amorphous",
      label: "Amorphous",
      refValue: "Absent",
      type: "select",
      options: powerLevelOptions,
    },
  ];
    
  const abnormalFindingsOptions = ["Casts", "Eggs", "Mucus", "Bacteria", "Yeast", "Sperms"];


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="text-center mb-6">
        Urine Lab For {patient?.name} ({patient?.code})
      </Title>
      {patient ? (
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Collapse defaultActiveKey={["1", "2", "3", "4"]} >
          <Panel header="Physical Examination" key="1">
            {physicalExamItems.map(renderTestItem)}
          </Panel>
          <Panel header="Chemical Examination" key="2">
            {chemicalExamItems.map(renderTestItem)}
          </Panel>
          <Panel header="Microscopic Examination" key="3">
            {microscopicExamItems.map(renderTestItem)}
          </Panel>
          <Panel header="Abnormal findings" key="4">
              <Form.Item name="abnormalFindings">
                  <Checkbox.Group options={abnormalFindingsOptions} />
              </Form.Item>
          </Panel>
        </Collapse>
        
        <Card className="mt-6">
            <Form.Item name="additionalComments" label="Additional Comments:">
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item name="checkedOutUrine" label="Checked out Urine">
                <Radio.Group>
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                </Radio.Group>
            </Form.Item>
        </Card>

        <div className="text-center mt-6">
          <Button type="primary" htmlType="submit" size="large">
            Submit Urine Lab Results
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


const UrineLabPageWrapper = () => (
    <App>
        <UrineLabPage />
    </App>
)

export default UrineLabPageWrapper;