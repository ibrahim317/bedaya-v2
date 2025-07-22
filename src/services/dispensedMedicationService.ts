import DispensedMedication from '@/models/main/DispensedMedication';
import Drug from '@/models/main/Drug';
import { IDispensedMedication, DispensedMedicationData, IPopulatedDispensedMedication } from '@/types/DispensedMedication';
import { connectDB } from '@/lib/db';
import { IPatient } from '@/types/Patient';
import { Patient } from '@/models/main/Patient';

export async function createDispensedMedication(
  data: Omit<DispensedMedicationData, 'patientName'>
): Promise<IDispensedMedication> {
  await connectDB();

  try {
    const patient = await Patient.findById(data.patientId);
    if (!patient) {
      throw new Error(`Patient with id ${data.patientId} not found`);
    }
    const dataWithPatientName = {
      ...data,
      patientName: patient.name,
    };
    // Create the dispensed medication record
    const dispensedMedication = new DispensedMedication(dataWithPatientName);
    await dispensedMedication.save();

    // Update drug quantities
    for (const med of data.medications) {
      const drug = await Drug.findOne({ barcode: med.drug.barcode });
      if (!drug) {
        throw new Error(`Drug with barcode ${med.drug.barcode} not found`);
      }
      if (drug.quantityByPills < med.quantity) {
        throw new Error(`Not enough stock for drug ${drug.name}`);
      }
      drug.quantityByPills -= med.quantity;
      if (drug.dailyConsumption) {
        drug.dailyConsumption[0] += med.quantity;
      } else {
        drug.dailyConsumption = [med.quantity];
      }
      await drug.save();
    }

    return dispensedMedication;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to dispense medication');
  }
}

export async function getDispensedMedicationsByPatientId(
  patientId: string
): Promise<IDispensedMedication[]> {
  await connectDB();
  try {
    const dispensedMedications = await DispensedMedication.find({ patientId }).populate({
      path: 'medications.drug',
      model: Drug,
    });
    return dispensedMedications;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get dispensed medications');
  }
}

export async function updateDispensedMedication(
  id: string,
  data: Omit<DispensedMedicationData, 'patientName'>
): Promise<IDispensedMedication> {
  await connectDB();
  try {
    // Find the existing dispensed medication
    const existingRecord = await DispensedMedication.findById(id);
    if (!existingRecord) {
      throw new Error('Dispensed medication record not found');
    }
    const patient = await Patient.findById(data.patientId);
    if (!patient) {
      throw new Error(`Patient with id ${data.patientId} not found`);
    }
    const dataWithPatientName = {
      ...data,
      patientName: patient.name,
    };

    // Revert the previous drug quantities
    for (const med of existingRecord.medications) {
      const drug = await Drug.findOne({ barcode: med.drug.barcode });
      if (drug) {
        let quantityInPills = med.remainingQuantity;
        if (med.remainingUnit === 'boxes') {
            quantityInPills = med.remainingQuantity * (drug.stripsPerBox || 1) * (drug.pillsPerStrip || 1);
        } else if (med.remainingUnit === 'strips') {
            quantityInPills = med.remainingQuantity * (drug.pillsPerStrip || 1);
        }

        drug.quantityByPills += quantityInPills;
        if (drug.dailyConsumption && drug.dailyConsumption[0] >= quantityInPills) {
          drug.dailyConsumption[0] -= quantityInPills;
        }
        await drug.save();
      }
    }

    // Apply the new drug quantities
    for (const med of data.medications) {
      const drug = await Drug.findOne({ barcode: med.drug.barcode });
      if (!drug) {
        throw new Error(`Drug with barcode ${med.drug.barcode} not found`);
      }

      let quantityInPills = med.remainingQuantity;
      if (med.remainingUnit === 'boxes') {
          quantityInPills = med.remainingQuantity * (drug.stripsPerBox || 1) * (drug.pillsPerStrip || 1);
      } else if (med.remainingUnit === 'strips') {
          quantityInPills = med.remainingQuantity * (drug.pillsPerStrip || 1);
      }

      if (drug.quantityByPills < quantityInPills) {
        throw new Error(`Not enough stock for drug ${drug.name}`);
      }
      drug.quantityByPills -= quantityInPills;
      if (drug.dailyConsumption) {
        drug.dailyConsumption[0] += quantityInPills;
      } else {
        drug.dailyConsumption = [quantityInPills];
      }
      await drug.save();
    }

    // Update the record
    const updatedRecord = await DispensedMedication.findByIdAndUpdate(
      id,
      dataWithPatientName,
      { new: true }
    );
    
    return updatedRecord as IDispensedMedication;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update dispensed medication');
  }
}

export async function deleteDispensedMedication(id: string): Promise<void> {
  await connectDB();
  try {
    // Find the existing record
    const record = await DispensedMedication.findById(id);
    if (!record) {
      throw new Error('Dispensed medication record not found');
    }

    // Revert the drug quantities
    for (const med of record.medications) {
      const drug = await Drug.findOne({ barcode: med.drug.barcode });
      if (drug) {
        let quantityInPills = med.remainingQuantity;
        if (med.remainingUnit === 'boxes') {
            quantityInPills = med.remainingQuantity * (drug.stripsPerBox || 1) * (drug.pillsPerStrip || 1);
        } else if (med.remainingUnit === 'strips') {
            quantityInPills = med.remainingQuantity * (drug.pillsPerStrip || 1);
        }

        drug.quantityByPills += quantityInPills;
        if (drug.dailyConsumption && drug.dailyConsumption[0] >= quantityInPills) {
          drug.dailyConsumption[0] -= quantityInPills;
        }
        await drug.save();
      }
    }

    // Delete the record
    await DispensedMedication.findByIdAndDelete(id);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete dispensed medication');
  }
}

export type PaginatedDispensedMedications = {
  medications: IPopulatedDispensedMedication[];
  total: number;
  page: number;
  limit: number;
};

export const dispensedMedicationService = {
  async findAllPaginated(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedDispensedMedications> {
    await connectDB();

    const pipeline: any[] = [];

    // Populate patient information
    pipeline.push({
      $lookup: {
        from: 'patients',
        localField: 'patientId',
        foreignField: '_id',
        as: 'patientInfo',
      },
    });

    pipeline.push({
      $unwind: '$patientInfo',
    });
    
    // Search functionality
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'patientInfo.name': { $regex: search, $options: 'i' } },
            { 'patientInfo.code': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    // Count total documents
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: 'total' });
    const countResult = await DispensedMedication.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add sorting, skipping, and limiting for pagination
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    const medications = await DispensedMedication.aggregate(pipeline);
    
    const populatedMedications: IPopulatedDispensedMedication[] = medications.map(med => ({
      ...med,
      _id: med._id.toString(),
      patientId: {
        _id: med.patientInfo._id.toString(),
        name: med.patientInfo.name,
        code: med.patientInfo.code,
      }
    }));

    return {
      medications: populatedMedications,
      total,
      page,
      limit,
    };
  },
};


export async function getDailyDispensedMedicationStats(): Promise<{ date: string; count: number }[]> {
  await connectDB();
  try {
    const stats = await DispensedMedication.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: '$count',
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
    return stats;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get daily dispensed medication stats');
  }
}
