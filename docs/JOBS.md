# Jobs Documentation

## JobMessage
The shared format across the system:
```json
{
  "id": "uuid",
  "type": "SEND_EMAIL",
  "version": 1,
  "createdAt": "ISO_DATE",
  "attempt": 0,
  "payload": {},
  "metadata": {
    "source": "api",
    "correlationId": "uuid"
  }
}
```

## Lifecycle
1. `PENDING`: Initial state in DB.
2. `PROCESSING`: Picked up by worker.
3. `COMPLETED`: Finished successfully.
4. `FAILED`: Failed but will be retried.
5. `DLQ`: Failed permanently.

## Adding a New Job Type (`PROCESS_VIDEO`)
1. Add `PROCESS_VIDEO` to `JobType` enum in `packages/types`.
2. Define `TopicConfig` for `jobs.process-video` in `packages/kafka`.
3. Create `processVideoHandler` in `apps/worker/src/handlers`.
4. Register the handler in the worker's Job Router.
