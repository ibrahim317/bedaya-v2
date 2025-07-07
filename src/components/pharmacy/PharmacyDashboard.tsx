"use client";

import { useState, useEffect } from "react";
import { Row, Col, Card, Spin, Alert } from "antd";
import { Line } from '@ant-design/charts';
import { dispensedMedicationsClient } from "@/clients/dispensedMedicationsClient";

interface PharmacyDashboardProps {
  messageApi: any;
}

export default function PharmacyDashboard({ messageApi }: PharmacyDashboardProps) {
  const [dailyStats, setDailyStats] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await dispensedMedicationsClient.getDailyDispensedStats();
      setDailyStats(stats);
    } catch (error) {
      setError("Failed to fetch daily statistics");
      console.error("Error fetching daily stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyStats();
  }, []);

  const chartConfig = {
    data: dailyStats,
    xField: 'date',
    yField: 'count',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="Daily Dispensed Medications">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <Alert message={error} type="error" />
          ) : (
            <Line {...chartConfig} />
          )}
        </Card>
      </Col>
    </Row>
  );
} 