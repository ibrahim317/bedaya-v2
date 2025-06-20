'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Tabs, Table, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { IClinic, clinicsClient } from '@/clients/clinicsClient';
import AddItemModal from '../components/AddItemModal';

interface PageProps {
  params: {
    id: string;
  };
}

type ItemType = 'diagnosis' | 'treatment';

export default function ClinicDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const [clinic, setClinic] = useState<IClinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [itemType, setItemType] = useState<ItemType>('diagnosis');
  const [activeTab, setActiveTab] = useState('diagnoses');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchClinic = async () => {
    try {
      setLoading(true);
      const data = await clinicsClient.getClinicById(params.id);
      setClinic(data);
    } catch (error) {
      message.error('Failed to load clinic details');
      router.push('/clinics-management');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinic();
  }, [params.id]);

  const handleDelete = async (id: string, type: ItemType) => {
    if (!clinic) return;

    try {
      setLoading(true);
      if (type === 'diagnosis') {
        await clinicsClient.deleteDiagnosis(clinic._id, id);
      } else {
        await clinicsClient.deleteTreatment(clinic._id, id);
      }

      message.success(`${type} deleted successfully`);
      fetchClinic();
    } catch (error) {
      message.error(`Failed to delete ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (type: ItemType) => {
    if (!clinic || selectedRowKeys.length === 0) return;

    try {
      setLoading(true);
      
      await Promise.all(
        selectedRowKeys.map(id => {
          if (type === 'diagnosis') {
            return clinicsClient.deleteDiagnosis(clinic._id, id.toString());
          } else {
            return clinicsClient.deleteTreatment(clinic._id, id.toString());
          }
        })
      );

      message.success(`Selected ${type}s deleted successfully`);
      setSelectedRowKeys([]);
      fetchClinic();
    } catch (error) {
      message.error(`Failed to delete selected ${type}s`);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setAddModalOpen(false);
    fetchClinic();
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const diagnosisColumns: ColumnsType<IClinic['commonDiagnoses'][0]> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => 
        record.name.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Popconfirm
            title="Delete this diagnosis?"
            onConfirm={() => handleDelete(record._id.toString(), 'diagnosis')}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const treatmentColumns: ColumnsType<IClinic['commonTreatments'][0]> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => 
        record.name.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Popconfirm
            title="Delete this treatment?"
            onConfirm={() => handleDelete(record._id.toString(), 'treatment')}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const items = [
    {
      key: 'diagnoses',
      label: 'Common Diagnoses',
      children: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Input.Search
                placeholder="Search diagnoses..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={`Delete ${selectedRowKeys.length} selected diagnoses?`}
                  onConfirm={() => handleBulkDelete('diagnosis')}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>
                    Delete Selected ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setItemType('diagnosis');
                setAddModalOpen(true);
              }}
            >
              Add Diagnosis
            </Button>
          </div>
          <Table
            rowSelection={rowSelection}
            columns={diagnosisColumns}
            dataSource={clinic?.commonDiagnoses || []}
            rowKey="_id"
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
          />
        </div>
      ),
    },
    {
      key: 'treatments',
      label: 'Common Treatments',
      children: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Input.Search
                placeholder="Search treatments..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={`Delete ${selectedRowKeys.length} selected treatments?`}
                  onConfirm={() => handleBulkDelete('treatment')}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>
                    Delete Selected ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setItemType('treatment');
                setAddModalOpen(true);
              }}
            >
              Add Treatment
            </Button>
          </div>
          <Table
            rowSelection={rowSelection}
            columns={treatmentColumns}
            dataSource={clinic?.commonTreatments || []}
            rowKey="_id"
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/clinics-management')}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold m-0">{clinic?.name}</h1>
      </div>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
        />
      </Card>

      <AddItemModal
        open={addModalOpen}
        onClose={handleModalClose}
        clinicId={params.id}
        type={itemType}
      />
    </div>
  );
} 