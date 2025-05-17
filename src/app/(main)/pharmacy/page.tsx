'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Table,
  Button,
  Modal,
  message,
  Space,
  Input,
  Typography,
  Col,
  Row,
  Card,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IDrug } from '@/types/Drug';
import { drugsClient } from '@/clients/drugsClient';
import type { FormattedDrug } from '@/clients/drugsClient';

const { Title } = Typography;
const { Search } = Input;
const { confirm } = Modal;

export default function PharmacyPage() {
  const router = useRouter();
  const [Drugs, setDrugs] = useState<FormattedDrug[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredDrugs, setFilteredDrugs] = useState<FormattedDrug[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const messageApiRef = useRef(messageApi);

  useEffect(() => {
    messageApiRef.current = messageApi;
  }, [messageApi]);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const data = await drugsClient.getAllDrugs();
        setDrugs(data);
        setFilteredDrugs(data);
      } catch (error) {
        messageApiRef.current?.error('Failed to fetch drugs');
      } finally {
        setLoading(false);
      }
    };
    if (loading) {
      fetchDrugs();
    }
  });

  useEffect(() => {
    const filtered = Drugs.filter(
      (drug) =>
        drug.barcode?.toLowerCase().includes(searchText?.toLowerCase()) ||
        drug.name?.toLowerCase().includes(searchText?.toLowerCase())
    );
    setFilteredDrugs(filtered);
  }, [searchText, Drugs]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const showDeleteConfirm = (DrugId: string, drugName: string) => {
    confirm({
      title: 'Are you sure you want to delete this drug?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete the drug: ${drugName}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await drugsClient.deleteDrug(DrugId);
          setDrugs((prevDrugs) => prevDrugs.filter((drug) => drug.barcode !== DrugId));
          messageApiRef.current?.success('Drug deleted successfully');
        } catch (error) {
          messageApiRef.current?.error('Failed to delete drug');
        }
      },
    });
  };

  const columns: ColumnsType<FormattedDrug> = [
    {
      title: 'BarCode',
      dataIndex: 'barcode',
      key: 'barcode',
      sorter: (a, b) => a.barcode.localeCompare(b.barcode),
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 200,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
    },
    {
      title: 'Strips Per Box',
      dataIndex: 'stripsPerBox',
      key: 'stripsPerBox',
      width: 100,
      align: 'right',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      sorter: (a, b) =>
        a.expiryDate
          ? b.expiryDate
            ? new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
            : 0
          : 0,
      render: (expiryDate: string) => expiryDate || 'N/A',
      width: 120,
    },
    {
      title: 'Daily Consumption',
      children: [
        {
          title: 'Day 1',
          dataIndex: 'dailyConsumption',
          key: 'day1',
          render: (DailyConsumption: number[]) => DailyConsumption?.[0] || '0',
          width: 80,
          align: 'right',
        },
        {
          title: 'Day 2',
          dataIndex: 'dailyConsumption',
          key: 'day2',
          render: (DailyConsumption: number[]) => DailyConsumption?.[1] || '0',
          width: 80,
          align: 'right',
        },
        {
          title: 'Day 3',
          dataIndex: 'dailyConsumption',
          key: 'day3',
          render: (DailyConsumption: number[]) => DailyConsumption?.[2] || '0',
          width: 80,
          align: 'right',
        },
        {
          title: 'Day 4',
          dataIndex: 'dailyConsumption',
          key: 'day4',
          render: (DailyConsumption: number[]) => DailyConsumption?.[3] || '0',
          width: 80,
          align: 'right',
        },
        {
          title: 'Day 5',
          dataIndex: 'dailyConsumption',
          key: 'day5',
          render: (DailyConsumption: number[]) => DailyConsumption?.[4] || '0',
          width: 80,
          align: 'right',
        },
      ],
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) =>
        a.createdAt
          ? b.createdAt
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : 0
          : 0,
      render: (createdAt: string) => createdAt || 'N/A',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record.barcode, record.name)}
          size="small"
        />
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="p-6">
        <Card>
          <Row justify="space-between" align="middle" className="mb-6">
            <Col xs={24} md={12}>
              <Title level={2} className="!mb-0">Pharmacy</Title>
            </Col>
            <Col xs={24} md={12} className="mt-4 md:mt-0">
              <Space className="w-full justify-end">
                <Search
                  placeholder="Search drugs..."
                  allowClear
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full max-w-[300px]"
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => router.push('/pharmacy/drug/create')}
                >
                  Add Drug
                </Button>
              </Space>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredDrugs}
            rowKey="barcode"
            scroll={{ x: 1500 }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} Drugs`,
              responsive: true,
            }}
            size="middle"
            bordered
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="mt-4"
          >
            Add Patient Treatment
          </Button>
        </Card>
      </div>
    </>
  );
}

