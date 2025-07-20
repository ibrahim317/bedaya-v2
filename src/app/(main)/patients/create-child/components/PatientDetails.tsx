"use client";

import { Form, Input, Radio, Row, Col } from "antd";
import { MaritalStatus, EducationLevel } from "@/types/Patient";

const PatientDetails = () => {
  return (
    <div className="border-2 border-dashed border-gray-400 rounded-md p-4">
      <Row>
        <Col span={8}>
          <Form.Item
            label="Patient Name"
            name="name"
            rules={[{ required: true, message: "Please enter patient name" }]}
          >
            <Input placeholder="Enter patient name" />
          </Form.Item>
        </Col>
        <Col span={8} className="flex justify-center">
          <Form.Item
            label="Sex"
            name="sex"
            rules={[{ required: true, message: "Please select sex" }]}
          >
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} align="middle">
        <Col span={8}>
          <Form.Item label="Age" name="age">
            <Input type="text" placeholder="Age" />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Father Occupation" name="fatherOccupation">
            <Input placeholder="Father Occupation" />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Mobile Number" name="mobileNumber">
            <Input placeholder="Mobile Number" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Item label="Father Education" name="fatherEducationLevel">
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
      <Row>
        <Col>
          <Form.Item label="Mother Education" name="motherEducationLevel">
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
    </div>
  );
};

export default PatientDetails;
