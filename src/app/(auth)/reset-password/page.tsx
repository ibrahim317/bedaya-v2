'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Alert } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { passwordResetClient } from '@/clients/passwordResetClient';

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setVerifying(false);
        return;
      }

      try {
        const result = await passwordResetClient.verifyResetToken(token);
        setTokenValid(result.valid);
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await passwordResetClient.resetPassword(token!, values.password);
      message.success(result.message);
      setPasswordReset(true);
    } catch (error: any) {
      console.error('Reset password error:', error);
      message.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <Title level={4}>Verifying Reset Link...</Title>
            <Text className="text-gray-600">Please wait while we verify your reset link.</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <LockOutlined className="text-2xl text-red-600" />
            </div>
            <Title level={3} className="mb-4">
              Invalid Reset Link
            </Title>
            <Alert
              message="Reset Link Expired or Invalid"
              description="This password reset link has expired or is invalid. Please request a new password reset link."
              type="error"
              showIcon
              className="mb-6"
            />
            <div className="space-y-3">
              <Link href="/forgot-password">
                <Button type="primary" block>
                  Request New Reset Link
                </Button>
              </Link>
              <Link href="/login">
                <Button block>
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (passwordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <LockOutlined className="text-2xl text-green-600" />
            </div>
            <Title level={3} className="mb-4">
              Password Reset Successful
            </Title>
            <Text className="text-gray-600 mb-6 block">
              Your password has been successfully reset. You can now log in with your new password.
            </Text>
            <Link href="/login">
              <Button type="primary" block>
                Go to Login
              </Button>
            </Link>
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
            Reset Password
          </Title>
          <Text className="text-gray-600">
            Enter your new password below.
          </Text>
        </div>

        <Form
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your new password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm your new password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
              Reset Password
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