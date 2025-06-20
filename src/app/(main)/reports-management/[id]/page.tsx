'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getReportById } from '@/clients/reportClient';
import { getQueryResults } from '@/clients/queryClient';
import { Spin, Alert, Table, Card, Typography } from 'antd';
import { IReport } from '@/models/main/Report';

const { Title, Paragraph } = Typography;

const ReportDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  const {
    data: report,
    isLoading: isLoadingReport,
    isError: isErrorReport,
    error: errorReport,
  } = useQuery<IReport>({
    queryKey: ['report', id],
    queryFn: () => getReportById(id),
    enabled: !!id,
  });

  const {
    data: results,
    isLoading: isLoadingResults,
    isError: isErrorResults,
    error: errorResults,
  } = useQuery({
    queryKey: ['reportResults', id],
    queryFn: () => getQueryResults(report!.query),
    enabled: !!report,
  });
  
  const renderComplexCell = (data: any) => {
    if (data === null || data === undefined) {
      return <span style={{ color: '#ccc' }}>null</span>;
    }

    if (Array.isArray(data)) {
      if (data.length === 0) return <span style={{ color: '#ccc' }}>[]</span>;
      return (
        <div
          style={{
            maxHeight: '150px',
            overflowY: 'auto',
            padding: '5px',
            backgroundColor: '#fafafa',
            border: '1px solid #f0f0f0',
            borderRadius: '4px',
          }}
        >
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                borderBottom: index < data.length - 1 ? '1px solid #e8e8e8' : 'none',
                marginBottom: '4px',
                paddingBottom: '4px',
              }}
            >
              {typeof item === 'object' && item !== null ? (
                Object.entries(item).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong>{' '}
                    {typeof value === 'object' && value !== null
                      ? '...'
                      : String(value)}
                  </div>
                ))
              ) : (
                String(item)
              )}
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === 'object' && data !== null) {
      if (Object.keys(data).length === 0) return <span style={{ color: '#ccc' }}>{'{}'}</span>;
      if (data.hasOwnProperty('_bsontype') && data._bsontype === 'ObjectID') {
        return data.toString();
      }
      return (
        <div style={{ maxHeight: '150px', overflowY: 'auto', padding: '5px' }}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong>{' '}
              {typeof value === 'object' && value !== null
                ? '...'
                : String(value)}
            </div>
          ))}
        </div>
      );
    }

    return String(data);
  };

  if (isLoadingReport) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Spin size='large' />
      </div>
    );
  }

  if (isErrorReport) {
    return (
      <Alert
        message='Error loading report'
        description={errorReport.message}
        type='error'
        showIcon
      />
    );
  }

  if (!report) {
    return <Alert message='Report not found' type='warning' showIcon />;
  }

  let columns: any[] = [];
  let dataSource: any[] = [];
  let rowKey: string | ((record: any) => string) = '_id';

  if (results && results.length > 0) {
    if (report.query.groupBy && report.query.groupBy.length > 0) {
      const firstResult = results[0];
      const idKeys = Object.keys(firstResult._id);
      const otherKeys = Object.keys(firstResult).filter((k) => k !== '_id');

      dataSource = results.map((row: any, index: number) => {
        const newRow: { [key: string]: any } = { key: index };
        idKeys.forEach((key) => {
          newRow[key] = row._id[key];
        });
        otherKeys.forEach((key) => {
          newRow[key] = row[key];
        });
        return newRow;
      });

      columns = [
        ...idKeys.map((key) => ({ title: key, dataIndex: key, key })),
        ...otherKeys.map((key) => ({ title: key, dataIndex: key, key })),
      ];
      rowKey = 'key';
    } else {
      dataSource = results;
      columns = Object.keys(results[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key: key,
        render: (value: any) => {
          if (typeof value === 'object' && value !== null) {
            return renderComplexCell(value);
          }
          return value;
        },
      }));
    }
  }

  return (
    <div className='p-6'>
      <Card>
        <Title level={2}>{report.name}</Title>
        <Paragraph>{report.description}</Paragraph>
      </Card>
      <Card className='mt-6'>
        {isLoadingResults && <Spin />}
        {isErrorResults && (
          <Alert
            message='Error loading results'
            description={errorResults.message}
            type='error'
            showIcon
          />
        )}
        {results && (
          <Table dataSource={dataSource} columns={columns} rowKey={rowKey} />
        )}
      </Card>
    </div>
  );
};

export default ReportDetailPage; 