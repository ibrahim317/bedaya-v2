"use client";

import { Form, Input, Button, Row, Col } from "antd";
import type { FormInstance } from "antd/es/form";

interface BasicInformationTopProps {
  form: FormInstance; // We need the form instance for the day buttons
}

const BasicInformationTop = ({ form }: BasicInformationTopProps) => {
  return (
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
          rules={[{ required: true, message: "Please enter patient code" }]}
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
  );
};

export default BasicInformationTop;