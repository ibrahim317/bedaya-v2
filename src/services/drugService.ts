import Drug from '../models/main/Drug';
import { IDrug, IDrugWithId } from '@/types/Drug';
import { connectDB }from '@/lib/db';
import { Document } from 'mongoose';


export type DrugData = Omit<IDrug, 'createdAt' | 'updatedAt' | 'dailyConsumption'>;

export const drugService = {

    async findAll():Promise<IDrugWithId[]> {
        await connectDB();
        const drugs = await Drug.find().lean();
        return drugs.map(d => ({...d, _id: d._id.toString()})) as IDrugWithId[];
    },

    async findById(drugid:string):Promise<IDrugWithId | null> {
        await connectDB();
        const drug = await Drug.findById(drugid).lean();
        if (!drug) return null;
        return { ...drug, _id: drug._id.toString() } as IDrugWithId;
    },

    async findByName(name:string):Promise<IDrugWithId | null> {
        await connectDB();
        const drug = await Drug.findOne({ name }).lean();
        if (!drug) return null;
        return { ...drug, _id: drug._id.toString() } as IDrugWithId;
    },

    async DeleteById(drugid:string):Promise<void> {
        await connectDB();
        await Drug.findByIdAndDelete(drugid).exec();
    },

    async create(drug:DrugData):Promise<IDrugWithId> {
        await connectDB();
        const { barcode } = drug;
        // Check if the drug already exists
        const existingDrug = await Drug.findOne({ barcode }).lean();
        if (existingDrug) {
            throw new Error('Drug already exists');
        }
        // Create a new drug instance
        const newDrug = new Drug(drug);
       const savedDrug = await newDrug.save();
        return { ...savedDrug.toObject(), _id: savedDrug._id.toString() };
    },

    async update(id: string, data: Partial<DrugData>): Promise<IDrugWithId | null> {
        await connectDB();
        const updatedDrug = await Drug.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!updatedDrug) {
            return null;
        }
        return { ...updatedDrug, _id: updatedDrug._id.toString() };
    }
}