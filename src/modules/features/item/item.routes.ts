import { type Request, type Response, Router } from 'express';
import { itemService } from './item.service';

const router = Router();

// GET /api/items - List all items
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await itemService.findAll();
    res.json({ data: items, count: items.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /api/items/:id - Get item by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await itemService.findById(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ data: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /api/items - Create a new item
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, quantity, price, isActive } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const item = await itemService.create({
      name,
      description,
      quantity,
      price,
      isActive,
    });
    res.status(201).json({ data: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /api/items/:id - Update an item
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, quantity, price, isActive } = req.body;
    const item = await itemService.update(req.params.id, {
      name,
      description,
      quantity,
      price,
      isActive,
    });

    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ data: item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/items/:id - Delete an item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const item = await itemService.delete(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ data: item, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export { router as itemRoutes };
