import React from "react";
import { Form, Checkbox, Row, Col, Input, Typography } from "antd";

const { Text } = Typography;

const DetailedHistorySection: React.FC = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      {/* Immunization History */}
      <Row
        gutter={[16, 0]}
        align="top"
        className="mb-4 pb-4 border-b border-gray-200"
      >
        <Col xs={24} md={6}>
          <Text strong className="text-md">
            Immunization History
          </Text>
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={8}>
              <Form.Item
                name={["immunizationHistory", "upToDate"]}
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Up To Date</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name={["immunizationHistory", "delayed"]}
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Delayed</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name={["immunizationHistory", "noVaccinations"]}
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Didn't Receive Any Vaccinations</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Dietetic History */}
      <Row
        gutter={[16, 0]}
        align="top"
        className="mb-4 pb-4 border-b border-gray-200"
      >
        <Col xs={24} md={6}>
          <Text strong className="text-md">
            Dietetic History
          </Text>
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={[16, 8]}>
            <Col xs={12} sm={6}>
              <Form.Item
                name={["dieteticHistory", "breastFeeding"]}
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Breast Feeding</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item
                name={["dieteticHistory", "artificialFeeding"]}
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Artificial Feeding</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item
                name={["dieteticHistory", "combined"]}
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Combined</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item
                name={["dieteticHistory", "weaning"]}
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Weaned</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Developmental History */}
      <Row
        gutter={[16, 0]}
        align="top"
        className="mb-4 pb-4 border-b border-gray-200"
      >
        <Col xs={24} md={6}>
          <Text strong className="text-md">
            Developmental History
          </Text>
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Gross Motor"
                name={["developmentalHistory", "grossMotor"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Fine Motor"
                name={["developmentalHistory", "fineMotor"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Language"
                name={["developmentalHistory", "language"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Social"
                name={["developmentalHistory", "social"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Sphincters"
                name={["developmentalHistory", "sphincter"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Antenatal History */}
      <Row
        gutter={[16, 0]}
        align="top"
        className="mb-4 pb-4 border-b border-gray-200"
      >
        <Col xs={24} md={6}>
          <Text strong className="text-md">
            Antenatal History
          </Text>
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="STORCH" name={["antenatalHistory", "storch"]}>
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Disease" name={["antenatalHistory", "disease"]}>
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Irradiation"
                name={["antenatalHistory", "irradiation"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Teratogenic Drugs"
                name={["antenatalHistory", "teratogenicdrugs"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Hospitalization"
                name={["antenatalHistory", "hospitalization"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Natal History */}
      <Row
        gutter={[16, 0]}
        align="top"
        className="mb-4 pb-4 border-b border-gray-200"
      >
        <Col xs={24} md={6}>
          <Text strong className="text-md">
            Natal History
          </Text>
        </Col>
        <Col>
          <Form.Item
            name={["natalHistory", "prematureRupture"]}
            valuePropName="checked"
            noStyle
          >
            <Checkbox>Premature Rupture Of Membranes</Checkbox>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name={["natalHistory", "prolongedDelivery"]}
            valuePropName="checked"
            noStyle
          >
            <Checkbox>Prolonged Delivery</Checkbox>
          </Form.Item>
        </Col>

        <Col>
          <Text strong>Place:</Text>
        </Col>
        <Col>
          <Form.Item
            name={["natalHistory", "place", "home"]}
            valuePropName="checked"
            noStyle
          >
            <Checkbox>Home</Checkbox>
          </Form.Item>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Item
            name={["natalHistory", "place", "hospital"]}
            valuePropName="checked"
            noStyle
          >
            <Checkbox>Hospital</Checkbox>
          </Form.Item>
        </Col>
      </Row>

      {/* Neonatal History */}
      <Row gutter={[16, 0]} align="top" className="mb-4">
        <Col xs={24} md={6}>
          <Text strong className="text-md">
            Neonatal History
          </Text>
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="NICU" name={["neonatalHistory", "NICU"]}>
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Cyanosis"
                name={["neonatalHistory", "Cyanosis"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Jaundice"
                name={["neonatalHistory", "Jaundice"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Pallor" name={["neonatalHistory", "Pallor"]}>
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Convulsions"
                name={["neonatalHistory", "Convulsions"]}
              >
                <Input.TextArea rows={1} placeholder="Details" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default DetailedHistorySection;
