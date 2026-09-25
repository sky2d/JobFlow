# Project Overview
Production-style background job processing system utilizing Next.js, Express, Kafka, and PostgreSQL in a pnpm monorepo.

# Architecture Rules
1. Never put business logic inside Kafka producer/consumer infrastructure.
2. The Kafka layer should remain generic.
3. Keep retry logic isolated inside the worker infrastructure.
4. Do not tightly couple Kafka code with business logic.
5. Prefer small composable modules.

# Directory Rules
- `apps/`: runnable services (web, api, worker)
- `packages/`: shared libraries (db, kafka, types, config, logger)
- `infrastructure/`: docker and external configs

# Kafka Rules
1. Never create business-specific Kafka logic inside generic infrastructure.
2. Assume at-least-once delivery.
3. Do not replace Kafka with another queue library.

# Worker Rules
1. Design handlers to be idempotent.
2. Keep job handlers independent.
3. Never swallow worker errors.

# Database Rules
1. Never directly access Prisma from Kafka infrastructure.
2. Only `db` package encapsulates prisma schemas and client.

# API Rules
1. API creates jobs in DB, publishes to Kafka, and returns Job ID.
2. Never expose internal errors or stack traces through public APIs.

# Error Handling Rules
1. Handle transient and permanent errors differently.
2. Avoid generic catch-alls that hide stack traces internally.

# Retry Rules
1. Never create infinite retry loops.
2. Configure max attempts per job type.

# DLQ Rules
1. Permanently failed messages go to a DLQ topic.
2. Include original message, error metadata, and attempts.

# Idempotency Rules
1. Every job must have a unique ID.
2. Worker must be able to skip already-completed jobs.

# TypeScript Rules
1. Use strict mode.
2. Keep shared types in `packages/types`.

# Testing Rules
1. Unit tests should not require a running Kafka cluster.

# Security Rules
1. Do not hardcode credentials.
2. Keep environment configuration centralized.

# Logging Rules
1. Use a structured logger with correlation IDs.

# What NOT To Do
1. Do not introduce new dependencies without justification.
2. Do not modify architecture without updating ARCHITECTURE.md.
3. Do not add Redis unless there is a documented architectural reason.

# How To Add A New Job
1. Add type in `packages/types`.
2. Add topic config in `packages/kafka/src/configuration`.
3. Register handler in `apps/worker/src/handlers`.

# How To Modify Kafka Infrastructure
Make generic changes in `packages/kafka` and ensure backward compatibility. Update KAFKA.md and ARCHITECTURE.md.

# Definition Of Done
Feature works, tests pass, no strict TS errors, and architecture documentation updated if relevant.
