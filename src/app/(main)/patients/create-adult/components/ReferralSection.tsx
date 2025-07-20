"use client";

import { Form, Checkbox, Row, Col } from "antd";

const ReferralSection = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      <h3 className="font-bold mb-2">Referral of convoy clinics</h3>

      <Row gutter={[16, 8]}>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "IM"]} valuePropName="checked">
            <Checkbox>IM</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "cardio"]} valuePropName="checked">
            <Checkbox>Cardio</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "surgery"]} valuePropName="checked">
            <Checkbox>Surgery</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "ophth"]} valuePropName="checked">
            <Checkbox>Ophth</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={3}>
          <Form.Item name={["referral", "obsAndGyn"]} valuePropName="checked">
            <Checkbox>Obs & Gyn</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "ENT"]} valuePropName="checked">
            <Checkbox>ENT</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "derma"]} valuePropName="checked">
            <Checkbox>Derma</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "ortho"]} valuePropName="checked">
            <Checkbox>Ortho</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "familyMedicine"]} valuePropName="checked">
            <Checkbox>Family Medicine</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "dental"]} valuePropName="checked">
            <Checkbox>Dental</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "pediatric"]} valuePropName="checked">
            <Checkbox>Pediatric</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Item name={["referral", "radiology"]} valuePropName="checked">
            <Checkbox>Radiology</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={6} sm={4} md={3}>
          <Form.Item name={["referral", "goHome"]} valuePropName="checked">
            <Checkbox>Go home!</Checkbox>
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