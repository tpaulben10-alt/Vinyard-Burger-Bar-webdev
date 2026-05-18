const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

async function getOrderById(orderId) {
  const [orders] = await pool.execute(
    `SELECT o.id, o.user_id, o.total_amount, o.status, o.notes, o.created_at, o.updated_at,
            u.name AS customer_name, u.email AS customer_email
       FROM orders o
       JOIN users u ON u.id = o.user_id
      WHERE o.id = ?`,
    [orderId]
  );

  const order = orders[0];
  if (!order) return null;

  const [items] = await pool.execute(
    `SELECT oi.id, oi.menu_item_id, oi.quantity, oi.unit_price,
            mi.name, mi.description, mi.category, mi.image_url
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
      WHERE oi.order_id = ?`,
    [orderId]
  );

  return { ...order, items };
}

router.post('/', authMiddleware, async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const { items, notes } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'At least one item is required.' });
    }

    const ids = items.map((item) => Number(item.menu_item_id));
    const quantities = new Map(items.map((item) => [Number(item.menu_item_id), Number(item.quantity)]));

    if (ids.some((id) => !Number.isInteger(id)) || [...quantities.values()].some((qty) => !Number.isInteger(qty) || qty < 1)) {
      return res.status(400).json({ message: 'Invalid cart item or quantity.' });
    }

    const placeholders = ids.map(() => '?').join(',');
    const [menuItems] = await connection.execute(
      `SELECT id, price FROM menu_items WHERE is_available = TRUE AND id IN (${placeholders})`,
      ids
    );

    if (menuItems.length !== ids.length) {
      return res.status(400).json({ message: 'One or more menu items are unavailable.' });
    }

    const total = menuItems.reduce((sum, item) => sum + Number(item.price) * quantities.get(item.id), 0);

    await connection.beginTransaction();
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, notes) VALUES (?, ?, ?)',
      [req.user.id, total.toFixed(2), notes || null]
    );

    for (const item of menuItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.id, quantities.get(item.id), item.price]
      );
    }

    await connection.commit();

    const order = await getOrderById(orderResult.insertId);
    req.app.get('io')?.to('admins').emit('order:new', order);

    return res.status(201).json({ message: 'Order placed.', order });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
});

router.get('/my', authMiddleware, async (req, res, next) => {
  try {
    const [orders] = await pool.execute(
      `SELECT id FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC`,
      [req.user.id]
    );

    const fullOrders = await Promise.all(orders.map((order) => getOrderById(order.id)));
    return res.json({ orders: fullOrders });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
