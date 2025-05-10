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
          layout="vertical"
        >
          {/* Basic Information Section */}
          <Row gutter={16} align="middle">
            <Col xs={24} md={4}>
              <Form.Item label="Day" name="checkupDay">
                <Radio.Group optionType="button" buttonStyle="solid">
                  {[1, 2, 3, 4, 5].map((day) => (
                    <Radio.Button key={day} value={day}>{day}</Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={5}>
              <Form.Item label="Code" name="code" rules={[{ required: true, message: "Please enter code" }]}> 
                <Input placeholder="Enter code" />
              </Form.Item>
            </Col>
            <Col xs={24} md={5}>
              <Form.Item label="House Number" name="houseNumber">
                <Input placeholder="Enter house number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={5}>
              <Form.Item label="Patient Name" name="name" rules={[{ required: true, message: "Please enter patient name" }]}> 
                <Input placeholder="Enter patient name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={2}>
              <Form.Item label="Sex" name="sex" rules={[{ required: true, message: "Please select sex" }]}> 
                <Radio.Group>
                  <Radio value="M">M</Radio>
                  <Radio value="F">F</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={3}>
              <Form.Item label="Age" name="age">
                <Input type="number" placeholder="Age" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} align="middle">
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
            <Col xs={24} md={6}>
              <Form.Item label="Father Education" name="fatherEducationLevel">
                <Select placeholder="Father Education Level">
                  {Object.values(EducationLevel).map((level) => (
                    <Select.Option key={level} value={level}>{level}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Mother Education" name="motherEducationLevel">
                <Select placeholder="Mother Education Level">
                  {Object.values(EducationLevel).map((level) => (
                    <Select.Option key={level} value={level}>{level}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} align="middle">
            <Col xs={24} md={4}>
              <Form.Item label="Order of Birth" name="orderOfBirth">
                <Input placeholder="Order of Birth" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Birth Term">
                <Space>
                  <Form.Item name={["birthTerm", "fullTerm"]} valuePropName="checked" noStyle>
                    <Checkbox>Full Term</Checkbox>
                  </Form.Item>
                  <Form.Item name={["birthTerm", "preterm"]} valuePropName="checked" noStyle>
                    <Checkbox>Preterm</Checkbox>
                  </Form.Item>
                  <Form.Item name={["birthTerm", "weeks"]} noStyle>
                    <Input type="number" placeholder="Weeks" style={{ width: 70 }} />
                  </Form.Item>
                </Space>
              </Form.Item>
            </Col>
            <Col xs={24} md={7}>
              <Form.Item label="Birth Mode">
                <Space>
                  <Form.Item name={["birthMode", "VD"]} valuePropName="checked" noStyle>
                    <Checkbox>VD</Checkbox>
                  </Form.Item>
                  <Form.Item name={["birthMode", "CS"]} valuePropName="checked" noStyle>
                    <Checkbox>CS</Checkbox>
                  </Form.Item>
                  <Form.Item name={["birthMode", "CS_reason"]} noStyle>
                    <Input placeholder="CS Reason" style={{ width: 120 }} />
                  </Form.Item>
                </Space>
              </Form.Item>
            </Col>
            <Col xs={24} md={3}>
              <Form.Item name="consanguinity" valuePropName="checked">
                <Checkbox>Consanguinity</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item label="NICU Admission" name="NICUAdmission">
                <Input placeholder="NICU Admission" />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          {/* Continue with next sections in subsequent edits */}
        </Form>
      </Card>
    </div>
  );
};

export default CreatePatientPage;
