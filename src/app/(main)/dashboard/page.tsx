'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Card, Descriptions } from 'antd';
import { useSession } from 'next-auth/react';

const { Title } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);


  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto ">
      <div className="flex justify-between items-center mb-8">
        <Title level={2}>Dashboard</Title>
      </div>

      <Card title="Your Information" className="mb-6">
        {session?.user && (
          <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="User ID">{session.user.id}</Descriptions.Item>
            <Descriptions.Item label="Email">{session.user.email}</Descriptions.Item>
            <Descriptions.Item label="Name">{session.user.name || 'Not provided'}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card title="Welcome to the Dashboard">
        <p>This is a protected page that can only be accessed by authenticated users.</p>
        <p>Use the navigation to explore your account and manage your data.</p>
      </Card>
    </div>
  );
} 