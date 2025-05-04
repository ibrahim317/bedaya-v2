"use client";

import { Form, Input, Radio, Row, Col, Space } from "antd";

const HabitsSection = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      <div className="mb-4 underline underline-offset-1 font-bold block">
        Habits Of Medical importance
      </div>
      <Row align="middle">
        <Col>
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
                    <Form.Item
                      label="IF YES, Rate:"
                      name={["smokingStatus", "smokingPerDay"]}
                    >
                      <Input
                        type="number"
                        suffix="/day"
                        placeholder="Smoking per day"
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label="Type: "
                      name={["smokingStatus", "type"]}
                    >
                      <Input placeholder="Type" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label="Other: "
                      name={["smokingStatus", "other"]}
                    >
                      <Input />
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
  );
};

export default HabitsSection;