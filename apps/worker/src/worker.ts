import { JobConsumer, TOPICS } from '@background-job/kafka';
import { jobRouter } from './processors/router';
import { RetryManager } from './retry/retry.manager';

async function bootstrap() {
  console.log('Starting Worker Service...');

  // 1. Initialize dependencies
  await RetryManager.init();

  // 2. Initialize Kafka Consumer
  // In a real app, brokers & clientId would come from env vars
  const consumer = new JobConsumer('worker-service', ['localhost:9092'], 'worker-group-1');
  await consumer.connect();

  console.log('Worker Service connected to Kafka');

  // 3. Register Job Handlers & start consuming
  await consumer.start(TOPICS.SEND_EMAIL, jobRouter);
  console.log(`Worker listening on topic: ${TOPICS.SEND_EMAIL}`);

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down Worker Service...');
    await consumer.disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Keep alive for testing
  setInterval(() => {
    // console.log('Worker heartbeat...');
  }, 10000);
}

bootstrap().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
