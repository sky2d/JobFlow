# Dead Letter Queue (DLQ)

## Purpose
When a job fails persistently (e.g., due to a bug, malformed payload, or permanent third-party outage), it is sent to the DLQ to prevent blocking the main queue or creating infinite retry loops.

## Message Structure
```json
{
  "originalMessage": { ... },
  "error": {
    "message": "Error details",
    "code": "ERR_CODE",
    "stack": "..."
  },
  "attempts": 3,
  "failedAt": "ISO_DATE",
  "originalTopic": "jobs.send-email"
}
```

## Replay
DLQ messages can be manually inspected using Kafka UI. A script or API endpoint can be built later to replay messages from the DLQ back to the original topic after the underlying issue is fixed.
