import mongoose, { type Document, Schema } from 'mongoose';

export interface IItem {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  isActive: boolean;
}

export interface IItemDocument extends IItem, Document {
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItemDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Item = mongoose.model<IItemDocument>('Item', itemSchema);
