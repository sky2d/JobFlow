import { Kafka, Producer } from 'kafkajs';
import { JobMessage } from '@background-job/types';

export class JobProducer {
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    const kafka = new Kafka({
      clientId,
      brokers,
    });
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async publishJob(topic: string, jobMessage: JobMessage): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key: jobMessage.id,
          value: JSON.stringify(jobMessage),
        },
      ],
    });
  }
}
