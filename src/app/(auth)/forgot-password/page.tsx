'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { passwordResetClient } from '@/clients/passwordResetClient';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const result = await passwordResetClient.requestPasswordReset(values.email);
      message.success(result.message);
      setEmailSent(true);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      message.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MailOutlined className="text-2xl text-green-600" />
            </div>
            <Title level={3} className="mb-4">
              Check Your Email
            </Title>
            <Text className="text-gray-600 mb-6 block">
              We've sent a password reset link to your email address. 
              Please check your inbox and follow the instructions to reset your password.
            </Text>
            <div className="space-y-3">
              <Link href="/login">
                <Button type="primary" block>
                  Back to Login
                </Button>
              </Link>
              <Button 
                onClick={() => setEmailSent(false)}
                block
              >
                Try Another Email
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeftOutlined className="mr-2" />
            Back to Login
          </Link>
          <Title level={2} className="mb-2">
            Forgot Password
          </Title>
          <Text className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </div>

        <Form
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter your email address"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-12"
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6">
          <Text className="text-gray-500 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              Sign in here
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
} 