import { type IItem, type IItemDocument, Item } from './item.model';

export class ItemService {
  async findAll(filter: Partial<IItem> = {}): Promise<IItemDocument[]> {
    return Item.find(filter).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IItemDocument | null> {
    return Item.findById(id);
  }

  async create(data: IItem): Promise<IItemDocument> {
    return Item.create(data);
  }

  async update(id: string, data: Partial<IItem>): Promise<IItemDocument | null> {
    return Item.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<IItemDocument | null> {
    return Item.findByIdAndDelete(id);
  }
}

export const itemService = new ItemService();
