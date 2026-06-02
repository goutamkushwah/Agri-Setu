# Agri-Setu

Digital marketplace connecting farmers and customers for fresh produce.

## Setup (local)

1. **Backend**
   ```bash
   cd backend
   npm install
   copy .env.example .env
   ```
   Edit `backend/.env` with your database and secrets (never commit this file).

   ```bash
   npx knex migrate:latest
   npx knex seed:run
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open http://localhost:8080

## Security & GitHub

Before pushing to GitHub, read [SECURITY.md](SECURITY.md).

- Use a **private** repository
- Only commit `.env.example`, not `.env`
- Rotate secrets if they were ever exposed

## Roles

| Role     | Login use                          |
|----------|-------------------------------------|
| Customer | Shop, cart, checkout, `/dashboard` |
| Farmer   | Add products on `/farmer`            |
| Admin    | `/admin` — manage users, orders, chat |

Admin is created via seed (`ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`), not public signup.
