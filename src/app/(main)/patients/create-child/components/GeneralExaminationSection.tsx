import React from 'react';
import { Form, Input, Row, Col, Typography, InputNumber, Checkbox, Radio } from 'antd';

const { Text } = Typography;

const GeneralExaminationSection: React.FC = () => {
  return (
    <div className="border-2 mt-4 border-dashed border-gray-400 rounded-md p-4">
      <Row className="mb-4">
        <Col span={24} className="text-center">
          <Text strong style={{ fontSize: '1.2rem' }}>General Examination</Text>
        </Col>
      </Row>

      {/* Vital Data */}
      <Row gutter={[16, 0]} align="top" className="mb-4 pb-4 border-b border-gray-200">
        <Col xs={24} md={4} className="flex items-center">
          <Text strong className="text-md">Vital Data</Text>
        </Col>
        <Col xs={24} md={20}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="HR/PR" name={['generalExamination', 'vitalData', 'PR']}>
                <Input placeholder="e.g. 70" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="RR" name={['generalExamination', 'vitalData', 'RR']}>
                <Input placeholder="e.g. 16" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="BP" name={['generalExamination', 'vitalData', 'BP']}>
                <Input placeholder="e.g. 120/80" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="Temp" name={['generalExamination', 'vitalData', 'temperature']}>
                <Input placeholder="e.g. 37°C" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="CRT" name={['generalExamination', 'vitalData', 'CRT']}>
                <Input placeholder="e.g. <2s" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="RBS" name={['generalExamination', 'vitalData', 'RBS']}>
                <Input placeholder="e.g. 100mg/dl" />
              </Form.Item>
            </Col>
             <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="Spo2" name={['generalExamination', 'vitalData', 'Spo2']}>
                <Input placeholder="e.g. 98%" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Complexions */}
      <Row gutter={[16, 0]} align="top" className="mb-4 pb-4 border-b border-gray-200">
        <Col xs={24} md={4} className="flex items-center">
          <Text strong className="text-md">Complexions</Text>
        </Col>
        <Col xs={24} md={20}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Form.Item name={['generalExamination', 'complexions', 'pallor']} valuePropName="checked" noStyle>
                <Checkbox>Pallor</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name={['generalExamination', 'complexions', 'jaundice']} valuePropName="checked" noStyle>
                <Checkbox>Jaundice</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Text className="mr-2">Cyanosis:</Text>
              <Form.Item name={['generalExamination', 'complexions', 'cyanosis', 'central']} valuePropName="checked" noStyle className="inline-block mr-2">
                <Checkbox>Central</Checkbox>
              </Form.Item>
              <Form.Item name={['generalExamination', 'complexions', 'cyanosis', 'peripheral']} valuePropName="checked" noStyle className="inline-block">
                <Checkbox>Peripheral</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Anthropometry */}
      <Row gutter={[16, 0]} align="top" className="mb-4">
        <Col xs={24} md={4} className="flex items-center">
          <Text strong className="text-md">Anthropometry</Text>
        </Col>
        <Col xs={24} md={20}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Weight" name={['generalExamination', 'anthropometry', 'weight']}>
                <InputNumber placeholder="Weight" style={{ width: '100%' }} addonAfter="kg" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Height" name={['generalExamination', 'anthropometry', 'height']}>
                <InputNumber placeholder="Height" style={{ width: '100%' }} addonAfter="cm" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="OFC" name={['generalExamination', 'anthropometry', 'OFC']}>
                <InputNumber placeholder="OFC" style={{ width: '100%' }} addonAfter="cm" />
              </Form.Item>
            </Col>
             <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Weight for Age" name={['generalExamination', 'anthropometry', 'weightForAge']}>
                <InputNumber placeholder="WFA" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Height for Age" name={['generalExamination', 'anthropometry', 'heightForAge']}>
                <InputNumber placeholder="HFA" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Weight for Height" name={['generalExamination', 'anthropometry', 'weightForHeight']}>
                <InputNumber placeholder="WFH" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} className="flex items-center">
               <Form.Item label="Deformity?" name={['generalExamination', 'anthropometry', 'deformity']} valuePropName="checked" >
                 <Checkbox />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralExaminationSection; 