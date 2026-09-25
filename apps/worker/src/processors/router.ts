import { JobMessage } from '@background-job/types';
import { TOPICS } from '@background-job/kafka';
import { sendEmailHandler } from '../handlers/send-email.handler';
import { RetryManager } from '../retry/retry.manager';

export const jobRouter = async (message: JobMessage): Promise<void> => {
  try {
    switch (message.type) {
      case 'send-email':
        await sendEmailHandler(message);
        break;
      // Add other handlers here as they are developed
      case 'process-image':
      case 'process-video':
      case 'generate-report':
        console.warn(`Handler for job type ${message.type} is not yet implemented.`);
        break;
      default:
        console.warn(`Unknown job type received: ${message.type}`);
    }
  } catch (error) {
    // Route errors to the RetryManager
    const dlqTopic = `${TOPICS.SEND_EMAIL}.dlq`; // Adjust dynamically if multiple topics/handlers are added later
    await RetryManager.handleFailure(message, error as Error, dlqTopic);
  }
};
