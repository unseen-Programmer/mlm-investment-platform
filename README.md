# MLM Investment Platform

A complete MERN application for an MLM investment platform with JWT auth, investment plans, daily ROI generation, three-level referral income, dashboard aggregation, charts, and a recursive referral tree.

## Tech Stack

- Node.js, Express.js, MongoDB, Mongoose
- JWT authentication, bcryptjs
- node-cron for daily ROI
- React.js, Axios, Recharts, Vite

## Project Structure

```text
backend/
  config/db.js
  models/User.js
  models/Investment.js
  models/ROIHistory.js
  models/ReferralIncome.js
  controllers/
  middleware/
  routes/
  services/incomeService.js
  cron/roiCron.js
  app.js
  server.js
frontend/
  src/api/api.js
  src/pages/Dashboard.jsx
  src/components/
  src/App.jsx
  src/main.jsx
```

## Setup

1. Install MongoDB locally and make sure it is running on `mongodb://127.0.0.1:27017`.
2. Install dependencies from the project root:

```bash
npm install
```

3. Start backend and frontend together:

```bash
npm run dev
```

The API runs on `http://localhost:5000` and the React app runs on `http://localhost:5173`.

## Environment Variables

Backend: [backend/.env](backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mlm-investment
JWT_SECRET=mlm-local-dev-secret-please-change-in-production-2026
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ENABLE_CRON=true
```

Frontend: [frontend/.env](frontend/.env)

```env
VITE_API_URL=http://localhost:5000/api
```

Use a long random `JWT_SECRET` in production and restrict `FRONTEND_URL` to your deployed frontend origin.

## Business Rules

- Daily ROI is `1%` of active investment amount.
- ROI is generated only for `ACTIVE` investments.
- ROI generation is idempotent via a unique index on `investment + date`.
- Referral income is generated when an investment is created:
  - Level 1: `10%`
  - Level 2: `5%`
  - Level 3: `2%`
- Referral income records are unique per `fromUser + toUser + investment + level`.

## API Examples

Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"secret123\"}"
```

Register with referral:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Bob\",\"email\":\"bob@example.com\",\"password\":\"secret123\",\"referralCode\":\"MLMABC123\"}"
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"secret123\"}"
```

Create investment:

```bash
curl -X POST http://localhost:5000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d "{\"amount\":10000,\"plan\":\"Silver\"}"
```

Dashboard:

```bash
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Referral tree:

```bash
curl http://localhost:5000/api/referrals/tree \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Plans

- Silver: 180 days
- Gold: 240 days
- Platinum: 365 days

## Production Notes

- Set `NODE_ENV=production`.
- Use MongoDB Atlas or a managed MongoDB deployment.
- Rotate `JWT_SECRET` and keep it outside source control.
- Run the backend behind HTTPS and a reverse proxy.
- Keep cron enabled on only one backend instance, or move ROI generation to a dedicated worker.
