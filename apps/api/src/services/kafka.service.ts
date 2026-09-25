import { JobProducer, TOPICS } from '@background-job/kafka';

// In a real app, brokers would come from env vars
export const kafkaProducer = new JobProducer('api-service', ['localhost:9092']);

export async function initKafka() {
  await kafkaProducer.connect();
  console.log('Connected to Kafka Producer');
}
