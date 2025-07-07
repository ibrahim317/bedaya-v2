'use client';

import { useState } from 'react';
import { Card, Col, Divider, Row, Statistic, Typography } from 'antd';
import { ExperimentOutlined, HomeOutlined, MedicineBoxOutlined, PlusSquareOutlined, UserOutlined } from '@ant-design/icons';
import { Column, ColumnConfig, Line } from '@ant-design/charts';
import { getDashboardStats } from '@/clients/dashboard';
import { clinicsClient, IClinicSummary } from '@/clients/clinicsClient';
import { DashboardStats } from '@/types/Dashboard';
import { PatientType, PatientLabTestStatus } from '@/types/Patient';
import OfflineDataWrapper from '@/components/OfflineDataWrapper';
import { cacheService } from '@/services/cacheService';
import { STORE_NAMES } from '@/types/IndexedDB';


const { Title, Text } = Typography;

const labTestNames = ["Stool", "Urine", "Blood", "Albumin-Creat"];
const labTestStatuses = Object.values(PatientLabTestStatus);

type CombinedChartData = {
  stats: DashboardStats;
  clinics: IClinicSummary[];
};

const renderLabStats = (patientType: PatientType, stats: DashboardStats | null) => {
    const title = patientType === PatientType.Adult ? "Adult Lab Test Statistics" : "Child Lab Test Statistics";
    const patientStats = stats?.labTestStats[patientType];

    return (
      <div className="mb-8">
        <Title level={3} className="mb-4">{title}</Title>
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

export default function DashboardPage() {

  const fetchDashboardData = async (): Promise<DashboardStats[]> => {
    const data = await getDashboardStats();
    await cacheService.set(STORE_NAMES.DASHBOARD_STATS, 'main', data);
    return [data];
  };

  const getCachedDashboardData = async (): Promise<DashboardStats[]> => {
    const result = await cacheService.get<DashboardStats>(STORE_NAMES.DASHBOARD_STATS, 'main');
    return result ? [result] : [];
  };
  
  const fetchClinicsChartData = async (): Promise<CombinedChartData[]> => {
    const [stats, clinics] = await Promise.all([
      getDashboardStats(),
      clinicsClient.getAllClinics()
    ]);
    await cacheService.set(STORE_NAMES.DASHBOARD_STATS, 'main', stats);
    await cacheService.cacheClinics(clinics); // Use the specific method for convenience
    return [{ stats, clinics }];
  };

  const getCachedClinicsChartData = async (): Promise<CombinedChartData[]> => {
    const [statsResult, clinicsResult] = await Promise.all([
      cacheService.get<DashboardStats>(STORE_NAMES.DASHBOARD_STATS, 'main'),
      cacheService.getCachedClinics()
    ]);
    if (statsResult && clinicsResult.length > 0) {
      return [{ stats: statsResult, clinics: clinicsResult }];
    }
    return [];
  };


  return (
    <div className="p-4 md:p-8">
      <Title level={2} className="mb-8">
        System Dashboard
      </Title>

      <OfflineDataWrapper
        fetchData={fetchDashboardData}
        getCachedData={getCachedDashboardData}
        cacheKey="dashboard-main-stats"
      >
        {(data) => {
          const stats = data[0];
          if (!stats) return null;

          const lineConfig = {
            data: stats.dailyPatientCounts,
            xField: 'date',
            yField: 'count',
            height: 250,
          };

          return (
            <>
              <Row gutter={[16, 16]} className="mb-8">
                <Col xs={12} sm={8} md={6} lg={4}><Card><Statistic title="Adults" value={stats.adultPatientCount} prefix={<UserOutlined />} /></Card></Col>
                <Col xs={12} sm={8} md={6} lg={4}><Card><Statistic title="Children" value={stats.childPatientCount} prefix={<UserOutlined />} /></Card></Col>
                <Col xs={12} sm={8} md={6} lg={4}><Card><Statistic title="Users" value={stats.userCount} prefix={<UserOutlined />} /></Card></Col>
                <Col xs={12} sm={8} md={6} lg={4}><Card><Statistic title="Clinics" value={stats.clinicCount} prefix={<HomeOutlined />} /></Card></Col>
                <Col xs={12} sm={8} md={6} lg={4}><Card><Statistic title="Drugs" value={stats.drugCount} prefix={<MedicineBoxOutlined />} /></Card></Col>
                <Col xs={12} sm={8} md={6} lg={4}><Card><Statistic title="Dispensed" value={stats.dispensedMedicationCount} prefix={<PlusSquareOutlined />} /></Card></Col>
              </Row>
              
              {renderLabStats(PatientType.Adult, stats)}
              {renderLabStats(PatientType.Child, stats)}

              <Card title="Daily Patient Registrations" className="mb-8">
                <Line {...lineConfig} />
              </Card>
            </>
          );
        }}
      </OfflineDataWrapper>

      <OfflineDataWrapper
        fetchData={fetchClinicsChartData}
        getCachedData={getCachedClinicsChartData}
        cacheKey="dashboard-clinics-chart"
      >
        {(data) => {
          const chartData = data[0];
          if (!chartData) return null;
          
          const { stats, clinics } = chartData;
          const patientsPerClinicData = clinics.flatMap(clinic => {
            const adultStat = stats?.patientsPerClinic.find(p => p.clinicName === clinic.name && p.type === PatientType.Adult);
            const childStat = stats?.patientsPerClinic.find(p => p.clinicName === clinic.name && p.type === PatientType.Child);
            return [
              { clinicName: clinic.name, patientCount: adultStat ? adultStat.patientCount : 0, type: 'Adults' },
              { clinicName: clinic.name, patientCount: childStat ? childStat.patientCount : 0, type: 'Children' },
            ];
          });
          const patientsPerClinicConfig: ColumnConfig = {
            data: patientsPerClinicData,
            xField: 'clinicName',
            yField: 'patientCount',
            seriesField: 'type',
            isGroup: true,
            height: 300,
            legend: { position: 'top-right' },
          };
          return (
            <Card title="Patients per Clinic">
                <Column {...patientsPerClinicConfig} />
            </Card>
          )
        }}
      </OfflineDataWrapper>
    </div>
  );
}