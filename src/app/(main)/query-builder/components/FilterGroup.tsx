'use client';

import { FilterCondition } from '@/types/Query';
import QueryFilter from './QueryFilter';
import { Button } from 'antd';

interface FilterGroupProps {
  filters: FilterCondition[];
  onFilterChange: (filters: FilterCondition[]) => void;
  schema: any[];
  schemaLoading: boolean;
}

const FilterGroup = ({
  filters,
  onFilterChange,
  schema,
  schemaLoading,
}: FilterGroupProps) => {
  const handleAddFilter = () => {
    const newFilters = [
      ...filters,
      {
        id: new Date().getTime().toString(),
        field: '',
        operator: 'equals',
        value: '',
      },
    ];
    onFilterChange(newFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (index: number, filter: FilterCondition) => {
    const newFilters = [...filters];
    newFilters[index] = filter;
    onFilterChange(newFilters);
  };

  return (
    <div className='pl-4 border-l-2 space-y-2'>
      {filters.map((filter, index) => (
        <QueryFilter
          key={filter.id}
          index={index}
          filter={filter}
          onFilterChange={handleFilterChange}
          onRemoveFilter={handleRemoveFilter}
          schema={schema}
          schemaLoading={schemaLoading}
        />
      ))}
      <Button type='dashed' size='small' onClick={handleAddFilter}>
        Add Sub-Filter
      </Button>
    </div>
  );
};

export default FilterGroup; 