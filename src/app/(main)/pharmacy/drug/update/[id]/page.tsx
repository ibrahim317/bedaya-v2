"use client";

import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Card,
  Button,
  InputNumber,
  Checkbox,
  message,
  Spin,
  Typography,
} from "antd";
import { IDrugWithId } from "@/types/Drug";
import { DrugData } from "@/services/drugService";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { drugsClient } from "@/clients/drugsClient";
import dayjs from 'dayjs';

const { Title } = Typography;

const UpdateDrugPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [form] = Form.useForm();
  const [drug, setDrug] = useState<IDrugWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [totalStrips, setTotalStrips] = useState<number>(0);
  const [totalPills, setTotalPills] = useState<number>(0);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (id) {
      const fetchDrug = async () => {
        try {
          setLoading(true);
          const fetchedDrug = await drugsClient.findById(id as string);
          if (fetchedDrug) {
            setDrug(fetchedDrug);
            const strips = fetchedDrug.quantityByPills / fetchedDrug.pillsPerStrip;
            const remains = fetchedDrug.remains || "";

            form.setFieldsValue({
              ...fetchedDrug,
              expiryDate: dayjs(fetchedDrug.expiryDate),
              strips: Math.floor(strips),
              remains: remains,
              stripNumber: fetchedDrug.stripsPerBox,
            });

            // Trigger calculation
            const values = form.getFieldsValue();
            const boxes = values.boxes || 0;
            const calculatedTotalStrips = boxes * fetchedDrug.stripsPerBox + (values.strips || 0);
            setTotalStrips(calculatedTotalStrips);
            setTotalPills(calculatedTotalStrips * fetchedDrug.pillsPerStrip);
          } else {
            messageApi.error("Drug not found");
          }
        } catch (error) {
          messageApi.error("Failed to fetch drug details");
        } finally {
          setLoading(false);
        }
      };
      fetchDrug();
    }
  }, [id, form, messageApi]);

  const onValuesChange = (changedValues: any, allValues: any) => {
    const pillsPerStrip = allValues.pillsPerStrip || drug?.pillsPerStrip || 0;
    const stripsPerBox = allValues.stripNumber || drug?.stripsPerBox || 0;
    
    const boxes = allValues.boxes || 0;
    const strips = allValues.strips || 0;
    
    const calculatedTotalStrips = boxes * stripsPerBox + strips;
    setTotalStrips(calculatedTotalStrips);
    setTotalPills(calculatedTotalStrips * pillsPerStrip);
  };
  
  const handleSubmit = async (values: any) => {
    try {
      setSubmitLoading(true);

      const dataToUpdate: Partial<DrugData> = {
        barcode: values.barcode,
        name: values.name,
        quantityByPills: totalPills,
        stripsPerBox: values.stripNumber,
        pillsPerStrip: values.pillsPerStrip,
        sample: values.sample,
        expiryDate: values.expiryDate.toDate(),
        remains: values.remains || "",
      };

      await drugsClient.updateDrug(id as string, dataToUpdate);
      messageApi.success("Drug updated successfully");
      router.push("/pharmacy");

    } catch (error) {
      messageApi.error("An unexpected error occurred during update");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="Loading drug details..." className="flex justify-center items-center h-screen" />;
  }
  
  if (!drug) {
    return <Title level={3} className="text-center mt-8">Drug not found.</Title>;
  }

  return (
    <div className="md:p-6">
      {contextHolder}
      <Card title="Update Drug" className="max-w-7xl mx-auto">
        <Form
          form={form}
          name="drug-form"
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          onValuesChange={onValuesChange}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Barcode Number"
                name="barcode"
                rules={[{ required: true, message: "Please enter Barcode Number" }]}
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
                rules={[{ required: true, message: "Please enter Strips per Box" }]}
              >
                <InputNumber min={1} placeholder="Strips per Box" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Pills per Strip"
                name="pillsPerStrip"
                rules={[{ required: true, message: "Please enter Pills per Strip" }]}
              >
                <InputNumber min={1} placeholder="Pills per Strip" style={{ width: "100%" }} />
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
                <InputNumber min={0} placeholder="Enter number of boxes" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Additional Strips" name="strips">
                <InputNumber min={0} placeholder="Enter additional strips" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Total Strips">
                <InputNumber value={totalStrips} readOnly style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Total Pills">
                <InputNumber value={totalPills} readOnly style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Expiry Date"
                name="expiryDate"
                rules={[{ required: true, message: "Please select Expiry Date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Sample" name="sample" valuePropName="checked">
                <Checkbox>Is Sample</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex gap-2">
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Update Drug
            </Button>
            <Button onClick={() => router.push('/pharmacy')}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateDrugPage; 