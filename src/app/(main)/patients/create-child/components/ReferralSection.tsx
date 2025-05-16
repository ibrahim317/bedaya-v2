"use client";

import { Form, Checkbox, Row, Col, Input } from "antd";

const ReferralSection = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      <h3 className="font-bold mb-2">Referral of convoy clinics</h3>

      <Row gutter={[16, 8]}>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "ENT"]} valuePropName="checked">
            <Checkbox>ENT</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "cardio"]} valuePropName="checked">
            <Checkbox>Cardio</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "dental"]} valuePropName="checked">
            <Checkbox>Dental</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "ophth"]} valuePropName="checked">
            <Checkbox>Ophthalmology</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "derma"]} valuePropName="checked">
            <Checkbox>Derma</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "surgery"]} valuePropName="checked">
            <Checkbox>Surgery</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "gyn"]} valuePropName="checked">
            <Checkbox>Gyn</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "pharmacy"]} valuePropName="checked">
            <Checkbox>Pharmacy</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "goHome"]} valuePropName="checked">
            <Checkbox>Go home!</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Form.Item name={["referral", "other"]}>
            <Input placeholder="Other referral details" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16} className="mt-4">
        <Col xs={12} md={6}>
          <Form.Item name="followUp" valuePropName="checked">
            <Checkbox>Follow Up</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item name="communityDevelopment" valuePropName="checked">
            <Checkbox>Community Development</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ReferralSection;