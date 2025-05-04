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
                  <Checkbox>Nephropathy screening (IM / Ophth / Labs)</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name={["screening", "uti"]} valuePropName="checked">
                  <Checkbox>UTI (dipstick urine test) (urine lab)</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name={["screening", "ogtt"]} valuePropName="checked">
                  <Checkbox>OGTT (pregnant) (Obs & Gyn / Labs)</Checkbox>
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