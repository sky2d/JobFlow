# Background Job Monorepo

## Description
A production-style background job processing system architecture using Kafka, Node.js, and PostgreSQL.

## Tech Stack
- Frontend: Next.js, TypeScript
- Backend: Express, Node.js, TypeScript
- Messaging: Apache Kafka
- Database: PostgreSQL, Prisma
- Infrastructure: Docker Compose
- Package Manager: pnpm workspaces

## Architecture Overview
The system consists of:
- **Next.js Web App**: UI for job submission and monitoring.
- **Express API**: REST API that validates requests and publishes jobs to Kafka.
- **Workers**: Consumers that read jobs from Kafka topics and process them.
- **PostgreSQL**: Stores job state, metadata, and history.

## Prerequisites
- Node.js (v18+)
- pnpm
- Docker and Docker Compose

## Installation
```sh
pnpm install
```

## Infrastructure Setup
```sh
pnpm infra:up
```

## Database Setup
```sh
pnpm db:migrate
pnpm db:generate
```

## Development Commands
- `pnpm dev`: Start all apps locally
- `pnpm dev:web`: Start Next.js dashboard
- `pnpm dev:api`: Start Express API
- `pnpm dev:worker`: Start job workers

## Kafka UI
Available at `http://localhost:8080` (when infrastructure is running).

## Example Job Flow
1. Client makes POST `/api/jobs` request.
2. API creates a "PENDING" job in Postgres.
3. API publishes `SEND_EMAIL` message to `jobs.send-email` topic.
4. Worker consumes message, processes it, and updates Postgres to "COMPLETED".
5. On failure, Worker retries. If retries are exhausted, message goes to DLQ topic and Postgres status becomes "FAILED".
