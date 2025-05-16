"use client";
import React from 'react'

import {
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Space,
} from "antd";

const BrithDetails = () => {
  return (
          <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
            <Row gutter={16} align="middle">
              <Col>
                <Form.Item label="Order of Birth" name="orderOfBirth">
                  <Input placeholder="Order of Birth" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Birth Term">
                  <Form.Item
                    name={["birthTerm", "fullTerm"]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox>Full Term</Checkbox>
                  </Form.Item>
                  <Form.Item
                    name={["birthTerm", "preterm"]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox>Preterm</Checkbox>
                  </Form.Item>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name={["birthTerm", "weeks"]} noStyle>
                  <Input type="number" placeholder="Weeks" suffix="weeks" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Birth Mode">
                  <Space>
                    <Form.Item
                      name={["birthMode", "VD"]}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>VD</Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={["birthMode", "CS"]}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>CS</Checkbox>
                    </Form.Item>
                    <Form.Item name={["birthMode", "CS_reason"]} noStyle>
                      <Input placeholder="Why CS Reason" />
                    </Form.Item>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} align="middle">
              <Col>
                <Form.Item name="consanguinity" label="Consanguinity">
                  <Input placeholder="Consanguinity" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="NICU Admission" name="NICUAdmission">
                  <Input placeholder="If yes Why and for how long" />
                </Form.Item>
              </Col>
            </Row>
          </div>
  )
}

export default BrithDetails