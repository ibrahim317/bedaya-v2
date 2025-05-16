import { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { IClinicSummary, clinicsClient } from '@/clients/clinicsClient';

interface AddEditClinicModalProps {
  open: boolean;
  clinic?: IClinicSummary | null;
  onClose: () => void;
}

export default function AddEditClinicModal({ open, clinic, onClose }: AddEditClinicModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditing = !!clinic;

  const handleSubmit = async (values: { name: string }) => {
    try {
      setLoading(true);
      if (isEditing && clinic) {
        await clinicsClient.updateClinic(clinic._id, values.name);
      } else {
        await clinicsClient.createClinic(values.name);
      }

      message.success(`Clinic ${isEditing ? 'updated' : 'created'} successfully`);
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(`Failed to ${isEditing ? 'update' : 'create'} clinic`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={`${isEditing ? 'Edit' : 'Add'} Clinic`}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={form.submit}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={clinic ? { name: clinic.name } : undefined}
      >
        <Form.Item
          name="name"
          label="Clinic Name"
          rules={[
            { required: true, message: 'Please enter the clinic name' },
          ]}
        >
          <Input placeholder="Enter clinic name" />
        </Form.Item>
      </Form>
    </Modal>
  );
} 