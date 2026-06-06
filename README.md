# MLM Investment Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that simulates an MLM-based investment platform with secure authentication, investment management, automated ROI generation, multi-level referral income distribution, and a real-time analytics dashboard.

##  Live Demo

**Frontend:** https://mlm-investment-platform.vercel.app

**Backend API:** https://mlm-backend-duh2.onrender.com/api/health

##  Features

### Authentication

* Secure JWT-based authentication
* User registration and login
* Password hashing using bcryptjs
* Protected API routes

### Investment Management

* Create investment plans
* Multiple plan types:

  * Silver (180 Days)
  * Gold (240 Days)
  * Platinum (365 Days)
* Active investment tracking

### ROI System

* Automated daily ROI generation
* 1% daily return on active investments
* ROI history tracking
* Idempotent cron execution

### MLM Referral System

* Unique referral code generation
* Multi-level referral tree
* Automatic commission distribution

| Level   | Commission |
| ------- | ---------- |
| Level 1 | 10%        |
| Level 2 | 5%         |
| Level 3 | 2%         |

### Dashboard

* Total Investments
* Daily ROI Earnings
* Referral Income
* Wallet Balance
* Investment History
* ROI Analytics Chart
* Referral Tree Visualization

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Axios
* Recharts
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs
* node-cron
* Helmet
* Express Rate Limit

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

# 📂 Project Structure

```text
mlm-investment-platform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── cron/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.jsx
│   │
│   └── vite.config.js
│
└── README.md
```

##  Referral Workflow

```text
User A
│
├── User B (Level 1)
│   ├── User D (Level 2)
│   └── User E (Level 2)
│
└── User C (Level 1)
```

If User D invests ₹10,000:

* User B earns ₹1,000 (10%)
* User A earns ₹500 (5%)

##  Business Rules

### Daily ROI

```text
Daily ROI = Investment Amount × 1%
```

Example:

```text
₹10,000 Investment
Daily ROI = ₹100
```

### Referral Income

```text
Level 1 = 10%
Level 2 = 5%
Level 3 = 2%
```

### ROI Conditions

* Generated only for ACTIVE investments
* One ROI entry per day per investment
* Duplicate generation prevented

## ⚙️ Local Setup

### Clone Repository

```bash
git clone https://github.com/unseen-Programmer/mlm-investment-platform.git
cd mlm-investment-platform
```

### Install Dependencies

```bash
npm install
```

### Backend Environment

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
JWT_EXPIRES_IN=7d
ENABLE_CRON=true
```

### Frontend Environment

```env
VITE_API_URL=http://localhost:5000/api
```

### Run Development Server

```bash
npm run dev
```

Backend:
http://localhost:5000

Frontend:
http://localhost:5173

---

##  Security Features

* JWT Authentication
* Password Hashing (bcryptjs)
* Helmet Security Headers
* API Rate Limiting
* Protected Routes
* Environment Variable Management


---

