'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReports,
  deleteReport,
  deleteBulkReports,
  updateReport,
} from '@/clients/reportClient';
import {
  Card,
  Spin,
  Alert,
  Button,
  Row,
  Col,
  Checkbox,
  Modal,
  message,
  Form,
  Input,
} from 'antd';
import Link from 'next/link';
import { IReport } from '@/models/main/Report';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const ReportsPage = () => {
  const queryClient = useQueryClient();
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState<IReport | null>(null);
  const [form] = Form.useForm();

  const {
    data: reports,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      message.success('Report deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete report');
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: deleteBulkReports,
    onSuccess: () => {
      message.success('Selected reports deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setSelectedReportIds([]);
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete reports');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      report,
    }: {
      id: string;
      report: Partial<IReport>;
    }) => updateReport(id, report),
    onSuccess: () => {
      message.success('Report updated successfully');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setIsEditModalVisible(false);
      setEditingReport(null);
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update report');
    },
  });

  const handleCheckboxChange = (reportId: string, checked: boolean) => {
    setSelectedReportIds(prev =>
      checked ? [...prev, reportId] : prev.filter(id => id !== reportId)
    );
  };

  const showDeleteConfirm = (reportId: string) => {
    confirm({
      title: 'Are you sure you want to delete this report?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        deleteMutation.mutate(reportId);
      },
    });
  };

  const showBulkDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete the selected reports?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        bulkDeleteMutation.mutate(selectedReportIds);
      },
    });
  };

  const showEditModal = (report: IReport) => {
    setEditingReport(report);
    form.setFieldsValue({
      name: report.name,
      description: report.description,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdate = (values: { name: string; description: string }) => {
    if (editingReport) {
      updateMutation.mutate({ id: String(editingReport._id), report: values });
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Spin size='large' />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert message='Error' description={error.message} type='error' showIcon />
    );
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Reports Management</h1>
        {selectedReportIds.length > 0 && (
          <Button
            type='primary'
            danger
            onClick={showBulkDeleteConfirm}
            loading={bulkDeleteMutation.isPending}
          >
            Delete Selected ({selectedReportIds.length})
          </Button>
        )}
      </div>

      <Row gutter={[16, 16]}>
        {reports &&
          reports.map((report: IReport) => (
            <Col key={String(report._id)} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={
                  <div className='flex items-center'>
                    <Checkbox
                      className='mr-2'
                      onChange={e =>
                        handleCheckboxChange(String(report._id), e.target.checked)
                      }
                      checked={selectedReportIds.includes(String(report._id))}
                    />
                    {report.name}
                  </div>
                }
                actions={[
                  <Link key='open' href={`/reports/${report._id}`}>
                    <Button type='primary'>Open</Button>
                  </Link>,
                  <Button key='edit' onClick={() => showEditModal(report)}>
                    Edit
                  </Button>,
                  <Button
                    key='delete'
                    danger
                    onClick={() => showDeleteConfirm(String(report._id))}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <Card.Meta description={report.description} />
              </Card>
            </Col>
          ))}
      </Row>
      <Modal
        title='Edit Report'
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        {editingReport && (
          <Form
            form={form}
            layout='vertical'
            onFinish={handleUpdate}
            initialValues={{
              name: editingReport.name,
              description: editingReport.description,
            }}
          >
            <Form.Item
              name='name'
              label='Name'
              rules={[{ required: true, message: 'Please input the name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='description'
              label='Description'
              rules={[
                { required: true, message: 'Please input the description!' },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={updateMutation.isPending}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ReportsPage; 