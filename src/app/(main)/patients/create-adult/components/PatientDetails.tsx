"use client";

import { Form, Input, Radio, Row, Col } from "antd";
import { MaritalStatus, EducationLevel } from "@/types/Patient";

const PatientDetails = () => {
  return (
    <div className="border-2 border-dashed border-gray-400 rounded-md p-4">
      <Row gutter={16}>
        <Col>
          <Form.Item
            label="Patient Name"
            name="name"
            rules={[{ required: true, message: "Please enter patient name" }]}
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
            <Input type="text" placeholder="Enter age" />
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
      <Row gutter={16} className="mb-4 flex items-center">
        <Col>
          <div className="text-gray-500 font-medium mb-2">If Married</div>
        </Col>

        <Col>
          <Form.Item label="Number of Children" name="numberOfChildren">
            <Input type="number" placeholder="Enter number of children" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="Age of Youngest Child" name="ageOfYoungestChild">
            <Input type="text" placeholder="Enter age of youngest child" />
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
    </div>
  );
};

export default PatientDetails;