import { prisma } from '@background-job/db';
import { JobMessage } from '@background-job/types';

export async function sendEmailHandler(jobMessage: JobMessage): Promise<void> {
  const jobId = jobMessage.id;
  
  // 1. Idempotency Check
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new Error(`Job ${jobId} not found in database.`);
  }

  if (job.status === 'COMPLETED' || job.status === 'FAILED') {
    console.warn(`Job ${jobId} is already in a terminal state (${job.status}). Skipping.`);
    return; // Already processed
  }

  // 2. State Transition to PROCESSING
  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'PROCESSING' },
  });

  console.log(`Job ${jobId}: Processing SEND_EMAIL with payload`, jobMessage.payload);

  // 3. Execution (Simulate email sending)
  // Example: Randomly fail some jobs for testing retries
  if (Math.random() < 0.2) {
      throw new Error("Simulated network failure while sending email.");
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  console.log(`Job ${jobId}: Successfully sent email.`);

  // 4. State Transition to COMPLETED
  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'COMPLETED' },
  });
}
