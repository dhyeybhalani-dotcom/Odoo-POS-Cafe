# Jor Shor POS System

Full-stack Point of Sale system — React + Node.js + MySQL

---

## Project Structure

```
jorshor-pos/
├── frontend/    # React + Vite
├── backend/     # Node.js + Express
└── database/    # SQL schema + seed
```

---

## Quick Start

### 1. Setup MySQL Database

```bash
mysql -u root -p -e "CREATE DATABASE jorshor_pos;"
mysql -u root -p jorshor_pos < backend/database/schema.sql
mysql -u root -p jorshor_pos < backend/database/seed.sql
```

### 2. Start Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev
# → Server: http://localhost:5000
```

### 3. Start Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# → App: http://localhost:5173
```

### 4. Login

```
URL:      http://localhost:5173
Email:    admin@jorshor.com
Password: admin123
```

---

## API Base URL

```
http://localhost:5000/api
```

All protected routes require:
```
Authorization: Bearer <token>
```

---

## Key Routes

| Path              | Description             |
|-------------------|-------------------------|
| /login            | Login page              |
| /pos              | POS Terminal + Floor    |
| /orders           | Orders / Payments / Customers |
| /products         | Product management      |
| /floor-plan       | Table management        |
| /kitchen          | Kitchen display         |
| /reporting        | Analytics dashboard     |
| /qr-pdf           | QR code generator       |
| /order?table=N    | Mobile ordering (public)|
| /customer-display | Customer-facing display |

---

## Tech Stack

**Frontend**: React 18, Vite, React Router v6, Axios, Recharts, qrcode.react

**Backend**: Node.js, Express, MySQL2, JWT, bcryptjs

**Database**: MySQL 8+
