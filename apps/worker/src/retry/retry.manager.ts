import { prisma } from '@background-job/db';
import { DLQProducer, JobProducer } from '@background-job/kafka';
import { JobMessage } from '@background-job/types';

const jobProducer = new JobProducer('worker-service', ['localhost:9092']);
const dlqProducer = new DLQProducer(jobProducer);

export class RetryManager {
  private static MAX_RETRIES = 3;

  static async init() {
    await jobProducer.connect();
  }

  static async handleFailure(jobMessage: JobMessage, error: Error, dlqTopic: string): Promise<void> {
    console.error(`Job ${jobMessage.id} failed attempt ${jobMessage.attempt + 1}/${this.MAX_RETRIES}: ${error.message}`);
    
    const newAttempt = jobMessage.attempt + 1;

    if (newAttempt < this.MAX_RETRIES) {
      // Update attempts in DB
      await prisma.job.update({
        where: { id: jobMessage.id },
        data: { attempts: newAttempt },
      });
      // Throw the error so Kafka Consumer will retry processing this message
      throw error;
    } else {
      // Max retries exceeded, move to DLQ
      console.warn(`Job ${jobMessage.id} exceeded max retries. Moving to DLQ.`);
      
      await prisma.job.update({
        where: { id: jobMessage.id },
        data: { 
          status: 'FAILED', 
          attempts: newAttempt,
          errorMessage: error.message,
          failedAt: new Date()
        },
      });

      // Send to DLQ topic
      await dlqProducer.publishToDLQ(dlqTopic, jobMessage, error, newAttempt);
    }
  }

}
