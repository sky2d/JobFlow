# Development Guide

## Setup
1. Clone the repository.
2. Install dependencies: `pnpm install`
3. Start infrastructure: `pnpm infra:up` (runs Kafka and Postgres).
4. Run migrations: `pnpm db:migrate` (once prisma is initialized).

## Starting Apps
- Dashboard: `pnpm dev:web` (Next.js at port 3000)
- API: `pnpm dev:api` (Express at port 4000)
- Worker: `pnpm dev:worker`

## Testing
- Send a job: `POST /api/jobs` with appropriate payload.
- Observe Kafka UI: `http://localhost:8080`.
- Check worker logs to see processing, retries, or DLQ publish.
