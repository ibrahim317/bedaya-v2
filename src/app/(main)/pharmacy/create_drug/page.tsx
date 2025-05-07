"use client";

import { Form, Input, Radio, Row, Col, DatePicker, Card, Button } from "antd";
import { IDrug } from "@/types/Drug";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { drugsClient } from "@/clients/drugsClient";


const AddDrugPage = () => {
  const router = useRouter();
    const [sampleChecked, setSampleChecked] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
      const onFinish = async (values: { 
        drugId: string; 
        name: string; 
        quantity: number; 
        stripNumber: number; 
        sample: boolean; 
        expiryDate: Date;
      }) => {
        try {
          setLoading(true);
          setError(null);
    
          const response = await drugsClient.AddDrug({
            drugId: values.drugId,
            name: values.name,
            Quantity: Number(values.quantity),
            stripInTHeBox: Number(values.stripNumber),
            sample: sampleChecked,
            ExpiryDate: values.expiryDate})
    
    
          if (!response) {
            setError('Create failed');
            return;
          }
    
          router.push('/pharmacy'); // Redirect to drug list page after successful creation
        } catch(error) {
          setError('An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      };
    
  return (
   <div className="md:p-6">
     <Card title="Add Drug" className="max-w-7xl mx-auto">
       <div className="rounded-md p-4">
        <Form
                  name="register-form"
                  layout="vertical"
                  onFinish={onFinish}
                  size="large"
                >
       <Row gutter={16}>
        <Col>
          <Form.Item
            label="Barcode Number"
            name="drugId"
            rules={[{ required: true, message: "Please enter Barcode Number" }]}
            >
            <Input placeholder="Enter Barcode Number" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="Drug Name"
            name="name"
            rules={[{ required: true, message: "Please enter Drug Name" }]}
            >
            <Input placeholder="Enter Drug Name" />
          </Form.Item>
        </Col>
        </Row>
        <Row gutter={16}>
        <Col>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter Quantity" }]}
            >
            <Input placeholder="Enter Quantity" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="Strip Number"
            name="stripNumber"
            rules={[{ required: true, message: "Please enter Strip Number" }]}
            >
            <Input placeholder="Enter Strip Count at one Box " />
          </Form.Item>
        </Col>
        </Row>
        <Row gutter={16}>
        <Col>
          <Form.Item
            label="Sample"
            name="sample"
            >
            <input placeholder="Enter Sample" type="checkbox" checked={sampleChecked} onChange={(e)=>setSampleChecked(e.target.checked)} />
          </Form.Item>
        </Col>
        <Col>
        <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[{ required: true, message: "Please select Expiry Date" }]}
            
            >
            <DatePicker placeholder="Select Expiry Date" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
     <Button
            type="primary"
            htmlType="submit"
              loading={loading}
              className="mt-2">
              Create drug
              </Button>
     </Form.Item>
      </Form>
     </div>
  </Card>
</div>
  );
};

export default AddDrugPage;