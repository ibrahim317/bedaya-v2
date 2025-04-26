'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography, Card, Divider, Alert, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { usersClient } from '@/clients/usersClient';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(
    searchParams.get('error') || null
  );
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.error === 'CredentialsSignin') {
        setError('Invalid email or password');
        return;
      }

      if (response?.error === 'UserNotVerified') {
        setError('Your account is pending verification by an admin');
        return;
      }

      if (response?.error) {
        setError(response.error);
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      messageApi.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <Title level={2}>Log In</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}

        <Form
          name="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="mt-2"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary">Don&apos;t have an account?</Text>
        </Divider>

        <div className="text-center">
          <Link href="/register">
            <Button type="default" block>
              Create Account
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
} 