"use client";

import {
  Form,
  Input,
  Radio,
  Row,
  Col,
  DatePicker,
  Card,
  Button,
  InputNumber,
  Checkbox,
  Space,
  message,
} from "antd";
import { IDrug } from "@/types/Drug";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { drugsClient } from "@/clients/drugsClient";

const AddDrugPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [sampleChecked, setSampleChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stripsPerBox, setStripsPerBox] = useState<number | null>(null);
  const [totalStrips, setTotalStrips] = useState<number>(0);
  const [pillsPerStrip, setPillsPerStrip] = useState<number | null>(null);
  const [totalPills, setTotalPills] = useState<number>(0);
  const [messageApi, contextHolder] = message.useMessage();

  // Calculate total strips and pills whenever relevant fields change
  useEffect(() => {
    const values = form.getFieldsValue();
    const boxes = values.boxes || 0;
    const strips = values.strips || 0;
    const stripsInBox = stripsPerBox || 0;
    const pills = pillsPerStrip || 0;

    const calculatedTotalStrips = boxes * stripsInBox + strips;
    setTotalStrips(calculatedTotalStrips);
    setTotalPills(calculatedTotalStrips * pills);
  }, [form, stripsPerBox, pillsPerStrip]);

  const handleSubmit = async (values: any, addAnother: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const response = await drugsClient.AddDrug({
        barcode: values.barcode,
        name: values.name,
        quantity: totalPills,  // Changed from totalStrips to totalPills - API will use this as quantityByPills
        stripsPerBox: values.stripNumber,
        pillsPerStrip: values.pillsPerStrip,
        sample: sampleChecked,
        expiryDate: values.expiryDate,
        remains: values.remains || "",
      });

      if (!response) {
        setError("Create failed");
        messageApi.error("Failed to create drug");
        return;
      }

      messageApi.success("Drug created successfully");

      if (addAnother) {
        // Reset form but keep stripNumber and pillsPerStrip values for convenience
        const stripNumber = form.getFieldValue("stripNumber");
        const pillsPerStripValue = form.getFieldValue("pillsPerStrip");
        form.resetFields();
        form.setFieldValue("stripNumber", stripNumber);
        form.setFieldValue("pillsPerStrip", pillsPerStripValue);
        setSampleChecked(false);
      } else {
        router.push("/pharmacy");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      messageApi.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-6">
      {contextHolder}
      <Card title="Add Drug" className="max-w-7xl mx-auto">
        <Form
          form={form}
          name="drug-form"
          layout="vertical"
          onFinish={(values) => handleSubmit(values, false)}
          size="large"
          onValuesChange={(_, allValues) => {
            const boxes = allValues.boxes || 0;
            const strips = allValues.strips || 0;
            const stripsInBox = allValues.stripNumber || 0;
            const pills = allValues.pillsPerStrip || 0;
            
            const calculatedTotalStrips = boxes * stripsInBox + strips;
            setTotalStrips(calculatedTotalStrips);
            setTotalPills(calculatedTotalStrips * pills);
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Barcode Number"
                name="barcode"
                rules={[
                  { required: true, message: "Please enter Barcode Number" },
                ]}
              >
                <Input placeholder="Enter Barcode Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Drug Name"
                name="name"
                rules={[{ required: true, message: "Please enter Drug Name" }]}
              >
                <Input placeholder="Enter Drug Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Strips per Box"
                name="stripNumber"
                rules={[
                  { required: true, message: "Please enter Strips per Box" },
                ]}
              >
                <InputNumber
                  min={1}
                  placeholder="Strips per Box"
                  style={{ width: "100%" }}
                  onChange={(value) => setStripsPerBox(value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Pills per Strip"
                name="pillsPerStrip"
                rules={[
                  { required: true, message: "Please enter Pills per Strip" },
                ]}
              >
                <InputNumber
                  min={1}
                  placeholder="Pills per Strip"
                  style={{ width: "100%" }}
                  onChange={(value) => setPillsPerStrip(value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Remains" name="remains">
                <Input placeholder="Enter remains (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Number of Boxes" name="boxes">
                <InputNumber
                  min={0}
                  placeholder="Enter number of boxes"
                  style={{ width: "100%" }}
                  disabled={!stripsPerBox}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Additional Strips" name="strips">
                <InputNumber
                  min={0}
                  placeholder="Enter additional strips"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Total Strips">
                <InputNumber
                  value={totalStrips}
                  disabled
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Total Pills">
                <InputNumber
                  value={totalPills}
                  disabled
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Expiry Date"
                name="expiryDate"
                rules={[
                  { required: true, message: "Please select Expiry Date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Sample" name="sample" valuePropName="checked">
                <Checkbox
                  checked={sampleChecked}
                  onChange={(e) => setSampleChecked(e.target.checked)}
                >
                  Is Sample
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex gap-2 max-sm:flex-col">
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Drug
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                form.validateFields().then((values) => {
                  handleSubmit(values, true);
                });
              }}
            >
              Submit and Add Another
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddDrugPage;
