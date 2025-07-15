import { FilterCondition, MongoDbQuery } from '@/types/Query';
import { Patient } from '@/models/main/Patient';
import Drug from '@/models/main/Drug';
import Clinic from '@/models/main/Clinic';
import { Model } from 'mongoose';
import ClinicVisit from '@/models/main/ClinicVisit';
import DispensedMedication from '@/models/main/DispensedMedication';

const registeredModels: { [key: string]: Model<any> } = {
  Patient,
  Clinic,
  Drug,
  DispensedMedication,
  ClinicVisit,
};

function buildMongoQuery(filters: FilterCondition[]): MongoDbQuery {
  if (!filters || filters.length === 0) {
    return {};
  }

  const queryConditions = filters.map((filter) => {
    const { field, operator, value } = filter;
    let condition = {};
    switch (operator) {
      case 'equals':
        condition = { [field]: value };
        break;
      case 'not_equals':
        condition = { [field]: { $ne: value } };
        break;
      case 'gt':
        condition = { [field]: { $gt: Number(value) } };
        break;
      case 'gte':
        condition = { [field]: { $gte: Number(value) } };
        break;
      case 'lt':
        condition = { [field]: { $lt: Number(value) } };
        break;
      case 'lte':
        condition = { [field]: { $lte: Number(value) } };
        break;
      case 'contains':
        condition = { [field]: { $regex: value, $options: 'i' } };
        break;
      case 'elemMatch':
        condition = { [field]: { $elemMatch: buildMongoQuery(value) } };
        break;
      // Add more operators as needed
      default:
        break;
    }
    return condition;
  });

  if (queryConditions.length === 0) {
    return {};
  }

  return { $and: queryConditions.filter((c) => Object.keys(c).length > 0) };
}

export async function getQueryResults(
  collectionName: string,
  filters: FilterCondition[],
  fields: string[],
  groupBy: string[],
  aggregation: { type: string; field?: string } | null
) {
  try {
    const model = registeredModels[collectionName];

    if (!model) {
      throw new Error(`Collection not found: ${collectionName}`);
    }

    const mongoQuery = buildMongoQuery(filters);
    const pipeline: any[] = [];

    if (Object.keys(mongoQuery).length > 0) {
      pipeline.push({ $match: mongoQuery });
    }

    if (groupBy && groupBy.length > 0) {
      const groupStage: any = {
        _id: groupBy.reduce((acc, field) => {
          acc[field] = `$${field}`;
          return acc;
        }, {} as Record<string, any>),
      };

      if (aggregation?.type === 'count') {
        groupStage.count = { $sum: 1 };
      } else if (aggregation?.type === 'avg' && aggregation.field) {
        groupStage.average = { $avg: `$${aggregation.field}` };
      }

      pipeline.push({ $group: groupStage });

      const results = await model.aggregate(pipeline);
      return results;
    }

    if (aggregation) {
      if (aggregation.type === 'count') {
        pipeline.push({ $count: 'count' });
      } else if (aggregation.type === 'avg' && aggregation.field) {
        pipeline.push({
          $group: {
            _id: null,
            average: { $avg: `$${aggregation.field}` },
          },
        });
      }
      const results = await model.aggregate(pipeline);
      return results;
    } else {
      let projection: { [key: string]: any } = {};
      if (fields && fields.length > 0) {
        const virtuals = model.schema.virtuals as { [key: string]: any };
        const virtualKeys = Object.keys(virtuals);

        projection = fields.reduce((acc, field) => {
          if (virtualKeys.includes(field)) {
            // It's a virtual. Add its dependencies to the projection.
            const virtual = virtuals[field];
            if (virtual && virtual.options.c_dependencies) {
              virtual.options.c_dependencies.forEach((dep: string) => {
                acc[dep] = 1;
              });
            }
          } else {
            // It's a real field. Add it directly.
            acc[field] = 1;
          }
          return acc;
        }, {} as Record<string, number>);
        if (!fields.includes('_id')) {
          projection['_id'] = 0;
        }
      } else {
        projection = { _id: 1 };
      }

      const docs = await model.find(mongoQuery).select(projection); // no .lean()

      if (fields && fields.length > 0) {
        return docs.map((doc: any) => {
          const obj = doc.toObject({ virtuals: true });
          const filtered: any = {};
          for (const field of fields) {
            if (obj[field] !== undefined) filtered[field] = obj[field];
          }
          return filtered;
        });
      }
      return docs.map((doc: any) => doc.toObject({ virtuals: true }));
    }
  } catch (error) {
    console.error(`Error in getQueryResults for ${collectionName}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to execute query: ${error.message}`);
    }
    throw new Error('An unknown error occurred while executing the query.');
  }
}

export async function getCollectionSchema(collectionName: string) {
  try {
    const model = registeredModels[collectionName];

    if (!model) {
      throw new Error(`Collection not found: ${collectionName}`);
    }

    const schemaPaths = model.schema.paths;
    const fields = Object.keys(schemaPaths)
      .filter((path) => !path.startsWith('_'))
      .map((path) => {
        const schemaPath = schemaPaths[path];
        const field: { name: string; type: string; subSchema?: any, virtual?: boolean } = {
          name: path,
          type: schemaPath.instance,
          virtual: false,
        };

        if (
          schemaPath.instance === 'Array' &&
          schemaPath.schema &&
          schemaPath.schema.paths
        ) {
          field.subSchema = Object.keys(schemaPath.schema.paths)
            .filter((subPath) => !subPath.startsWith('_'))
            .map((subPath) => ({
              name: subPath,
              type: schemaPath.schema.paths[subPath].instance,
            }));
        }

        return field;
      });

    const virtuals = model.schema.virtuals as { [key: string]: any };
    const virtualFields = Object.keys(virtuals)
        .filter((key) => key !== 'id')
        .map((key) => {
            const virtual = virtuals[key];
            return {
                name: key,
                type: virtual.options.c_type || 'Virtual',
                virtual: true,
            };
        });

    return [...fields, ...virtualFields];
  } catch (error) {
    console.error(`Error in getCollectionSchema for ${collectionName}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to get schema: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching the schema.');
  }
}

export function getAvailableCollections() {
  return Object.keys(registeredModels);
}