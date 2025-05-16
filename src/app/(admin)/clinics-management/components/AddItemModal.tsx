import { useState } from 'react';
import { Modal, Tabs, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { clinicsClient } from '@/clients/clinicsClient';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  clinicId: string;
  type: 'diagnosis' | 'treatment';
}

export default function AddItemModal({ open, onClose, clinicId, type }: AddItemModalProps) {
  const [activeTab, setActiveTab] = useState('single');
  const [singleInput, setSingleInput] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSingle = async () => {
    if (!singleInput.trim()) return;

    try {
      setLoading(true);
      if (type === 'diagnosis') {
        await clinicsClient.addDiagnosis(clinicId, singleInput.trim());
      } else {
        await clinicsClient.addTreatment(clinicId, singleInput.trim());
      }

      message.success(`${type} added successfully`);
      setSingleInput('');
      onClose();
    } catch (error) {
      message.error(`Failed to add ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBulk = async () => {
    if (!bulkInput.trim()) return;

    const items = [...new Set(
      bulkInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
    )];

    if (items.length === 0) {
      message.warning('No valid items found');
      return;
    }

    try {
      setLoading(true);
      if (type === 'diagnosis') {
        await clinicsClient.addBulkDiagnoses(clinicId, items);
      } else {
        await clinicsClient.addBulkTreatments(clinicId, items);
      }

      message.success(`${type}s added successfully`);
      setBulkInput('');
      onClose();
    } catch (error) {
      message.error(`Failed to add ${type}s`);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'single',
      label: 'Add Single',
      children: (
        <div className="space-y-4">
          <Input
            placeholder={`Enter ${type} name`}
            value={singleInput}
            onChange={(e) => setSingleInput(e.target.value)}
            onPressEnter={handleAddSingle}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddSingle}
            loading={loading}
            block
          >
            Add {type}
          </Button>
        </div>
      ),
    },
    {
      key: 'bulk',
      label: 'Add Multiple',
      children: (
        <div className="space-y-4">
          <Input.TextArea
            placeholder={`Add multiple ${type}s (comma-separated). Duplicates will be removed.`}
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            rows={4}
          />
          <Button
            type="primary"
            onClick={handleAddBulk}
            loading={loading}
            block
          >
            Add Bulk {type}s
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      title={`Add ${type}${activeTab === 'bulk' ? 's' : ''}`}
      onCancel={() => {
        setSingleInput('');
        setBulkInput('');
        onClose();
      }}
      footer={null}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </Modal>
  );
} 