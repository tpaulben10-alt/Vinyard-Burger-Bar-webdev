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

3. Create or update tables:

   ```bash
   npm run db:migrate
   ```

4. Seed menu items:

   ```bash
   npm run db:seed
   ```

5. Start the app:

   ```bash
   npm start
   ```

Open `http://localhost:3000`.

## Aiven MySQL

Set these variables locally and on Render:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL=true`
- `JWT_SECRET`

For SSL, use one of these:

- `DB_CA_CERT_BASE64`: recommended for Render. Paste the base64-encoded Aiven CA certificate.
- `DB_CA_CERT`: paste the PEM certificate text, with newlines escaped as `\n`.
- `DB_CA_PATH`: local file path to a CA certificate.

If you leave all CA variables blank, the app still requests SSL with certificate verification enabled.

## Render Deploy

The included `render.yaml` is ready for a Render Web Service:

- Build command: `npm install`
- Pre-deploy command: `npm run db:migrate`
- Start command: `node server/index.js`

After creating the Render service, set all Aiven environment variables in the Render dashboard. Run `npm run db:seed` locally or from a Render shell once if you need to load the initial menu.

## Admin Account

Register a normal user first, then promote that account in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@vinyard.com';
```

Or insert an admin directly with a bcrypt-hashed password.

## Stock Management

Admin users can manage inventory at `/admin/menu.html`. Customer menu cards show available stock, disable sold-out items, and orders decrement stock inside the same database transaction that creates the order.
