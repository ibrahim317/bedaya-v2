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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
    }
    finally {
      setLoading(false);
    }
  };
  fetchDrugs();
});

useEffect(() => {
  const filtered = Drugs.filter(
    drug =>
      drug.drugId.toLowerCase().includes(searchText.toLowerCase()) ||
      drug.name.toLowerCase().includes(searchText.toLowerCase())
  );
  setFilteredDrugs(filtered);
}, [searchText, Drugs]);

const handleSearch = (value: string) => {
  setSearchText(value);
};


const showDeleteConfirm = (DrugId: string, drugName: string) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete the drug: ${drugName}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await drugsClient.deleteDrug(DrugId);
          setDrugs(prevDrugs => prevDrugs.filter(drug =>  drug.drugId !== DrugId));
          messageApiRef.current?.success('User deleted successfully');
        } catch (error) {
          messageApiRef.current?.error('Failed to delete user');
        }
      },
    });
  };

const columns: ColumnsType<FormattedDrug> = [
    {
      title: 'BarCode',
      dataIndex: 'drugId',
      key: 'drugId',
      sorter: (a, b) => a.drugId.localeCompare(b.drugId),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Strip Count',
      dataIndex: 'strip_count',
      key: 'strip_count',
    },
    {
      title: 'Day 1',
      dataIndex: 'dailyConsumption',
      key: 'day1',
      render: (DailyConsumption: number[]) => (
        DailyConsumption?.[0] || '0')
    },
    {
      title: 'Day 2',
      dataIndex: 'dailyConsumption',
      key: 'day2',
      render: (DailyConsumption: number[]) => (
        DailyConsumption?.[1] || '0')
    },
    {
      title: 'Day 3',
      dataIndex: 'dailyConsumption',
      key: 'day3',
      render: (DailyConsumption: number[]) => (
        DailyConsumption?.[2] || '0')
    },
    {
      title: 'Day 4',
      dataIndex: 'dailyConsumption',
      key: 'day4',
      render: (DailyConsumption: number[]) => (
        DailyConsumption?.[3] || '0')
    },
    {
      title: 'Day 5',
      dataIndex: 'dailyConsumption',
      key: 'day5',
      render: (DailyConsumption: number[]) => (
        DailyConsumption?.[4] || '0')
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) =>a.createdAt? b.createdAt? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(): 0 : 0,
      render: (createdAt: string) => createdAt || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            danger
            icon={<DeleteOutlined />}
             onClick={() => showDeleteConfirm(record.drugId, record.name)}
            size="small"
          />
        </Space>
      ),
    },
  ];

return (
  <>
       {contextHolder}
      <div className="p-4 max-w-full">
        <Row justify="space-between" align="middle" className="mb-6">
          <Col xs={24} md={12}>
            <Title level={2}>Pharmacy</Title>
          </Col>
          <Col xs={24} md={12} className="mt-4 md:mt-0">
            <Space className="w-full justify-end">
              <Button
                type="primary"
                onClick={() => router.push("/pharmacy/create_drug/")}//add drug
              >
               + Add new drug
              </Button>
              <Search
                placeholder="Search drugs..."
                allowClear
                onChange={e => handleSearch(e.target.value)}
                className="w-full max-w-[300px]"
              />
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredDrugs}
          rowKey="drugId"
          scroll={{ x: 800 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} Drugs`,
            responsive: true,
          }}
        />
         <Button
                type="primary"
                //onClick={}//submit tratment
               className=" max-w-[300px] justify-end mt-4"
              >
              + Add patiant treatment
              </Button>
      </div>
  
    </>
    );
}

