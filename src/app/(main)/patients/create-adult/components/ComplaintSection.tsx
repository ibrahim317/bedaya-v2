"use client";

import { Form, Input, Button, Row, Col } from "antd";

const ComplaintSection = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      <h3 className="text-center font-bold mb-2">
        Complaint Analysis and history of present illness
      </h3>
      <Form.List name="complaints">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={8} align="middle" className="mb-2">
                <Col flex="auto">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[
                      {
                        required: true,
                        message: "Please enter complaint",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={2}
                      placeholder="Enter patient complaint"
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button type="text" danger onClick={() => remove(name)}>
                    Delete
                  </Button>
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>
                + Add Complaint
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default ComplaintSection;