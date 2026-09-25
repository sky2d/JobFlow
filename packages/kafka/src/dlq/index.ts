import { JobProducer } from '../producer';
import { JobMessage } from '@background-job/types';

export interface DLQMessage {
  originalMessage: JobMessage;
  error: {
    message: string;
    code?: string;
    stack?: string;
  };
  attempts: number;
  failedAt: string;
  originalTopic: string;
}

export class DLQProducer {
  constructor(private producer: JobProducer) {}

  async publishToDLQ(
    originalTopic: string,
    jobMessage: JobMessage,
    error: Error,
    attempts: number
  ): Promise<void> {
    const dlqTopic = `${originalTopic}.dlq`;
    
    const dlqMessage: DLQMessage = {
      originalMessage: jobMessage,
      error: {
        message: error.message,
        stack: error.stack,
      },
      attempts,
      failedAt: new Date().toISOString(),
      originalTopic,
    };

    // We can reuse the JobProducer by coercing the type here for the generic send,
    // or we can implement a specific send in JobProducer. For now we will cast the message to any.
    // A better approach in production is to add a generic `publish` method to JobProducer.
    await (this.producer as any).producer.send({
      topic: dlqTopic,
      messages: [
        {
          key: jobMessage.id,
          value: JSON.stringify(dlqMessage),
        },
      ],
    });
  }
}
