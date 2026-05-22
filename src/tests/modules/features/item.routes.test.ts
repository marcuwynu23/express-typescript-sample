import express from 'express';
import request from 'supertest';
import { itemRoutes } from '../../../modules/features/item/item.routes';
import { itemService } from '../../../modules/features/item/item.service';

jest.mock('../../../modules/features/item/item.service');

describe('Item Routes', () => {
  let app: express.Application;

  const mockItem = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Item',
    description: 'A test item',
    quantity: 10,
    price: 29.99,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/items', itemRoutes);
    jest.clearAllMocks();
  });

  describe('GET /api/items', () => {
    it('returns all items with count', async () => {
      (itemService.findAll as jest.Mock).mockResolvedValue([mockItem]);

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([mockItem]);
      expect(response.body.count).toBe(1);
    });

    it('returns empty array when no items', async () => {
      (itemService.findAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('returns 500 on service error', async () => {
      (itemService.findAll as jest.Mock).mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch items');
    });
  });

  describe('GET /api/items/:id', () => {
    it('returns item when found', async () => {
      (itemService.findById as jest.Mock).mockResolvedValue(mockItem);

      const response = await request(app).get('/api/items/507f1f77bcf86cd799439011');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockItem);
    });

    it('returns 404 when item not found', async () => {
      (itemService.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/items/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });

    it('returns 500 on service error', async () => {
      (itemService.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/api/items/507f1f77bcf86cd799439011');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch item');
    });
  });

  describe('POST /api/items', () => {
    it('creates item and returns 201', async () => {
      (itemService.create as jest.Mock).mockResolvedValue(mockItem);

      const response = await request(app).post('/api/items').send({
        name: 'Test Item',
        description: 'A test item',
        quantity: 10,
        price: 29.99,
        isActive: true,
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockItem);
      expect(itemService.create).toHaveBeenCalledWith({
        name: 'Test Item',
        description: 'A test item',
        quantity: 10,
        price: 29.99,
        isActive: true,
      });
    });

    it('returns 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ description: 'No name', quantity: 5, price: 10 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name is required');
      expect(itemService.create).not.toHaveBeenCalled();
    });

    it('returns 500 on service error', async () => {
      (itemService.create as jest.Mock).mockRejectedValue(new Error('DB error'));

      const response = await request(app).post('/api/items').send({
        name: 'Test Item',
        quantity: 10,
        price: 29.99,
        isActive: true,
      });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to create item');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('updates and returns the item', async () => {
      const updatedItem = { ...mockItem, name: 'Updated Item' };
      (itemService.update as jest.Mock).mockResolvedValue(updatedItem);

      const response = await request(app)
        .put('/api/items/507f1f77bcf86cd799439011')
        .send({ name: 'Updated Item' });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(updatedItem);
    });

    it('returns 404 when item not found', async () => {
      (itemService.update as jest.Mock).mockResolvedValue(null);

      const response = await request(app).put('/api/items/nonexistent').send({ name: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });

    it('returns 500 on service error', async () => {
      (itemService.update as jest.Mock).mockRejectedValue(new Error('DB error'));

      const response = await request(app)
        .put('/api/items/507f1f77bcf86cd799439011')
        .send({ name: 'Updated' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to update item');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('deletes and returns the item with success message', async () => {
      (itemService.delete as jest.Mock).mockResolvedValue(mockItem);

      const response = await request(app).delete('/api/items/507f1f77bcf86cd799439011');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockItem);
      expect(response.body.message).toBe('Item deleted successfully');
    });

    it('returns 404 when item not found', async () => {
      (itemService.delete as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/api/items/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });

    it('returns 500 on service error', async () => {
      (itemService.delete as jest.Mock).mockRejectedValue(new Error('DB error'));

      const response = await request(app).delete('/api/items/507f1f77bcf86cd799439011');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to delete item');
    });
  });
});
