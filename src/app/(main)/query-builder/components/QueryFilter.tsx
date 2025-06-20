'use client';

import { Select, Input, Button } from 'antd';
import { FilterCondition } from '@/types/Query';
import { MinusCircleOutlined } from '@ant-design/icons';
import FilterGroup from './FilterGroup';

const { Option } = Select;

interface QueryFilterProps {
  index: number;
  filter: FilterCondition;
  onFilterChange: (index: number, filter: FilterCondition) => void;
  onRemoveFilter: (index: number) => void;
  schema: { name: string; type: string; subSchema?: any[] }[];
  schemaLoading: boolean;
}

const operatorOptions = [
  { label: 'Equals', value: 'equals' },
  { label: 'Not Equals', value: 'not_equals' },
  { label: 'Greater Than', value: 'gt' },
  { label: 'Greater Than or Equal', value: 'gte' },
  { label: 'Less Than', value: 'lt' },
  { label: 'Less Than or Equal', value: 'lte' },
  { label: 'Contains', value: 'contains' },
  { label: 'Matches Element', value: 'elemMatch' },
];

const QueryFilter = ({
  index,
  filter,
  onFilterChange,
  onRemoveFilter,
  schema,
  schemaLoading,
}: QueryFilterProps) => {
  const selectedFieldSchema = schema.find((s) => s.name === filter.field);
  const isArrayField = selectedFieldSchema?.type === 'Array';

  const handleFieldChange = (value: string) => {
    onFilterChange(index, { ...filter, field: value, value: '' });
  };

  const handleOperatorChange = (value: string) => {
    const isElemMatch = value === 'elemMatch';
    onFilterChange(index, {
      ...filter,
      operator: value,
      value: isElemMatch ? [{ id: new Date().getTime().toString(), field: '', operator: 'equals', value: '' }] : '',
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(index, { ...filter, value: e.target.value });
  };
  
  const handleSubFilterChange = (subFilters: FilterCondition[]) => {
    onFilterChange(index, { ...filter, value: subFilters });
  };

  return (
    <div className='flex items-start gap-2 mb-2'>
      <div className="flex-shrink-0 flex items-center gap-2">
        <Select
          showSearch
          style={{ width: 150 }}
          placeholder='Select field'
          value={filter.field}
          onChange={handleFieldChange}
          loading={schemaLoading}
          options={schema.map((field) => ({
            value: field.name,
            label: field.name,
          }))}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
        <Select
          style={{ width: 180 }}
          placeholder='Select operator'
          value={filter.operator}
          onChange={handleOperatorChange}
        >
          {operatorOptions
            .filter((op) => (isArrayField ? true : op.value !== 'elemMatch'))
            .map((op) => (
              <Option key={op.value} value={op.value}>
                {op.label}
              </Option>
            ))}
        </Select>
      </div>

      <div className="flex-grow">
        {filter.operator === 'elemMatch' ? (
          <FilterGroup
            filters={filter.value}
            onFilterChange={handleSubFilterChange}
            schema={selectedFieldSchema?.subSchema || []}
            schemaLoading={schemaLoading}
          />
        ) : (
          <Input
            style={{ width: 200 }}
            placeholder='Enter value'
            value={filter.value}
            onChange={handleValueChange}
          />
        )}
      </div>

      <Button
        type='text'
        danger
        icon={<MinusCircleOutlined />}
        onClick={() => onRemoveFilter(index)}
      />
    </div>
  );
};

export default QueryFilter; 