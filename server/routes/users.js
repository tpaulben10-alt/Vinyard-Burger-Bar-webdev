const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/me/seen', authMiddleware, async (req, res, next) => {
  try {
    await pool.execute('UPDATE users SET last_seen = NOW() WHERE id = ?', [req.user.id]);
    return res.json({ message: 'Activity updated.' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
