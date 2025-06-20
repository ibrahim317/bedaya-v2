'use client';

import { useState } from 'react';
import { Button, Select, Table, App, Form, Input, Modal } from 'antd';
import QueryFilter from '@/app/(main)/query-builder/components/QueryFilter';
import { FilterCondition } from '@/types/Query';
import {
  getAvailableCollections,
  getCollectionSchema,
  getQueryResults,
} from '@/clients/queryClient';
import { saveReport } from '@/clients/reportClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const { Option } = Select;

const QueryBuilderPage = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [aggregation, setAggregation] = useState<{
    type: 'count' | 'avg';
    field?: string;
  } | null>(null);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const queryClient = useQueryClient();

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

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: getAvailableCollections,
  });

  const { data: schema, isLoading: schemaLoading } = useQuery({
    queryKey: ['schema', selectedCollection],
    queryFn: () => getCollectionSchema(selectedCollection!),
    enabled: !!selectedCollection,
  });

  const handleApplyFilters = async () => {
    if (!selectedCollection) return;
    const results = await getQueryResults({
      collectionName: selectedCollection,
      filters,
      fields: selectedFields,
      groupBy,
      aggregation,
    });
    setTableData(results);

    if (results.length > 0) {
      if (groupBy.length > 0) {
        const firstResult = results[0];
        const idKeys = Object.keys(firstResult._id);
        const otherKeys = Object.keys(firstResult).filter((k) => k !== '_id');

        const flattenedData = results.map((row: any, index: number) => {
          const newRow: { [key: string]: any } = { key: index };
          idKeys.forEach((key) => {
            newRow[key] = row._id[key];
          });
          otherKeys.forEach((key) => {
            newRow[key] = row[key];
          });
          return newRow;
        });

        const newColumns = [
          ...idKeys.map((key) => ({ title: key, dataIndex: key, key })),
          ...otherKeys.map((key) => ({ title: key, dataIndex: key, key })),
        ];

        setTableColumns(newColumns);
        setTableData(flattenedData);
      } else {
        const columns = Object.keys(results[0]).map((key) => ({
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
        setTableColumns(columns);
        setTableData(results);
      }
    } else {
      setTableColumns([]);
      setTableData([]);
    }
  };

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      {
        id: new Date().getTime().toString(),
        field: '',
        operator: 'equals',
        value: '',
      },
    ]);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const handleFilterChange = (
    index: number,
    filter: FilterCondition
  ) => {
    const newFilters = [...filters];
    newFilters[index] = filter;
    setFilters(newFilters);
  };

  const saveReportMutation = useMutation({
    mutationFn: saveReport,
    onSuccess: () => {
      message.success('Report saved successfully!');
      setIsSaveModalVisible(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Query Builder</h1>
      <div className='flex items-center gap-4 mb-4'>
        <Select
          style={{ width: 200 }}
          placeholder='Select a collection'
          loading={collectionsLoading}
          onChange={(value) => setSelectedCollection(value)}
        >
          {collections?.map((c: string) => (
            <Option key={c} value={c}>
              {c}
            </Option>
          ))}
        </Select>
      </div>

      {selectedCollection && (
        <div>
          <div className='mb-4 space-y-4'>
            <div>
              <h3 className='font-semibold mb-2'>Fields to display</h3>
              <Select
                mode='multiple'
                allowClear
                style={{ width: '100%' }}
                placeholder='Select fields (defaults to _id)'
                value={selectedFields}
                onChange={setSelectedFields}
                loading={schemaLoading}
                disabled={!!aggregation || groupBy.length > 0}
                options={schema?.map((s: { name: string; value: string }) => ({
                  label: s.name,
                  value: s.name,
                }))}
              />
            </div>
            <div>
              <h3 className='font-semibold mb-2'>Group By</h3>
              <Select
                mode='multiple'
                allowClear
                style={{ width: '100%' }}
                placeholder='Select fields to group by'
                value={groupBy}
                onChange={setGroupBy}
                loading={schemaLoading}
                options={schema
                  ?.filter((s) =>
                    ['String', 'Number', 'Boolean', 'Date', 'ObjectID'].includes(
                      s.type
                    )
                  )
                  .map((s) => ({
                    label: s.name,
                    value: s.name,
                  }))}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
            <div>
              <h3 className='font-semibold mb-2'>Aggregation</h3>
              <div className='flex items-center gap-2'>
                <Select
                  allowClear
                  style={{ width: 150 }}
                  placeholder='Select function'
                  value={aggregation?.type}
                  onChange={(type) =>
                    setAggregation(type ? { type } : null)
                  }
                >
                  <Option value='count'>Count</Option>
                  <Option value='avg'>Average</Option>
                </Select>
                {aggregation?.type === 'avg' && (
                  <Select
                    style={{ width: 200 }}
                    placeholder='Select field for average'
                    value={aggregation.field}
                    onChange={(field) =>
                      setAggregation({ ...aggregation, field })
                    }
                    loading={schemaLoading}
                    options={schema
                      ?.filter((s: { type: string }) => s.type === 'Number')
                      .map((s: { name: string; value: string }) => ({
                        label: s.name,
                        value: s.name,
                      }))}
                  />
                )}
              </div>
            </div>
          </div>

          <div className='mb-4'>
            <h3 className='font-semibold mb-2'>Filters</h3>
            {filters.map((filter, index) => (
              <QueryFilter
                key={filter.id}
                index={index}
                filter={filter}
                onFilterChange={handleFilterChange}
                onRemoveFilter={handleRemoveFilter}
                schema={schema || []}
                schemaLoading={schemaLoading}
              />
            ))}
          </div>
          <div className='flex items-center gap-2'>
            <Button type='dashed' onClick={handleAddFilter}>
              Add Filter
            </Button>
            <Button type='primary' onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button onClick={() => setFilters([])}>Clear Filters</Button>
            <Button
              type='default'
              onClick={() => setIsSaveModalVisible(true)}
              disabled={!selectedCollection}
            >
              Save Report
            </Button>
          </div>
        </div>
      )}

      <div className='mt-8'>
        <Table columns={tableColumns} dataSource={tableData} rowKey='_id' />
      </div>

      <Modal
        title='Save Report'
        open={isSaveModalVisible}
        onCancel={() => setIsSaveModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={saveReportMutation.isPending}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={(values) => {
            if (!selectedCollection) return;
            const queryPayload = {
              collectionName: selectedCollection,
              filters,
              fields: selectedFields,
              groupBy,
              aggregation,
            };
            saveReportMutation.mutate({ ...values, query: queryPayload });
          }}
        >
          <Form.Item
            name='name'
            label='Report Name'
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='description'
            label='Description'
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QueryBuilderPage; 