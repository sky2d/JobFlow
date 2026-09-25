# Kafka Configuration

Apache Kafka is used as the distributed event streaming platform.

## Concepts
- **Brokers**: The servers running Kafka.
- **Topics**: Logical channels (e.g., `jobs.send-email`).
- **Partitions**: Topics are divided into partitions for scalability and parallelism.
- **Consumer Groups**: Workers sharing a group ID split the partitions among themselves, ensuring each message is processed by exactly one worker in the group.
- **DLQ (Dead Letter Queue)**: A separate topic for messages that fail processing permanently.

## Usage in Project
- **Producer**: The Express API publishes to topics.
- **Consumer**: The Worker app subscribes using consumer groups (e.g., `send-email-worker`).
- **Retries**: Retries are handled by the worker logic or delayed topics (if configured).
- **Idempotency**: Kafka guarantees at-least-once delivery. Therefore, job handlers must be idempotent, checking the DB for job status before execution.
