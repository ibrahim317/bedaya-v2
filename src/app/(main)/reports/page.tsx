'use client';

import { useQuery } from '@tanstack/react-query';
import { getReports } from '@/clients/reportClient';
import { Card, Spin, Alert, Button, Row, Col } from 'antd';
import Link from 'next/link';
import { IReport } from '@/models/main/Report';

const ReportsPage = () => {
  const {
    data: reports,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Spin size='large' />
      </div>
    );
  }

  if (isError) {
    return <Alert message='Error' description={error.message} type='error' showIcon />;
  }

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>Saved Reports</h1>
      <Row gutter={[16, 16]}>
        {reports &&
          reports.map((report: IReport) => (
            <Col key={String(report._id)} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={report.name}
                actions={[
                  <Link key='open' href={`/reports/${report._id}`}>
                    <Button type='primary'>Open</Button>
                  </Link>,
                ]}
              >
                <Card.Meta description={report.description} />
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default ReportsPage; 