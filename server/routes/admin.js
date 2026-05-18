const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/roleMiddleware');

const router = express.Router();
const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

router.use(authMiddleware, requireAdmin);

async function getFullOrder(orderId) {
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
    `SELECT oi.id, oi.menu_item_id, oi.quantity, oi.unit_price, mi.name, mi.category
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
      WHERE oi.order_id = ?`,
    [orderId]
  );

  return { ...order, items };
}

router.get('/summary', async (req, res, next) => {
  try {
    const [[today]] = await pool.execute('SELECT COUNT(*) AS total FROM orders WHERE DATE(created_at) = CURDATE()');
    const [[pending]] = await pool.execute('SELECT COUNT(*) AS total FROM orders WHERE status = "pending"');
    const [[online]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE is_online = TRUE');
    const [[users]] = await pool.execute('SELECT COUNT(*) AS total FROM users');

    return res.json({
      summary: {
        totalOrdersToday: today.total,
        pendingOrders: pending.total,
        onlineCustomers: online.total,
        registeredUsers: users.total
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/orders', async (req, res, next) => {
  try {
    const [orders] = await pool.execute('SELECT id FROM orders ORDER BY created_at DESC');
    const fullOrders = await Promise.all(orders.map((order) => getFullOrder(order.id)));
    return res.json({ orders: fullOrders });
  } catch (error) {
    return next(error);
  }
});

router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!statuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    const order = await getFullOrder(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const io = req.app.get('io');
    io?.to(`user:${order.user_id}`).emit('order:status_update', order);
    io?.to('admins').emit('order:status_update', order);

    return res.json({ message: 'Order status updated.', order });
  } catch (error) {
    return next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, is_online, last_seen, created_at FROM users ORDER BY created_at DESC'
    );
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

router.get('/users/online', async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, last_seen FROM users WHERE is_online = TRUE ORDER BY last_seen DESC'
    );
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
