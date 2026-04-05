# Database — Jor Shor POS

## Overview

This directory contains the SQL files for initializing and seeding the Jor Shor POS database.

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | PostgreSQL-compatible DDL (tables, indexes, constraints) |
| `schema_sqlite.sql` | SQLite-compatible DDL (used for local development) |
| `seed.sql` | PostgreSQL seed data (sample products, categories, admin user) |
| `seed_sqlite.sql` | SQLite seed data |

## Tables

- **users** — Admin/staff accounts with hashed passwords
- **categories** — Product categories (Food, Drink, Pastries, etc.)
- **products** — Menu items with price, tax, UOM, and category reference
- **orders** — Customer orders linked to tables and sessions
- **order_items** — Line items within each order
- **payments** — Payment records (Cash, Card, UPI)
- **customers** — Customer profiles with loyalty levels
- **tables** — Restaurant table definitions with status
- **floor_plans** — Floor layout configurations
- **sessions** — Cashier shift sessions with opening/closing balances
- **settings** — Application configuration key-value pairs

## Usage

The database is automatically initialized on server startup via `src/config/initDb.js`, which reads and executes the appropriate schema file based on the configured database driver.
