# CodeVector Backend API

A Node.js/TypeScript backend API for managing products with PostgreSQL database using Drizzle ORM.

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Running the Project](#running-the-project)
5. [API Endpoints](#api-endpoints)
6. [Product Categories](#product-categories)

---

## Setup Instructions

Follow these steps to set up and run the project:

### 1. Install Dependencies
```bash
npm install
```

This installs all required packages including:
- **express**: Web framework
- **drizzle-orm**: TypeScript ORM for PostgreSQL
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing
- **typescript**: Language support
- **ts-node-dev** & **tsx**: TypeScript development tools

### 2. Create Environment File
Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
PORT=3000
```

Replace `user`, `password`, `localhost`, `5432`, and `database_name` with your actual PostgreSQL credentials.

### 3. Generate Database Schema
```bash
npm run generate
```

This generates the migration files based on `src/db/schema.ts`.

### 4. Run Database Migrations
```bash
npm run migrate
```

This creates the `products` table in your PostgreSQL database.

### 5. (Optional) Seed Database
```bash
npm run seed
```

This populates your database with 200,000 sample products (in batches of 5,000).

### 6. Build the Project
```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 7. Start the Server
```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or your specified PORT).

---

## Environment Configuration

The project uses environment variables for configuration:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/mydb` |
| `PORT` | Server port | `3000` |

---

## Database Setup

### Prerequisites
- PostgreSQL installed and running
- A PostgreSQL database created

### Database Configuration

The database is configured in `drizzle.config.js`:
- **Dialect**: PostgreSQL
- **Schema**: `src/db/schema.ts`
- **Migrations**: `drizzle/` directory

### Product Table Schema

The `products` table has the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `id` | Serial (PK) | Auto-incrementing primary key |
| `name` | VARCHAR | Product name (required) |
| `category` | ENUM | Product category (required, defaults to "Other") |
| `price` | INTEGER | Product price in cents (required) |
| `created_at` | TIMESTAMP | Creation timestamp (auto-generated) |
| `updated_at` | TIMESTAMP | Last update timestamp (auto-updated) |

**Index**: `idx_products_created_id` on (`created_at`, `id`) for optimized pagination queries.

---

## Running the Project

### Development Mode
```bash
npm run dev
```
Starts the server with automatic restart on file changes.

### Production Mode
```bash
npm run build
npm start
```
First compile TypeScript, then run the compiled JavaScript.

### Database Studio (Drizzle)
```bash
npm run studio
```
Opens an interactive UI to view and manage your database.

---

## API Endpoints

### Base URL
```
http://localhost:3000/api/product
```

---

### 1. Create Product
**POST** `/api/product/create-product`

Creates a new product in the database.

#### Request Body
```json
{
  "name": "Product Name",
  "price": 9999,
  "category": "Electronics"
}
```

#### Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Product name |
| `price` | number | Yes | Price in cents (e.g., 9999 = $99.99) |
| `category` | string | Yes | Product category (see [Product Categories](#product-categories)) |

#### Response (Success - 201)
```json
{
  "statusCode": 201,
  "data": {
    "product": [
      {
        "id": 1,
        "name": "Product Name",
        "category": "Electronics",
        "price": 9999,
        "created_at": "2026-06-23T10:00:00.000Z",
        "updated_at": "2026-06-23T10:00:00.000Z"
      }
    ]
  },
  "message": "Product Created",
  "success": true
}
```

#### Response (Error - 404)
```json
{
  "statusCode": 404,
  "message": "Some fields are missing",
  "success": false
}
```

---

### 2. Update Product Price
**PATCH** `/api/product/update-product/:id`

Updates the price of an existing product.

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Product ID to update |

#### Request Body
```json
{
  "price": 15999
}
```

#### Request Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `price` | number | Yes | New price in cents |

#### Response (Success - 201)
```json
{
  "statusCode": 201,
  "message": "Product Updated",
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "category": "Electronics",
      "price": 15999,
      "created_at": "2026-06-23T10:00:00.000Z",
      "updated_at": "2026-06-23T11:30:00.000Z"
    }
  ],
  "success": true
}
```

#### Response (Error - 401)
```json
{
  "statusCode": 401,
  "message": "Id is missing",
  "success": false
}
```

#### Response (Error - 404)
```json
{
  "statusCode": 404,
  "message": "Product with this id does not exist",
  "success": false
}
```

---

### 3. Get Products (Cursor Pagination)
**GET** `/api/product/get-products`

Retrieves products using cursor-based pagination. Optimal for large datasets.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 20 | Number of products to return |
| `category` | string | null | Filter by category (optional) |
| `cursorCreatedAt` | ISO string | null | Cursor creation date for pagination |
| `cursorId` | number | null | Cursor product ID for pagination |

#### Example Request
```
GET /api/product/get-products?limit=10&category=Electronics
```

#### Response (Success - 201)
```json
{
  "statusCode": 201,
  "data": {
    "products": [
      {
        "id": 200000,
        "name": "Product-199999",
        "category": "Electronics",
        "price": 45678,
        "created_at": "2025-12-15T08:23:45.000Z",
        "updated_at": "2025-12-20T14:56:22.000Z"
      },
      {
        "id": 199999,
        "name": "Product-199998",
        "category": "Electronics",
        "price": 87234,
        "created_at": "2025-12-14T15:30:10.000Z",
        "updated_at": "2025-12-18T09:12:33.000Z"
      }
    ]
  },
  "success": true,
  "cursor": {
    "createdAt": "2025-12-14T15:30:10.000Z",
    "id": 199999
  }
}
```

#### Cursor Pagination Usage
1. Use the returned `cursor` values for the next request
2. Pass `cursorCreatedAt` and `cursorId` to get the next batch
3. Example next request:
```
GET /api/product/get-products?limit=10&cursorCreatedAt=2025-12-14T15:30:10.000Z&cursorId=199999
```

---

### 4. Get Products (Offset Pagination)
**GET** `/api/product/get-products-by-offset`

Retrieves products using offset-based pagination. Simpler but slower for large datasets.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-indexed) |
| `limit` | number | 20 | Number of products per page |
| `category` | string | null | Filter by category (optional) |

#### Example Request
```
GET /api/product/get-products-by-offset?page=2&limit=50&category=Books
```

#### Response (Success - 201)
```json
{
  "statusCode": 201,
  "data": {
    "products": [
      {
        "id": 200000,
        "name": "Product-199999",
        "category": "Books",
        "price": 2999,
        "created_at": "2025-11-20T12:45:30.000Z",
        "updated_at": "2025-11-22T16:20:15.000Z"
      }
    ]
  },
  "success": true,
  "previousPage": 1,
  "currentPage": 2,
  "nextPage": 3
}
```

#### Pagination Usage
- **Page 1**: `?page=1&limit=20`
- **Page 2**: `?page=2&limit=20`
- **Page 3**: `?page=3&limit=20`

---

## Product Categories

The following product categories are supported:

- `Electronics`
- `Books`
- `Clothing`
- `Sports`
- `Home`
- `Grocery`
- `Toys`
- `Beauty`
- `Other` (default)

---

## Common Issues

### Issue: Cannot POST /api/product/...
**Solution**: Ensure the server is restarted after changes to route files.

### Issue: Database connection fails
**Solution**: Verify your `DATABASE_URL` in the `.env` file and ensure PostgreSQL is running.

### Issue: Port already in use
**Solution**: Change the `PORT` in your `.env` file or kill the process using the port.

---

## Project Structure

```
Backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── index.ts               # Server entry point
│   ├── db-connection.ts       # Database connection
│   ├── seed.ts                # Database seeding script
│   ├── controller/
│   │   └── product.controller.ts  # Product request handlers
│   ├── db/
│   │   ├── index.ts           # Database client
│   │   └── schema.ts          # Table schemas
│   └── routes/
│       └── product.routes.ts  # Route definitions
├── drizzle/                   # Migration files (auto-generated)
├── dist/                      # Compiled JavaScript (generated)
├── .env                       # Environment variables (create manually)
├── drizzle.config.js          # Drizzle ORM configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

---

## Scripts Summary

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run seed` | Populate database with sample data |
| `npm run generate` | Generate migration files |
| `npm run migrate` | Run database migrations |
| `npm run push` | Push schema changes to database |
| `npm run studio` | Open Drizzle Studio UI |

---

## Technologies Used

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Dev Tools**: tsx, ts-node-dev

---

## License

ISC
