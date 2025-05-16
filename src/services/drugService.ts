import Drug from '../models/Drug';
import { IDrug } from '@/types/Drug';
import { connectDB }from '@/lib/db';
import { Document } from 'mongoose';


export interface DrugData extends Omit<IDrug, keyof Document> {}

export const drugService = {

    async findAll():Promise<IDrug[]> {
        await connectDB();
        const drugs = await Drug.find().lean();
        return drugs as IDrug[];
    },

    async findById(drugid:string):Promise<IDrug | null> {
        await connectDB();
        const drug = await Drug.findById(drugid).select('name ExpiryDate').lean();
        return drug as IDrug | null;
    },

    async findByName(name:string):Promise<IDrug | null> {
        await connectDB();
        const drug = await Drug.findOne({ name }).lean();
        return drug as IDrug | null;
    },

    async DeleteById(drugid:string):Promise<void> {
        await connectDB();
        await Drug.findByIdAndDelete(drugid).exec();
    },

    async create(drug:any):Promise<IDrug> {
        await connectDB();
        const { barcode ,name,quantity,stripsPerBox,sample,expiryDate} = drug;
        // Check if the drug already exists
        const existingDrug = await Drug.findOne({ barcode }).lean();
        if (existingDrug) {
            throw new Error('Drug already exists');
        }
        // Create a new drug instance
        const newDrug = new Drug({
            barcode,
            name,
            quantity,
            stripsPerBox,
            sample : sample,
            expiryDate,
    });
       const savedDrug = await newDrug.save();
        return newDrug.toObject() as IDrug;
    },

}