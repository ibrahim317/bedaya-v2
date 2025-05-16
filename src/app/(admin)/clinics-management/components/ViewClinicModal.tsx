import { useState } from 'react';
import { Modal, Tabs, List, Button, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { IClinic } from '@/types/Clinic';
import { ICommonDiagnosis } from '@/types/CommonDiagnosis';
import { ICommonTreatment } from '@/types/CommonTreatment';

interface ViewClinicModalProps {
  open: boolean;
  clinic: IClinic | null;
  onClose: () => void;
}

type ItemType = 'diagnosis' | 'treatment';

export default function ViewClinicModal({ open, clinic, onClose }: ViewClinicModalProps) {
  const [activeTab, setActiveTab] = useState('diagnoses');
  const [bulkInput, setBulkInput] = useState('');
  const [singleInput, setSingleInput] = useState('');
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; type: ItemType } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddSingle = async (type: ItemType) => {
    if (!singleInput.trim() || !clinic) return;

    try {
      setLoading(true);
      const endpoint = type === 'diagnosis' ? 'common-diagnoses' : 'common-treatments';
      const response = await fetch(`/api/clinics/${clinic._id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: singleInput.trim() }),
      });

      if (!response.ok) throw new Error(`Failed to add ${type}`);

      message.success(`${type} added successfully`);
      setSingleInput('');
      onClose(); // Refresh parent
    } catch (error) {
      message.error(`Failed to add ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBulk = async (type: ItemType) => {
    if (!bulkInput.trim() || !clinic) return;

    // Split by comma, trim each item, filter out empty strings, and remove duplicates
    const items = [...new Set(
      bulkInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
    )];
    console.log(items);

    if (items.length === 0) {
      message.warning('No valid items found');
      return;
    }

    try {
      setLoading(true);
      const endpoint = type === 'diagnosis' ? 'common-diagnoses' : 'common-treatments';
      const response = await fetch(`/api/clinics/${clinic._id}/${endpoint}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: items }),
      });

      if (!response.ok) throw new Error(`Failed to add ${type}s`);

      message.success(`${type}s added successfully`);
      setBulkInput('');
      onClose(); // Refresh parent
    } catch (error) {
      message.error(`Failed to add ${type}s`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (type: ItemType) => {
    if (!editingItem || !clinic) return;

    try {
      setLoading(true);
      const endpoint = type === 'diagnosis' ? 'common-diagnoses' : 'common-treatments';
      const response = await fetch(`/api/clinics/${clinic._id}/${endpoint}/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingItem.name }),
      });

      if (!response.ok) throw new Error(`Failed to update ${type}`);

      message.success(`${type} updated successfully`);
      setEditingItem(null);
      onClose(); // Refresh parent
    } catch (error) {
      message.error(`Failed to update ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: ItemType) => {
    if (!clinic) return;

    try {
      setLoading(true);
      const endpoint = type === 'diagnosis' ? 'common-diagnoses' : 'common-treatments';
      const response = await fetch(`/api/clinics/${clinic._id}/${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Failed to delete ${type}`);

      message.success(`${type} deleted successfully`);
      onClose(); // Refresh parent
    } catch (error) {
      message.error(`Failed to delete ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const renderList = (items: ICommonDiagnosis[] | ICommonTreatment[], type: ItemType) => (
    <List
      dataSource={items}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button
              key="edit"
              type="text"
              icon={<EditOutlined />}
              onClick={() => setEditingItem({ id: item._id as string, name: item.name, type })}
            />,
            <Popconfirm
              key="delete"
              title={`Delete this ${type}?`}
              onConfirm={() => handleDelete(item._id as string, type)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>,
          ]}
        >
          {editingItem?.id === item._id ? (
            <Input
              value={editingItem?.name}
              onChange={(e) => editingItem && setEditingItem({ ...editingItem, name: e.target.value })}
              onPressEnter={() => handleEdit(type)}
              onBlur={() => setEditingItem(null)}
              autoFocus
            />
          ) : (
            item.name
          )}
        </List.Item>
      )}
    />
  );

  const items = [
    {
      key: 'diagnoses',
      label: 'Common Diagnoses',
      children: (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add single diagnosis"
              value={singleInput}
              onChange={(e) => setSingleInput(e.target.value)}
              onPressEnter={() => handleAddSingle('diagnosis')}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAddSingle('diagnosis')}
              loading={loading}
            >
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            <Input.TextArea
              placeholder="Add multiple diagnoses (comma-separated). Duplicates will be removed."
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={3}
            />
            <Button
              type="primary"
              onClick={() => handleAddBulk('diagnosis')}
              loading={loading}
              block
            >
              Add Bulk Diagnoses
            </Button>
          </div>

          {clinic && renderList(clinic.commonDiagnoses, 'diagnosis')}
        </div>
      ),
    },
    {
      key: 'treatments',
      label: 'Common Treatments',
      children: (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add single treatment"
              value={singleInput}
              onChange={(e) => setSingleInput(e.target.value)}
              onPressEnter={() => handleAddSingle('treatment')}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAddSingle('treatment')}
              loading={loading}
            >
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            <Input.TextArea
              placeholder="Add multiple treatments (comma-separated). Duplicates will be removed."
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={3}
            />
            <Button
              type="primary"
              onClick={() => handleAddBulk('treatment')}
              loading={loading}
              block
            >
              Add Bulk Treatments
            </Button>
          </div>

          {clinic && renderList(clinic.commonTreatments, 'treatment')}
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      title={`Manage ${clinic?.name || 'Clinic'}`}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </Modal>
  );
} 