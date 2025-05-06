"use client";

import {
  Card,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Button,
  Row,
  Col,
  Space,
  Divider,
  Table,
} from "antd";
import { PatientType, MaritalStatus, EducationLevel } from "@/types/Patient";

const CreatePatientPage = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    // TODO: Implement form submission
    console.log(values);
  };

  return (
    <div className="md:p-6">
      <Card
        title="Bedaya Medical Caravan – Pediatric Sheet"
        className="max-w-7xl mx-auto"
      >
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            type: PatientType.Child,
            checkupDay: 1,
            followUp: false,
            communityDevelopment: false,
          }}
        >
          {/* Basic Information Section */}
          <Row gutter={16} align="middle">
            <Col xs={24} md={8}>
              <Form.Item label="Day" name="checkupDay">
                <div className="flex flex-wrap gap-4 mb-0">
                  {[1, 2, 3, 4, 5].map((day) => (
                    <Button
                      key={day}
                      type={
                        form.getFieldValue("checkupDay") === day
                          ? "primary"
                          : "default"
                      }
                      onClick={() => form.setFieldValue("checkupDay", day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Patient Code"
                name="code"
                rules={[
                  { required: true, message: "Please enter patient code" },
                ]}
              >
                <Input placeholder="Enter patient code" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="House Number" name="houseNumber">
                <Input placeholder="Enter house number" />
              </Form.Item>
            </Col>
          </Row>

          <div className="border-2 border-dashed border-gray-400 rounded-md p-4">
            <Row gutter={16}>
              <Col>
                <Form.Item
                  label="Patient Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter patient name" },
                  ]}
                >
                  <Input placeholder="Enter patient name" />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item
                  label="Sex"
                  name="sex"
                  rules={[{ required: true, message: "Please select sex" }]}
                >
                  <Radio.Group>
                    <Radio value="M">Male</Radio>
                    <Radio value="F">Female</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Age" name="age">
                  <Input type="number" placeholder="Enter age" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Occupation" name="occupation">
                  <Input placeholder="Enter occupation" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Mobile Number" name="mobileNumber">
                  <Input placeholder="Enter mobile number" />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item label="Marital Status" name="maritalStatus">
                  <Radio.Group>
                    {Object.values(MaritalStatus).map((status) => (
                      <Radio key={status} value={status}>
                        {status}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Education Level" name="educationLevel">
                  <Radio.Group>
                    {Object.values(EducationLevel).map((level) => (
                      <Radio key={level} value={level}>
                        {level}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            {/* Smoking Section */}

            <div className="my-4 underline underline-offset-1 font-bold block">
              Habits Of Medical importance
            </div>
            <Row align="middle" >
              <Col >
                <Form.Item label="Smoking" name={["smokingStatus", "enabled"]}>
                  <Radio.Group>
                    <Space direction="horizontal">
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col className="ml-4">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.smokingStatus?.enabled !==
                    currentValues.smokingStatus?.enabled
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue(["smokingStatus", "enabled"]) && (
                      <Row gutter={16} align="middle">
                      <Col>
                        <Form.Item label="IF YES, Rate:" name={["smokingStatus", "smokingPerDay"]}>
                          <Input type="number" suffix="/day" placeholder="Smoking per day" />
                          </Form.Item>
                        </Col>
                      <Col>
                        <Form.Item label="Type: " name={["smokingStatus", "type"]}>
                          <Input  placeholder="Type" />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item label="Other: " name={["smokingStatus", "other"]}>
                          <Input   />
                        </Form.Item>
                      </Col>
                      </Row>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>

            <Row align="middle">
              <Col>
                <Form.Item
                  label="Smoking Cessation"
                  name={["smokingCessation", "enabled"]}
                >
                  <Radio.Group>
                    <Space direction="horizontal">
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.smokingCessation?.enabled !==
                    currentValues.smokingCessation?.enabled
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue(["smokingCessation", "enabled"]) && (
                      <Row gutter={16} align="middle">
                        <Col>
                          <Form.Item name={["smokingCessation", "duration"]}>
                            <Input type="number" placeholder="Duration" />
                          </Form.Item>
                        </Col>
                      </Row>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </div>
          {/* Female Specific Section */}
          <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
            <Row gutter={16} className="w-full">
              <Col>
                <Form.Item label="Menstruation" name={["menstruation", "type"]}>
                  <Radio.Group>
                    <Space direction="horizontal">
                      <Radio value="Regular">Regular</Radio>
                      <Radio value="Irregular">Irregular</Radio>
                      <Radio value="Menopause">Menopause</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Gravida Number"
                  name={["menstruation", "gravidaNumber"]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Abortion Number"
                  name={["menstruation", "abortionNumber"]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>

            <Row align="middle">
              <Col>
                <Form.Item
                  label="Contraception"
                  name={["contraceptionMethod", "enabled"]}
                >
                  <Radio.Group>
                    <Space direction="horizontal">
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.contraceptionMethod?.enabled !==
                  currentValues.contraceptionMethod?.enabled
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue(["contraceptionMethod", "enabled"]) && (
                    <Form.Item name={["contraceptionMethod", "method"]}>
                      <Radio.Group>
                        <Space direction="horizontal">
                          <Radio value="IUD">IUD</Radio>
                          <Radio value="Implant">Implant</Radio>
                          <Radio value="COC">COC</Radio>
                          <Radio value="Other">Other</Radio>
                          <Col>
                            <Form.Item
                              noStyle
                              shouldUpdate={(prevValues, currentValues) =>
                                prevValues.contraceptionMethod?.method !==
                                currentValues.contraceptionMethod?.method
                              }
                            >
                              {({ getFieldValue }) =>
                                getFieldValue([
                                  "contraceptionMethod",
                                  "method",
                                ]) === "Other" && (
                                  <Form.Item
                                    name={[
                                      "contraceptionMethod",
                                      "otherMethod",
                                    ]}
                                    noStyle
                                  >
                                    <Input placeholder="Specify other" />
                                  </Form.Item>
                                )
                              }
                            </Form.Item>
                          </Col>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  )
                }
              </Form.Item>
            </Row>
          </div>

          {/* Complaint Section */}
          <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
            <h3 className="text-center font-bold mb-2">
              Complaint Analysis and history of present illness
            </h3>
            <Form.List name="complaints">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={8} align="middle" className="mb-2">
                      <Col flex="auto">
                        <Form.Item
                          {...restField}
                          name={[name, "description"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter complaint",
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={2}
                            placeholder="Enter patient complaint"
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Button type="text" danger onClick={() => remove(name)}>
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      + Add Complaint
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>

          {/* Past History Section */}
          <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
            <h3 className="font-bold mb-2 underline-offset-1 underline">Past History:</h3>

            <Row gutter={26}>
              <Col xs={24} md={12}>
                <Form.Item label="Medical" className="mb-2">
                  <Row align="middle">
                    <Col>
                      <Form.Item
                        name={["medicalHistory", "DM"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>DM</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["medicalHistory", "HTN"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>HTN</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["medicalHistory", "HCV"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>HCV</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["medicalHistory", "RHD"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>RHD</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item name={["medicalHistory", "others"]} noStyle>
                        <Input placeholder="Others" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Allergy" className="mb-2">
                  <Row gutter={8}>
                    <Col>
                      <Form.Item name={["allergy", "has"]} noStyle>
                        <Radio.Group>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={20}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                          prevValues.allergy?.has !== currentValues.allergy?.has
                        }
                      >
                        {({ getFieldValue }) =>
                          getFieldValue(["allergy", "has"]) && (
                            <Form.Item name={["allergy", "specify"]} noStyle>
                              <Input placeholder="Specify" />
                            </Form.Item>
                          )
                        }
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Blood Transfusion" className="mb-2">
                  <Row align="middle">
                    <Col>
                      <Form.Item name={["bloodTransfusion", "has"]} noStyle>
                        <Radio.Group>
                          <Radio value={false}>No</Radio>
                          <Radio value="occasional">Occasional</Radio>
                          <Radio value="regular">Regular</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                          prevValues.bloodTransfusion?.has !==
                          currentValues.bloodTransfusion?.has
                        }
                      >
                        {({ getFieldValue }) =>
                          getFieldValue(["bloodTransfusion", "has"]) &&
                          getFieldValue(["bloodTransfusion", "has"]) !==
                            false && (
                            <Form.Item
                              name={["bloodTransfusion", "duration"]}
                              noStyle
                            >
                              <Input
                                placeholder="Duration"
                                style={{ width: 100 }}
                              />
                            </Form.Item>
                          )
                        }
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

              <Col >
                <Form.Item label="Surgical" className="mb-2">
                  <Row align="middle">
                    <Col >
                      <Form.Item
                        name={["surgical", "ICU"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>ICU</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["surgical", "operation", "enabled"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Operation</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                          prevValues.surgical?.operation?.enabled !==
                          currentValues.surgical?.operation?.enabled
                        }
                      >
                        {({ getFieldValue }) =>
                          getFieldValue(["surgical", "operation", "enabled"]) && (
                            <Form.Item
                              name={["surgical", "operation", "type"]}
                              noStyle
                            >
                              <Input placeholder="Specify operation" />
                            </Form.Item>
                          )
                        }
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 8]}>
              <Col xs={24}>
                <Form.Item label="Drugs for chronic Disease" className="mb-2">
                  <Row align="middle">
                    <Col>
                      <Form.Item
                        name={["chronicDrugs", "antiHTN"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Anti HTN</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["chronicDrugs", "oralHypoglycemic"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Oral Hypoglycemic</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["chronicDrugs", "antiepileptic"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Antiepileptic</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["chronicDrugs", "antidiuretic"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Antidiuretic</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["chronicDrugs", "other", "enabled"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Other</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                          prevValues.chronicDrugs?.other?.enabled !==
                          currentValues.chronicDrugs?.other?.enabled
                        }
                      >
                        {({ getFieldValue }) =>
                          getFieldValue([
                            "chronicDrugs",
                            "other",
                            "enabled",
                          ]) && (
                            <Form.Item
                              name={["chronicDrugs", "other", "value"]}
                              noStyle
                            >
                              <Input placeholder="Specify other" />
                            </Form.Item>
                          )
                        }
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 8]}>
              <Col xs={24}>
                <Form.Item label="Family History" className="mb-2">
                  <Row align="middle">
                    <Col>
                      <Form.Item
                        name={["familyHistory", "similarCondition"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Similar Condition</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["familyHistory", "HTN"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>HTN</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["familyHistory", "DM"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>DM</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name={["familyHistory", "other", "enabled"]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Other</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                          prevValues.familyHistory?.other?.enabled !==
                          currentValues.familyHistory?.other?.enabled
                        }
                      >
                        {({ getFieldValue }) =>
                          getFieldValue([
                            "familyHistory",
                            "other",
                            "enabled",
                          ]) && (
                            <Form.Item
                              name={["familyHistory", "other", "value"]}
                              noStyle
                            >
                              <Input placeholder="Specify other" />
                            </Form.Item>
                          )
                        }
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* General Examination Section */}
          <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Card title="General Examination" size="small">
                  <h4 className="font-bold mb-2">Vital Data</h4>
                  <Row gutter={[16, 8]}>
                    <Col xs={8}>
                      <Form.Item label="BP" name={["vitalData", "bp"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={8}>
                      <Form.Item label="HR" name={["vitalData", "hr"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={8}>
                      <Form.Item label="Temp" name={["vitalData", "temp"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={8}>
                      <Form.Item label="RBS" name={["vitalData", "rbs"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={8}>
                      <Form.Item label="SpO2" name={["vitalData", "spo2"]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <h4 className="font-bold mb-2 mt-4">Complexions</h4>
                  <Row gutter={[16, 8]}>
                    <Col xs={8}>
                      <Form.Item label="Cyanosis" className="mb-1">
                        <Row>
                          <Col>
                            <Form.Item
                              name={["complexions", "cyanosis", "peripheral"]}
                              valuePropName="checked"
                              noStyle
                            >
                              <Checkbox>Peripheral</Checkbox>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Item
                              name={["complexions", "cyanosis", "central"]}
                              valuePropName="checked"
                              noStyle
                            >
                              <Checkbox>Central</Checkbox>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                    <Col xs={8}>
                      <Form.Item
                        name={["complexions", "jaundice"]}
                        valuePropName="checked"
                      >
                        <Checkbox>Jaundice</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col xs={8}>
                      <Form.Item
                        name={["complexions", "pallor"]}
                        valuePropName="checked"
                      >
                        <Checkbox>Pallor</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card title="Screening" size="small">
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Form.Item
                        name={["screening", "nephropathy"]}
                        valuePropName="checked"
                      >
                        <Checkbox>
                          Nephropathy screening (IM / Ophth / Labs)
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        name={["screening", "UTI"]}
                        valuePropName="checked"
                      >
                        <Checkbox>
                          UTI (dipstick urine test) (urine lab)
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        name={["screening", "OGTT"]}
                        valuePropName="checked"
                      >
                        <Checkbox>OGTT (pregnant) (Obs & Gyn / Labs)</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Referral Section */}
          <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
            <h3 className="font-bold mb-2">Referral of convoy clinics</h3>

            <Row gutter={[16, 8]}>
              <Col xs={6} sm={4} md={2}>
                <Form.Item name={["referral", "IM"]} valuePropName="checked">
                  <Checkbox>IM</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={6} sm={4} md={2}>
                <Form.Item
                  name={["referral", "cardio"]}
                  valuePropName="checked"
                >
                  <Checkbox>Cardio</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={6} sm={4} md={2}>
                <Form.Item
                  name={["referral", "surgery"]}
                  valuePropName="checked"
                >
                  <Checkbox>Surgery</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={6} sm={4} md={2}>
                <Form.Item name={["referral", "ophth"]} valuePropName="checked">
                  <Checkbox>Ophth</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={6} sm={4} md={3}>
                <Form.Item
                  name={["referral", "obsAndGyn"]}
                  valuePropName="checked"
                >
                  <Checkbox>Obs & Gyn</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={6} sm={4} md={2}>
                <Form.Item name={["referral", "ENT"]} valuePropName="checked">
                  <Checkbox>ENT</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={6} sm={4} md={2}>
                <Form.Item name={["referral", "derma"]} valuePropName="checked">
                  <Checkbox>Derma</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={6} sm={4} md={2}>
                <Form.Item name={["referral", "ortho"]} valuePropName="checked">
                  <Checkbox>Ortho</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={6} sm={4} md={2}>
                <Form.Item
                  name={["referral", "dental"]}
                  valuePropName="checked"
                >
                  <Checkbox>Dental</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={6} sm={4} md={3}>
                <Form.Item
                  name={["referral", "goHome"]}
                  valuePropName="checked"
                >
                  <Checkbox>Go home!</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16} className="mt-4">
              <Col xs={12} md={6}>
                <Form.Item name="followUp" valuePropName="checked">
                  <Checkbox>Follow Up</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item name="communityDevelopment" valuePropName="checked">
                  <Checkbox>Community Development</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </div>

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
