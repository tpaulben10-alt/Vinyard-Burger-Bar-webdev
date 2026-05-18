const jwt = require('jsonwebtoken');
const pool = require('../db');

async function getOnlineUsers() {
  const [users] = await pool.execute(
    'SELECT id, name, email, role, last_seen FROM users WHERE is_online = TRUE ORDER BY last_seen DESC'
  );
  return users;
}

async function broadcastOnlineUsers(io) {
  io.to('admins').emit('admin:online_users', await getOnlineUsers());
}

function socketHandler(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next();
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      return next();
    } catch (error) {
      return next(new Error('Unauthorized socket connection.'));
    }
  });

  io.on('connection', async (socket) => {
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);

      if (socket.user.role === 'admin') {
        socket.join('admins');
      }

      await pool.execute('UPDATE users SET is_online = TRUE, last_seen = NOW() WHERE id = ?', [socket.user.id]);
      await broadcastOnlineUsers(io);
    }

    socket.on('user:online', async (userId) => {
      const id = socket.user?.id || Number(userId);
      if (!id) return;
      await pool.execute('UPDATE users SET is_online = TRUE, last_seen = NOW() WHERE id = ?', [id]);
      socket.join(`user:${id}`);
      await broadcastOnlineUsers(io);
    });

    socket.on('user:offline', async () => {
      if (!socket.user?.id) return;
      await pool.execute('UPDATE users SET is_online = FALSE, last_seen = NOW() WHERE id = ?', [socket.user.id]);
      await broadcastOnlineUsers(io);
    });

    socket.on('disconnect', async () => {
      if (!socket.user?.id) return;
      await pool.execute('UPDATE users SET is_online = FALSE, last_seen = NOW() WHERE id = ?', [socket.user.id]);
      await broadcastOnlineUsers(io);
    });
  });
}

module.exports = socketHandler;
