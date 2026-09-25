# Project TODO List

This document outlines the remaining tasks to transform the project foundation into a fully functional background job processing system.

## Phase 1: Infrastructure & Database
- [ ] Initialize Prisma (`pnpm db:generate` & `pnpm db:migrate`).
- [x] Create database connection helper in `packages/db`.
- [ ] Confirm Kafka is accessible from the Node apps via `kafkajs`.

## Phase 2: Kafka Abstractions (`packages/kafka`)
- [x] Implement `KafkaProducer` wrapper for publishing messages.
- [x] Implement `KafkaConsumer` wrapper to manage subscriptions and offsets.
- [x] Implement generic `DLQProducer` to forward dead-letter messages.
- [x] Define robust topic configuration (`jobs.send-email`, `jobs.send-email.dlq`).

## Phase 3: Express API
- [x] Connect Prisma client to `app.ts` or controllers.
- [x] Update `POST /api/jobs` to insert a `PENDING` job into Postgres.
- [x] Update `POST /api/jobs` to publish a `JobMessage` to Kafka.
- [x] Add input validation (e.g. Zod) for the incoming job requests.
- [x] Update `GET /api/jobs/:id` to fetch the real status from Postgres.

## Phase 4: Worker Service
- [x] Wire up `KafkaConsumer` to listen to relevant topics.
- [x] Build the `Message Deserializer` and `Job Router`.
- [x] Implement a sample job handler: `sendEmailHandler`.
  - Ensure the handler checks Postgres to prevent duplicate processing (Idempotency).
  - Update job status to `PROCESSING` when starting.
  - Update job status to `COMPLETED` when finished.
- [x] Implement the `RetryManager`:
  - Catch errors, update attempt count, and either retry or pass to DLQ.
  - Update Postgres status to `FAILED` if DLQ is reached.

## Phase 5: Dashboard (Next.js)
- [ ] Create a `/jobs` page to list all jobs by querying the Express API or DB.
- [ ] Create a `/jobs/[id]` page to show job details, attempts, and errors.
- [ ] Add a UI button to manually trigger a new job request.

## Phase 6: Polish
- [ ] Add structured logging using `packages/logger` across all services.
- [ ] Configure environment variables using `packages/config` (Zod validation).
- [ ] Write a test for job handler logic (mocking Kafka and Prisma).
