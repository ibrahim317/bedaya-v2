"use client";

import { Form, Input, Checkbox, Row, Col, Card } from "antd";

const ExaminationAndScreeningSection = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="General Examination" size="small">
            <h4 className="font-bold mb-2">Vital Data</h4>
            <Row gutter={[16, 8]}>
              <Col xs={8}>
                <Form.Item label="BP" name={["generalExamination", "vitalData", "BP"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label="HR" name={["generalExamination", "vitalData", "PR"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label="Temp" name={["generalExamination", "vitalData", "temperature"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label="RBS" name={["generalExamination", "vitalData", "RBS"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label="SpO2" name={["generalExamination", "vitalData", "Spo2"]}>
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
                        name={["generalExamination", "complexions", "cyanosis", "peripheral"]}
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
                        name={["generalExamination", "complexions", "cyanosis", "central"]}
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
                  name={["generalExamination", "complexions", "jaundice"]}
                  valuePropName="checked"
                >
                  <Checkbox>Jaundice</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item
                  name={["generalExamination", "complexions", "pallor"]}
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
                  name={["screening", "diabetes"]}
                  valuePropName="checked"
                >
                  <Checkbox>Diabetes screening</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  name={["screening", "knownDiabetic"]}
                  valuePropName="checked"
                >
                  <Checkbox>Known diabetic</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  name={["screening", "nonDiabetic"]}
                  valuePropName="checked"
                >
                  <Checkbox>Non diabetic</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Anthropometry" size="small">
            <Row gutter={[16, 8]}>
              <Col xs={8}>
                <Form.Item label="Weight" name={["adultAnthropometry", "weight"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label="Height" name={["adultAnthropometry", "height"]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item label="BMI" name={["adultAnthropometry", "BMI"]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExaminationAndScreeningSection;