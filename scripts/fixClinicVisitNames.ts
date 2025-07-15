
import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import ClinicVisit from '../src/models/main/ClinicVisit';
import { Patient } from '../src/models/main/Patient';
import Clinic from '../src/models/main/Clinic';

async function fixClinicVisitNames() {
  await connectDB();
  console.log('Database connected. Starting migration...');

  const visitsToFix = await ClinicVisit.find({
    $or: [{ clinicName: { $eq: null } }, { patientName: { $eq: null } }],
  });

  console.log(`Found ${visitsToFix.length} clinic visits to update.`);

  for (const visit of visitsToFix) {
    let patientName: string | null = visit.patientName;
    let clinicName: string | null = visit.clinicName;
    let needsUpdate = false;

    if (!patientName && visit.patientId) {
      const patient = await Patient.findById(visit.patientId);
      if (patient) {
        patientName = patient.name;
        needsUpdate = true;
        console.log(`Found patient name: ${patientName} for visit ${visit._id}`);
      } else {
        console.log(`Could not find patient with ID: ${visit.patientId} for visit ${visit._id}`);
      }
    }

    if (!clinicName && visit.clinicId) {
      const clinic = await Clinic.findById(visit.clinicId);
      if (clinic) {
        clinicName = clinic.name;
        needsUpdate = true;
        console.log(`Found clinic name: ${clinicName} for visit ${visit._id}`);
      } else {
        console.log(`Could not find clinic with ID: ${visit.clinicId} for visit ${visit._id}`);
      }
    }

    if (needsUpdate) {
      await ClinicVisit.updateOne(
        { _id: visit._id },
        {
          $set: {
            patientName: patientName,
            clinicName: clinicName,
          },
        }
      );
      console.log(`Updated visit ${visit._id} with Patient: ${patientName}, Clinic: ${clinicName}`);
    }
  }

  console.log('Migration completed.');
  await mongoose.connection.close();
  console.log('Database connection closed.');
  process.exit(0);
}

fixClinicVisitNames().catch(err => {
  console.error('An error occurred during the migration:', err);
  process.exit(1);
}); 