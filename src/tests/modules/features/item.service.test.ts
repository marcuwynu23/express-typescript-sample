import { Item } from '../../../modules/features/item/item.model';
import { ItemService } from '../../../modules/features/item/item.service';

jest.mock('../../../modules/features/item/item.model');

describe('ItemService', () => {
  const service = new ItemService();

  const mockItem = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Item',
    description: 'A test item',
    quantity: 10,
    price: 29.99,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns all items sorted by createdAt descending', async () => {
      const mockSort = jest.fn().mockResolvedValue([mockItem]);
      (Item.find as jest.Mock).mockReturnValue({ sort: mockSort });

      const result = await service.findAll();

      expect(Item.find).toHaveBeenCalledWith({});
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual([mockItem]);
    });

    it('passes filter to find', async () => {
      const mockSort = jest.fn().mockResolvedValue([]);
      (Item.find as jest.Mock).mockReturnValue({ sort: mockSort });

      await service.findAll({ isActive: true });

      expect(Item.find).toHaveBeenCalledWith({ isActive: true });
    });

    it('returns empty array when no items exist', async () => {
      const mockSort = jest.fn().mockResolvedValue([]);
      (Item.find as jest.Mock).mockReturnValue({ sort: mockSort });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('returns item when found', async () => {
      (Item.findById as jest.Mock).mockResolvedValue(mockItem);

      const result = await service.findById('507f1f77bcf86cd799439011');

      expect(Item.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockItem);
    });

    it('returns null when item not found', async () => {
      (Item.findById as jest.Mock).mockResolvedValue(null);

      const result = await service.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('creates and returns a new item', async () => {
      (Item.create as jest.Mock).mockResolvedValue(mockItem);

      const data = {
        name: 'Test Item',
        description: 'A test item',
        quantity: 10,
        price: 29.99,
        isActive: true,
      };

      const result = await service.create(data);

      expect(Item.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockItem);
    });
  });

  describe('update', () => {
    it('updates and returns the item', async () => {
      const updatedItem = { ...mockItem, name: 'Updated Item' };
      (Item.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedItem);

      const result = await service.update('507f1f77bcf86cd799439011', {
        name: 'Updated Item',
      });

      expect(Item.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { name: 'Updated Item' },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedItem);
    });

    it('returns null when item not found', async () => {
      (Item.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await service.update('nonexistent', { name: 'Updated' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('deletes and returns the item', async () => {
      (Item.findByIdAndDelete as jest.Mock).mockResolvedValue(mockItem);

      const result = await service.delete('507f1f77bcf86cd799439011');

      expect(Item.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockItem);
    });

    it('returns null when item not found', async () => {
      (Item.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await service.delete('nonexistent');

      expect(result).toBeNull();
    });
  });
});
