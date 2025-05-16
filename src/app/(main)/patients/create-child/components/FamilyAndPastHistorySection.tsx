import React from "react";
import { Form, Input, Row, Col } from "antd";

const FamilyAndPastHistorySection: React.FC = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      {/* Family History Section */}
      <Row gutter={[16, 16]} align="top" className="mb-4">
        <Col xs={24} md={4}>
          <h3 className="font-bold text-md mb-2 md:mb-0 underline underline-offset-2">
            Family History:
          </h3>
        </Col>
        <Col xs={24} md={20}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label="DM" name={["childFamilyHistory", "DM"]}>
                <Input placeholder="DM details" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label="HTN" name={["childFamilyHistory", "HTN"]}>
                <Input placeholder="HTN details" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Similar Condition"
                name={["childFamilyHistory", "similarCondition"]}
              >
                <Input placeholder="Similar Condition" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Genetic Disease"
                name={["childFamilyHistory", "geneticDisease"]}
              >
                <Input placeholder="Specify genetic disease" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Past History Section */}
      <Row gutter={[16, 16]} align="top">
        <Col xs={24} md={4}>
          <h3 className="font-bold text-md mb-2 md:mb-0 underline underline-offset-2">
            Past History:
          </h3>
        </Col>
        <Col xs={24} md={20}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item label="Medical" name={["medicalHistory", "other"]}>
                <Input placeholder="Medical history details" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item label="Allergy" name={["allergyHistory", "type"]}>
                <Input placeholder="Allergy details" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item label="ICU" name={["icuHistory", "other"]}>
                <Input placeholder="ICU history details" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Surgical"
                name={["surgicalHistory", "operation", "type"]}
              >
                <Input placeholder="Surgical history details" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Blood Transfusion"
                name={["bloodTransfusion", "details"]}
              >
                <Input placeholder="Blood transfusion details" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FamilyAndPastHistorySection;
