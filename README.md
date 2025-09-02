# Invoice API (NestJS + TypeORM + Postgres)

A clean, production-minded REST API for invoices built with **NestJS**, **TypeORM**, and **PostgreSQL**. Includes Postman collection, environment, and one-click test flow.

---

## Tech Stack

* **Node / NestJS** (App structure, DI, validation)
* **TypeORM + Postgres** (entities, relations)
* **class-validator / class-transformer** (DTO validation)
* **dotenv** (environment config)

---

## Quick Start

### 0) Prerequisites

* Node 18+ (LTS recommended)
* Postgres 14+ (local or Docker)
* npm or pnpm

### 1) Clone & Install

```bash
# clone your repo
git clone <your-repo-url> invoice-api
cd invoice-api

# install deps
npm i
# or: pnpm i
```

### 2) Configure Environment

Create `.env` at the **project root**:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=invoice_api
NODE_ENV=development
```

> For production, set `NODE_ENV=production` and **disable** TypeORM `synchronize` in the data source (use migrations).

### 3) Start Postgres (Docker optional)

**Option A: Local Postgres** — ensure credentials match your `.env`.

**Option B: Docker Compose** — create `docker-compose.yml` and run:

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    container_name: invoice_api_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: invoice_api
    ports:
      - '5432:5432'
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```

```bash
docker compose up -d
```

### 4) Run the API

```bash
npm run start:dev
# API base: http://localhost:3000/api
```

### 5) Smoke Test (curl)

```bash
# Create a customer
curl -s -X POST http://localhost:3000/api/customers -H 'Content-Type: application/json' \
  -d '{"name":"KTM Traders","email":"billing@ktmtraders.com","city":"Kathmandu","country":"NP"}' | jq

# Create a product
curl -s -X POST http://localhost:3000/api/products -H 'Content-Type: application/json' \
  -d '{"name":"Design Hour","unitPrice":"25.00"}' | jq

# Create an invoice (replace IDs)
curl -s -X POST http://localhost:3000/api/invoices -H 'Content-Type: application/json' \
  -d '{
    "customerId":"<CUSTOMER_ID>",
    "items":[{"productId":"<PRODUCT_ID>","quantity":10,"unitPrice":"25.00","taxRatePct":"13.00","discountAmount":"0.00"}],
    "notes":"Thanks!"
  }' | jq
```

---

## Project Structure (key files)

```
src/
  app.module.ts
  main.ts
  common/
    filters/http-exception.filter.ts
    interceptors/logging.interceptor.ts
  config/typeorm.config.ts
  entities/
    customer.entity.ts
    product.entity.ts
    invoice.entity.ts
    invoice-item.entity.ts
  customers/
    customers.module.ts
    customers.controller.ts
    customers.service.ts
    dto/create-customer.dto.ts
  products/
    products.module.ts
    products.controller.ts
    products.service.ts
    dto/create-product.dto.ts
  invoices/
    invoices.module.ts
    invoices.controller.ts
    invoices.service.ts
    dto/create-invoice.dto.ts
```

---

## API Overview

### Customers

* `POST /api/customers` — create
* `GET  /api/customers` — list
* `GET  /api/customers/:id` — detail

### Products

* `POST /api/products` — create
* `GET  /api/products` — list
* `GET  /api/products/:id` — detail

### Invoices

* `POST   /api/invoices` — create (with line items)
* `GET    /api/invoices` — list
* `GET    /api/invoices/:id` — detail
* `PATCH  /api/invoices/:id/pay` — mark as PAID
* `PATCH  /api/invoices/:id/cancel` — mark as CANCELLED

**Totals** are computed server-side: `subtotal`, `taxTotal`, `discountTotal`, `grandTotal`.

> Money is stored as **DECIMAL** in DB and represented as **string** in JSON to avoid floating point drift.

---

## Postman — End‑to‑End Tests

You can use the ready-made collection and environment to test the API manually or via CLI.

### A) Import into Postman App

1. **Download** the files:

   * Collection: `NestJS_Invoice_API.postman_collection.json`
   * Environment: `NestJS_Invoice_API_Local.postman_environment.json`
2. In Postman, **Import** the collection file.
3. Import the environment file, select it in the top-right environment dropdown.
4. Ensure `baseUrl` is `http://localhost:3000/api` (default in the environment).

**Collection contents**

* **Customers**: Create, List, Get by ID
* **Products**: Create, List, Get by ID
* **Invoices**: Create, List, Get by ID, Pay, Cancel

**Auto‑captured variables**

* `customerId`, `productId`, `invoiceId`, `invoiceNumber` are captured via tests in the **Create** requests and saved as collection variables. This allows subsequent requests to reference `{{customerId}}`, `{{productId}}`, etc.

**Run order (click these in sequence)**

1. **Products → Create Product**
2. **Customers → Create Customer**
3. **Invoices → Create Invoice**
4. **Invoices → Mark Invoice as PAID** (optional)
5. **Invoices → Cancel Invoice** (optional)
6. **Invoices → Get Invoice by ID** / **List Invoices**

If a request fails, check the **Console** in Postman for details (e.g., DB connection, unique constraint, validation errors).

### B) Run Collection via CLI (Newman)

Install newman and run the collection headless—useful for CI.

```bash
npm i -g newman

# If you committed the files under ./postman/
newman run ./postman/NestJS_Invoice_API.postman_collection.json \
  -e ./postman/NestJS_Invoice_API_Local.postman_environment.json \
  --reporters cli

# Or point at absolute paths
newman run /absolute/path/NestJS_Invoice_API.postman_collection.json \
  -e /absolute/path/NestJS_Invoice_API_Local.postman_environment.json
```

> The collection tests assert status code 200/201 and store IDs to variables for subsequent calls.

---

## Error Handling & Validation

* Global `ValidationPipe` with `whitelist` + `forbidNonWhitelisted` ensures only DTO fields are accepted.
* Custom `HttpExceptionFilter` returns consistent JSON errors.
* Typical validation messages:

  * Missing `items` on invoice create → `400` with message "Invoice requires at least one item".
  * Unknown `customerId` or `productId` → `404`.

---

## Production Notes

* **Migrations**: Turn off `synchronize` and use TypeORM migrations in CI.
* **Invoice numbering**: Replace the naive counter with a Postgres sequence/transaction for concurrency.
* **Auth**: Add JWT + roles if multi-user.
* **Pagination & filtering**: Add query DTOs and DB indexes on `createdAt`, `status`, `customerId`.
* **Observability**: Replace console logs with pino/winston; add tracing later.

---

## Development Scripts

Common scripts you may add to `package.json`:

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "lint": "eslint .",
    "format": "prettier --write .",
    "postman": "newman run ./postman/NestJS_Invoice_API.postman_collection.json -e ./postman/NestJS_Invoice_API_Local.postman_environment.json"
  }
}
```

---

## Troubleshooting

* **ECONNREFUSED / DB auth errors**: Ensure Postgres is running and `.env` matches.
* **Unique constraint on customer email**: Use a different email during tests.
* **Totals look wrong**: Ensure `unitPrice`, `taxRatePct`, `discountAmount` are strings (DECIMAL) in JSON.
* **CORS**: Nest is created with `{ cors: true }` by default in `main.ts`. Adjust for your frontend origin if needed.

---

## License

MIT (or your choice)
