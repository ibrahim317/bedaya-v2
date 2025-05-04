"use client";

import { Form, Input, Radio, Checkbox, Row, Col } from "antd";

const PastHistorySection = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      <h3 className="font-bold mb-2 underline-offset-1 underline">
        Past History:
      </h3>

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
                    getFieldValue(["bloodTransfusion", "has"]) !== false && (
                      <Form.Item
                        name={["bloodTransfusion", "duration"]}
                        noStyle
                      >
                        <Input placeholder="Duration" style={{ width: 100 }} />
                      </Form.Item>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>

        <Col>
          <Form.Item label="Surgical" className="mb-2">
            <Row align="middle">
              <Col>
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
                    getFieldValue(["chronicDrugs", "other", "enabled"]) && (
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
                    getFieldValue(["familyHistory", "other", "enabled"]) && (
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
  );
};

export default PastHistorySection;