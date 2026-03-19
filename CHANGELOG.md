# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows `MAJOR.MINOR.PATCH`.

---

## [0.0.8] - 2026-03-19

### Changed

- Graceful shutdown now enforces a 10-second timeout; forces `process.exit(1)` if connections do not close in time
- `TradeOrderController` handlers typed with `Request<Params, ResBody, ReqBody>` generic — eliminates all `as` casts on `req.body` and `req.params`

### Fixed

- `GET /api/v1/trade_orders` now correctly rejects `limit` values above 100 with a 422 response

---

## [0.0.7] - 2026-03-18

### Changed

- `GET /api/v1/health` response now includes a `version` field sourced from `package.json`

---

## [0.0.6] - 2026-03-18

### Added
- `.github/workflows/ci-cd.yml` — GitHub Actions pipeline: `test` on every PR; `test → build-and-push → deploy` on push to `master`; image published to GHCR; deploy via SSH using `appleboy/ssh-action`

## [0.0.5] - 2026-03-17

### Changed

- `GET /api/v1/trade_orders` now returns a paginated response `{ data, meta }` instead of a plain array
- Default page size is 10, max is 100; query params: `?page=1&limit=10`
- Repository uses a Prisma `$transaction` to fetch records and total count in one round-trip

### Added

- `PaginationParams` and `PaginatedResult<T>` interfaces in domain types
- `paginationQuerySchema` Zod validator (coerces string query params, enforces `limit ≤ 100`)
- `validateQuery` middleware for query string validation
- Pagination tests covering empty state, defaults, sorting, multi-page, and invalid params

---

## [0.0.4] - 2026-03-17

### Added

- `GET /api/v1/trade_orders` endpoint — returns all orders sorted by `createdAt` descending
- `findAll` method added to `TradeOrderRepository` interface, `PrismaTradeOrderRepository`, `TradeOrderService`, and `TradeOrderController`
- Extracted `serialize` helper in `PrismaTradeOrderRepository` to avoid Decimal-to-string duplication
- Integration tests for `GET /api/v1/trade_orders`

---

## [0.0.3] - 2026-03-17

### Added

- `POST /api/v1/trade_orders` endpoint
- `TradeOrderRepository` domain interface
- `PrismaTradeOrderRepository` infrastructure implementation
- `TradeOrderService` application service
- `TradeOrderController` presentation layer
- `validate` middleware for Zod schema-based request body validation
- Integration tests for `POST /api/v1/trade_orders` covering happy path, defaults, uppercase normalization, and validation errors

---

## [0.0.2] - 2026-03-17

### Added

- `TradeOrder` Prisma model mapped to `trade_order` table
- `OrderSide`, `OrderType`, `OrderStatus` Prisma enums
- `TradeOrder`, `CreateTradeOrderDto`, `UpdateTradeOrderDto` TypeScript interfaces
- `createTradeOrderSchema` and `updateTradeOrderSchema` Zod validators with decimal precision rules

---

## [0.0.1] - 2026-03-17

### Added

- Project scaffolding with Node.js 22 + TypeScript 5
- Express 5 application with helmet, cors, compression, rate-limiting
- Prisma 6 ORM with PostgreSQL 17 datasource
- Zod-based environment variable validation
- Winston structured logger
- Centralized error handling middleware with `AppError` hierarchy
- 404 not-found middleware
- `GET /api/v1/health` endpoint with DB connectivity check
- Docker Compose setup for PostgreSQL 17
- Jest + Supertest test setup (unit + integration)
- ESLint flat config with TypeScript rules
- `.env.example`, `.gitignore`, `README.md`, `CHANGELOG.md`
