import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import { Patient } from '../src/models/main/Patient';
import DispensedMedication from '../src/models/main/DispensedMedication';

async function fixDispensedMedicationNames() {
  await connectDB();
  console.log('Database connected. Starting migration...');

  const dispensedMedicationsToFix = await DispensedMedication.find({
    $or: [{ patientName: { $eq: null } }],
  });

  console.log(`Found ${dispensedMedicationsToFix.length} dispensed medications to update.`);

  for (const dispensedMedication of dispensedMedicationsToFix) {
    let patientName: string | null = dispensedMedication.patientName;
    let needsUpdate = false;

    if (!patientName && dispensedMedication.patientId) {
      const patient = await Patient.findById(dispensedMedication.patientId).select("name");
      if (patient) {
        patientName = patient.name;
        needsUpdate = true;
        console.log(`Found patient name: ${patientName} for dispensed medication ${dispensedMedication._id}`);
      } else {
        console.log(`Could not find patient with ID: ${dispensedMedication.patientId} for dispensed medication ${dispensedMedication._id}`);
      }
    }
    if (needsUpdate) {
      await DispensedMedication.updateOne(
        { _id: dispensedMedication._id },
        {
          $set: {
            patientName: patientName,
          },
        }
      );
      console.log(`Updated dispensed medication ${dispensedMedication._id} with Patient: ${patientName}`);
    }
  }

  console.log('Migration completed.');
  await mongoose.connection.close();
  console.log('Database connection closed.');
  process.exit(0);
}

fixDispensedMedicationNames().catch(err => {
  console.error('An error occurred during the migration:', err);
  process.exit(1);
}); 