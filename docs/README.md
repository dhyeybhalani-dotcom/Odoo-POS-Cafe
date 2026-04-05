# Jor Shor — Project Documentation

## Architecture Overview

Jor Shor is a full-stack restaurant POS (Point of Sale) system built with:

- **Frontend**: React 18 + Vite, styled with vanilla CSS
- **Backend**: Node.js + Express, SQLite database
- **Deployment**: Google Cloud Build + Cloud Run (via `cloudbuild.yaml`)

## Directory Structure

```
Jor Shor/
├── backend/           # Express API server
│   ├── src/
│   │   ├── config/        # Database connection & initialization
│   │   ├── controllers/   # Route handlers (auth, orders, products, etc.)
│   │   ├── middleware/     # Auth, error handling, validation
│   │   ├── models/        # Data access layer (SQLite queries)
│   │   ├── routes/        # Express route definitions
│   │   ├── services/      # Business logic (analytics, payments, kitchen)
│   │   └── utils/         # Constants, helpers, response formatters
│   └── database/          # SQL schema & seed files
│
├── frontend/          # React SPA
│   ├── src/
│   │   ├── api/           # Axios API client & barrel exports
│   │   ├── components/    # Reusable UI components (auth, charts, common, pos)
│   │   ├── context/       # React contexts (Auth, Toast, Session)
│   │   ├── hooks/         # Custom hooks (useApi, useCart)
│   │   ├── pages/         # Route-level page components
│   │   │   ├── auth/          # Login, Signup
│   │   │   ├── backoffice/    # Orders, Products, Reporting
│   │   │   ├── customer/      # Customer Display, QR PDF
│   │   │   ├── kds/           # Kitchen Display System
│   │   │   └── pos/           # POS terminal, Floor Plan, Mobile Order
│   │   ├── styles/        # Global CSS (App.css, index.css)
│   │   └── utils/         # Shared utility functions
│   └── public/            # Static assets (logo, icons, favicon)
│
├── docs/              # This folder — architecture & API documentation
├── cloudbuild.yaml    # Google Cloud Build pipeline config
└── README.md          # Project overview
```

## Key Modules

| Module | Purpose |
|--------|---------|
| **POS Terminal** | Table selection → product ordering → payment flow |
| **Kitchen Display (KDS)** | Real-time order status board for kitchen staff |
| **Customer Display** | Customer-facing screen showing order + promotions |
| **Backoffice** | Product/category management, order history, reporting |
| **Mobile Ordering** | QR-code-based ordering for customers |

## API Base URL

All frontend API calls go through the Axios client at `frontend/src/api/api.js`, which targets:
- Development: `http://localhost:5001/api`
- Production: Configured via `VITE_API_URL` environment variable
