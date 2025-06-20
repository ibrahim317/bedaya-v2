export type FilterCondition = {
  id: string; // For React keys
  field: string;
  operator: string;
  value: any | FilterCondition[];
};

export type QueryPayload = {
  collectionName: string;
  filters: FilterCondition[];
  fields: string[];
  groupBy: string[];
  aggregation: {
    type: 'count' | 'avg';
    field?: string;
  } | null;
};

export type MongoDbQuery = {
  [key: string]: any;
}; 