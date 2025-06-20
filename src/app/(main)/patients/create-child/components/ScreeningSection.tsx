"use client";

import { Form, Checkbox, Row, Col, Input } from "antd";

const ScreeningSection = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      <h3 className="font-bold mb-2">Screening</h3>

      <Row gutter={[16, 8]}>
        <Col >
          <Form.Item name={["screening", "nephropathy"]} valuePropName="checked">
            <Checkbox>Rickets screening(6m - 5y)</Checkbox>
          </Form.Item>
        </Col>
        <Col >
          <Form.Item name={["screening", "OGTT"]} valuePropName="checked">
            <Checkbox>Parasites screening</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ScreeningSection;
