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
import Loading from './loading';
import { usersClient } from '@/clients/usersClient';
import type { FormattedUser } from '@/clients/usersClient';

const { Title } = Typography;
const { Search } = Input;
const { confirm } = Modal;

export default function UsersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<FormattedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<FormattedUser[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const messageApiRef = useRef(messageApi);

  // Update messageApi ref when it changes
  useEffect(() => {
    messageApiRef.current = messageApi;
  }, [messageApi]);

  // Redirect if not admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersClient.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        messageApiRef.current?.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [status, session]);

  // Handle search
  useEffect(() => {
    const filtered = users.filter(
      user =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const showDeleteConfirm = (userId: string, userEmail: string) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete the user: ${userEmail}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await usersClient.deleteUser(userId);
          setUsers(prevUsers => prevUsers.filter(user => user.key !== userId));
          messageApiRef.current?.success('User deleted successfully');
        } catch (error) {
          messageApiRef.current?.error('Failed to delete user');
        }
      },
    });
  };

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    try {
      const updatedUser = await usersClient.toggleAdminStatus(userId, currentRole !== 'admin');
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.key === userId
            ? { ...user, role: updatedUser.role }
            : user
        )
      );
      messageApiRef.current?.success(`User role updated to ${updatedUser.role}`);
    } catch (error) {
      messageApiRef.current?.error('Failed to update user role');
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await usersClient.verifyUser(userId);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.key === userId
            ? { ...user, verified: true }
            : user
        )
      );
      messageApiRef.current?.success('User verified successfully');
    } catch (error) {
      messageApiRef.current?.error('Failed to verify user');
    }
  };

  const handleVerifyAllPendingUsers = async () => {
    try {
      const response = await usersClient.verifyAllPendingUsers();
      setUsers(prevUsers =>
        prevUsers.map(user => ({ ...user, verified: true }))
      );
      messageApiRef.current?.success(response.message);
    } catch (error) {
      messageApiRef.current?.error('Failed to verify all users');
    }
  };

  const columns: ColumnsType<FormattedUser> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'verified',
      key: 'verified',
      render: (verified: boolean) => (
        <span className={verified ? 'text-green-600' : 'text-red-600'}>
          {verified ? 'Verified' : 'Pending'}
        </span>
      ),
      filters: [
        { text: 'Verified', value: true },
        { text: 'Pending', value: false },
      ],
      onFilter: (value, record) => record.verified === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" wrap>
          {!record.verified && (
            <Button
              type="primary"
              onClick={() => handleVerifyUser(record.key)}
              size="small"
            >
              Verify
            </Button>
          )}
          <Button
            type={record.role === 'admin' ? 'default' : 'primary'}
            onClick={() => handleToggleAdmin(record.key, record.role)}
            size="small"
          >
            {record.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.key, record.email)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <Loading />;
  }

  if (status === 'authenticated' && session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <>
      {contextHolder}
      <div className="p-4 max-w-full">
        <Row justify="space-between" align="middle" className="mb-6">
          <Col xs={24} md={12}>
            <Title level={2}>Users Management</Title>
          </Col>
          <Col xs={24} md={12} className="mt-4 md:mt-0">
            <Space className="w-full justify-end">
              <Button
                type="primary"
                onClick={handleVerifyAllPendingUsers}
              >
                Verify All Pending Users
              </Button>
              <Search
                placeholder="Search users..."
                allowClear
                onChange={e => handleSearch(e.target.value)}
                className="w-full max-w-[300px]"
              />
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="key"
          scroll={{ x: 800 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            responsive: true,
          }}
        />
      </div>
    </>
  );
}