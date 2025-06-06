import DispensedMedication from '@/models/main/DispensedMedication';
import Drug from '@/models/main/Drug';
import { IDispensedMedication, DispensedMedicationData } from '@/types/DispensedMedication';
import { connectDB } from '@/lib/db';

export async function createDispensedMedication(
  data: DispensedMedicationData
): Promise<IDispensedMedication> {
  await connectDB();

  try {
    // Create the dispensed medication record
    const dispensedMedication = new DispensedMedication(data);
    await dispensedMedication.save();

    // Update drug quantities
    for (const med of data.medications) {
      const drug = await Drug.findById(med.drug);
      if (!drug) {
        throw new Error(`Drug with ID ${med.drug} not found`);
      }
      if (drug.quantity < med.quantity) {
        throw new Error(`Not enough stock for drug ${drug.name}`);
      }
      drug.quantity -= med.quantity;
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
