'use client';

import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, Spin, Alert } from 'antd';
import { Line } from '@ant-design/charts';
import { getDashboardStats } from '@/clients/dashboard';
import { DashboardStats } from '@/types/Dashboard';
import { UserOutlined, MedicineBoxOutlined, HomeOutlined, PlusSquareOutlined, SolutionOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const lineConfig = stats ? {
    data: stats.dailyPatientCounts,
    xField: 'date',
    yField: 'count',
    point: {
      shape: 'diamond',
      size: 4,
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    yAxis: {
      min: 0,
    }
  } : {};

  return (
    <div className="p-4 md:p-8">
      <Title level={2} className="mb-8">
        System Dashboard
      </Title>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic title="Total Patients" value={stats?.patientCount} prefix={<SolutionOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic title="Total Users" value={stats?.userCount} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic title="Total Clinics" value={stats?.clinicCount} prefix={<HomeOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic title="Total Drugs" value={stats?.drugCount} prefix={<MedicineBoxOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic title="Dispensed Meds" value={stats?.dispensedMedicationCount} prefix={<PlusSquareOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="New Patients (Last 7 Days)">
        {stats && <Line {...lineConfig} />}
      </Card>
    </div>
  );
} 