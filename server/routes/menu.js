const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [items] = await pool.execute(
      `SELECT id, name, description, price, category, image_url, is_available
         FROM menu_items
        WHERE is_available = TRUE
        ORDER BY FIELD(category, "burger", "pasta", "fries", "appetizer", "wedges", "rice_meal", "fried_chicken", "coffee", "frappe", "milk_shake", "beverages", "add_ons"), name`
    );

    return res.json({ items });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
