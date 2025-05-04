"use client";

import { Form, Input, Radio, Row, Col, Space } from "antd";

const FemaleSpecificSection = () => {
  return (
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
                          getFieldValue(["contraceptionMethod", "method"]) ===
                            "Other" && (
                            <Form.Item
                              name={["contraceptionMethod", "otherMethod"]}
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
  );
};

export default FemaleSpecificSection;