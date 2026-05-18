# Vinyard Burger Bar

Full-stack online ordering and POS system for a burger restaurant.

## Stack

- HTML, CSS, JavaScript frontend
- Node.js, Express backend
- MySQL via Aiven
- Socket.IO real-time order and online-user updates
- Render Web Service deployment

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Update `.env` with your Aiven MySQL credentials and a strong `JWT_SECRET`.

3. Create tables:

   ```bash
   mysql --host=$DB_HOST --port=$DB_PORT --user=$DB_USER --password=$DB_PASSWORD $DB_NAME < server/schema.sql
   ```

4. Seed menu items:

   ```bash
   mysql --host=$DB_HOST --port=$DB_PORT --user=$DB_USER --password=$DB_PASSWORD $DB_NAME < server/seed.sql
   ```

5. Start the app:

   ```bash
   npm start
   ```

Open `http://localhost:3000`.

## Admin Account

Register a normal user first, then promote that account in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@vinyard.com';
```

Or insert an admin directly with a bcrypt-hashed password.
