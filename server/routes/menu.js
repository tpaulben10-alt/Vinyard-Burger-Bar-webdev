const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/roleMiddleware');

const router = express.Router();
const categoryOrder = "'burger', 'pasta', 'fries', 'appetizer', 'wedges', 'rice_meal', 'fried_chicken', 'coffee', 'frappe', 'milk_shake', 'beverages', 'add_ons'";

router.get('/', async (req, res, next) => {
  try {
    const [items] = await pool.execute(
      `SELECT id, name, description, price, category, image_url, stock, is_available
         FROM menu_items
        WHERE is_available = TRUE
        ORDER BY FIELD(category, ${categoryOrder}), name`
    );

    return res.json({ items });
  } catch (error) {
    return next(error);
  }
});

router.post('/', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, price, category, image_url, stock } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required.' });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock || 0);

    if (Number.isNaN(numericPrice) || numericPrice < 0 || !Number.isInteger(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: 'Price and stock must be valid positive values.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO menu_items (name, description, price, category, image_url, stock, is_available)
       VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      [name.trim(), description || null, numericPrice.toFixed(2), category.trim(), image_url || null, numericStock]
    );

    const [items] = await pool.execute(
      'SELECT id, name, description, price, category, image_url, stock, is_available FROM menu_items WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({ message: 'Menu item added.', item: items[0] });
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const itemId = Number(req.params.id);
    const { name, description, price, category, image_url, stock } = req.body;

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({ message: 'Invalid menu item id.' });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!name || !category || Number.isNaN(numericPrice) || numericPrice < 0 || !Number.isInteger(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: 'Name, category, price, and stock are required.' });
    }

    const [result] = await pool.execute(
      `UPDATE menu_items
          SET name = ?, description = ?, price = ?, category = ?, image_url = ?, stock = ?
        WHERE id = ? AND is_available = TRUE`,
      [name.trim(), description || null, numericPrice.toFixed(2), category.trim(), image_url || null, numericStock, itemId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    const [items] = await pool.execute(
      'SELECT id, name, description, price, category, image_url, stock, is_available FROM menu_items WHERE id = ?',
      [itemId]
    );

    return res.json({ message: 'Menu item updated.', item: items[0] });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const itemId = Number(req.params.id);

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({ message: 'Invalid menu item id.' });
    }

    const [result] = await pool.execute('UPDATE menu_items SET is_available = FALSE WHERE id = ?', [itemId]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    return res.json({ message: 'Menu item deleted.' });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/stock', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const itemId = Number(req.params.id);
    const { stock, delta } = req.body;

    if (!Number.isInteger(itemId)) {
      return res.status(400).json({ message: 'Invalid menu item id.' });
    }

    if (delta !== undefined) {
      const numericDelta = Number(delta);
      if (!Number.isInteger(numericDelta)) {
        return res.status(400).json({ message: 'Stock adjustment must be a whole number.' });
      }

      await pool.execute(
        'UPDATE menu_items SET stock = GREATEST(stock + ?, 0) WHERE id = ? AND is_available = TRUE',
        [numericDelta, itemId]
      );
    } else {
      const numericStock = Number(stock);
      if (!Number.isInteger(numericStock) || numericStock < 0) {
        return res.status(400).json({ message: 'Stock must be a whole number of 0 or more.' });
      }

      await pool.execute('UPDATE menu_items SET stock = ? WHERE id = ? AND is_available = TRUE', [numericStock, itemId]);
    }

    const [items] = await pool.execute(
      'SELECT id, name, description, price, category, image_url, stock, is_available FROM menu_items WHERE id = ? AND is_available = TRUE',
      [itemId]
    );

    if (!items.length) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    return res.json({ message: 'Stock updated.', item: items[0] });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
