import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { JobMessage } from '@background-job/types';

export class JobConsumer {
  private consumer: Consumer;

  constructor(clientId: string, brokers: string[], groupId: string) {
    const kafka = new Kafka({
      clientId,
      brokers,
    });
    this.consumer = kafka.consumer({ groupId });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }

  async start(
    topic: string,
    handler: (message: JobMessage) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        if (!message.value) return;

        const jobMessage: JobMessage = JSON.parse(message.value.toString());
        await handler(jobMessage);
      },
    });
  }
}
