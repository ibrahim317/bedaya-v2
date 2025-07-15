'use client';

import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, Spin, Alert, Divider } from 'antd';
import { Line, Column, ColumnConfig } from '@ant-design/charts';
import { getDashboardStats } from '@/clients/dashboard';
import { clinicsClient, IClinicSummary } from '@/clients/clinicsClient';
import { DashboardStats } from '@/types/Dashboard';
import { UserOutlined, MedicineBoxOutlined, HomeOutlined, PlusSquareOutlined, SolutionOutlined, ExperimentOutlined, LoginOutlined, LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PatientType, PatientLabTestStatus } from '@/types/Patient';

const { Title, Text } = Typography;

const labTestNames = ["Stool", "Urine", "Blood", "Albumin-Creat"];
const labTestStatuses = Object.values(PatientLabTestStatus);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clinics, setClinics] = useState<IClinicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, clinicsData] = await Promise.all([
          getDashboardStats(),
          clinicsClient.getAllClinics()
        ]);
        setStats(statsData);
        setClinics(clinicsData);
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

  const renderLabStats = (patientType: PatientType) => {
    const title = patientType === PatientType.Adult ? "Adult Lab Test Statistics" : "Child Lab Test Statistics";
    const patientStats = stats?.labTestStats[patientType];
    const labTotals = stats?.labTotals[patientType];

    return (
      <div className="mb-8">
        <Title level={3} className="mb-4">{title}</Title>
        
        {labTotals && (
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic title="Patients Not Requested (Overall Status)" value={labTotals.labTotalNotRequested} prefix={<QuestionCircleOutlined />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic title="Patients Checked In (Overall Status)" value={labTotals.labTotalIn} prefix={<LoginOutlined />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic title="Patients Checked Out (Overall Status)" value={labTotals.labTotalOut} prefix={<LogoutOutlined />} />
              </Card>
            </Col>
          </Row>
        )}

        {patientStats ? (
          <Row gutter={[16, 16]}>
            {labTestNames.map((labName) => {
              const labData = patientStats[labName];
              return (
                <Col xs={24} sm={12} md={12} lg={6} key={labName}>
                  <Card>
                    <Title level={5}>{labName} Tests</Title>
                    <Statistic
                      title="Total Patients"
                      value={labData?.total || 0}
                      prefix={<ExperimentOutlined />}
                    />
                    <Divider className="my-2" />
                    {labTestStatuses.map((status) => (
                      <Row key={status}>
                        <Col span={12}><Text type="secondary">{status}</Text></Col>
                        <Col span={12}><Text strong>{labData?.statuses[status] || 0}</Text></Col>
                      </Row>
                    ))}
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Text>No lab test data available for {patientType.toLowerCase()}s.</Text>
        )}
      </div>
    );
  };

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

  const patientsPerClinicData = clinics.flatMap(clinic => {
    const adultStat = stats?.patientsPerClinic.find(p => p.clinicName === clinic.name && p.type === PatientType.Adult);
    const childStat = stats?.patientsPerClinic.find(p => p.clinicName === clinic.name && p.type === PatientType.Child);
    return [
      { clinicName: clinic.name, patientCount: adultStat ? adultStat.patientCount : 0, type: 'Adults' },
      { clinicName: clinic.name, patientCount: childStat ? childStat.patientCount : 0, type: 'Children' },
    ];
  });


  const patientsPerClinicConfig = {
    data: patientsPerClinicData,
    xField: 'clinicName',
    yField: 'patientCount',
    seriesField: 'type',
    isGroup: true,
    // Change the color from a single string to an array of strings
   color: ({ type }: { type: string }) => {
    console.log(type);
      if (type === 'Adults') {
        return '#5B8FF9'; // Return blue for Adults
      }
      return '#5AD8A6'; // Return green for Children
    },
    legend: {
      position: 'top-right' as const,
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
    meta: {
      patientCount: {
        alias: 'Number of Patients',
      },
      clinicName: {
        alias: 'Clinic',
      },
      type: {
        alias: 'Patient Type',
      },
    },
  };

  return (
    <div className="p-4 md:p-8">
      <Title level={2} className="mb-8">
        System Dashboard
      </Title>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic title="Total Adult Patients" value={stats?.adultPatientCount} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic title="Total Child Patients" value={stats?.childPatientCount} prefix={<UserOutlined />} />
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

      {renderLabStats(PatientType.Adult)}
      {renderLabStats(PatientType.Child)}

      <Card title="New Patients (Last 7 Days)" className="mb-8">
        {stats && <Line {...lineConfig} />}
      </Card>

      <Card title="Unique Patients per Clinic">
        {patientsPerClinicData.length > 0 ? (
          <Column {...patientsPerClinicConfig} />
        ) : (
          <Text>No clinic patient data available.</Text>
        )}
      </Card>
    </div>
  );
}