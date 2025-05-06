"use client";

import { Form, Input, Radio, Checkbox, Row, Col } from "antd";

const PastHistorySection = () => {
  const form = Form.useFormInstance();

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
                <Form.Item name={["allergyHistory", "enabled"]} noStyle>
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
                    prevValues.allergyHistory?.enabled !==
                    currentValues.allergyHistory?.enabled
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue(["allergyHistory", "enabled"]) && (
                      <Form.Item name={["allergyHistory", "type"]} noStyle>
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
                <Form.Item name={["bloodTransfusion", "type"]} noStyle>
                  <Radio.Group>
                    <Radio value="occasional">Occasional</Radio>
                    <Radio value="regular">Regular</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item noStyle name={["bloodTransfusion", "duration"]}>
                  <Input placeholder="Duration" style={{ width: 100 }} />
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
                  name={["surgicalHistory", "ICU"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>ICU</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={["surgicalHistory", "operation", "enabled"]}
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
                    prevValues.surgicalHistory?.operation?.enabled !==
                    currentValues.surgicalHistory?.operation?.enabled
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue([
                      "surgicalHistory",
                      "operation",
                      "enabled",
                    ]) && (
                      <Form.Item
                        name={["surgicalHistory", "operation", "type"]}
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
                  name={["drugsForChronicDisease", "antiHTN"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>Anti HTN</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={["drugsForChronicDisease", "oralHypoglycemic"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>Oral Hypoglycemic</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={["drugsForChronicDisease", "antiepileptic"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>Antiepileptic</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={["drugsForChronicDisease", "antidiuretic"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>Antidiuretic</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={["drugsForChronicDisease", "otherEnabled"]}
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
                    prevValues.drugsForChronicDisease?.otherEnabled !==
                    currentValues.drugsForChronicDisease?.otherEnabled
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue([
                      "drugsForChronicDisease",
                      "otherEnabled",
                    ]) && (
                      <Form.Item
                        name={["drugsForChronicDisease", "other"]}
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
                  name={["familyHistory", "otherEnabled"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>Other</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev.familyHistory?.otherEnabled !==
                    curr.familyHistory?.otherEnabled
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue(["familyHistory", "otherEnabled"]) && (
                      <Form.Item name={["familyHistory", "other"]} noStyle>
                        <Input placeholder="Other (specify)" />
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
