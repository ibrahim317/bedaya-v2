import React from 'react';
import { Form, Input, Row, Col, Typography } from 'antd';

const { Text, Title } = Typography;

const LocalExaminationSection: React.FC = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      <Title level={4} className="text-center mb-6">Local Examination</Title>

      {/* Main Local Examination */}
      <Row gutter={[16, 8]} align="top" className="mb-4">
        <Col className='w-full'>
          <Form.Item name={['localExamination', 'main']}>
            <Input.TextArea rows={3} placeholder="Enter details for local examination" />
          </Form.Item>
        </Col>
      </Row>

      {/* Cardiac Examination */}
      <Row gutter={[16, 8]} align="top" className="mb-4">
        <Col xs={24} md={6}>
          <Text strong>Cardiac Examination</Text>
        </Col>
        <Col xs={24} md={18}>
          <Form.Item name={['localExamination', 'cardiac']}>
            <Input.TextArea rows={3} placeholder="Enter details for cardiac examination" />
          </Form.Item>
        </Col>
      </Row>

      {/* Chest Examination */}
      <Row gutter={[16, 8]} align="top" className="mb-4">
        <Col xs={24} md={6}>
          <Text strong>Chest Examination</Text>
        </Col>
        <Col xs={24} md={18}>
          <Form.Item name={['localExamination', 'chest']}>
            <Input.TextArea rows={3} placeholder="Enter details for chest examination" />
          </Form.Item>
        </Col>
      </Row>

      {/* Abdominal Examination */}
      <Row gutter={[16, 8]} align="top" className="mb-4">
        <Col xs={24} md={6}>
          <Text strong>Abdominal Examination</Text>
        </Col>
        <Col xs={24} md={18}>
          <Form.Item name={['localExamination', 'abdominal']}>
            <Input.TextArea rows={3} placeholder="Enter details for abdominal examination" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default LocalExaminationSection; 