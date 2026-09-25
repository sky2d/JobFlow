import { Request, Response } from 'express';
import { prisma } from '@background-job/db';
import { JobMessage } from '@background-job/types';
import { TOPICS, TopicName } from '@background-job/kafka';
import { createJobSchema } from '../schemas/job.schema';
import { kafkaProducer } from '../services/kafka.service';
import { v4 as uuidv4 } from 'uuid';

export const createJob = async (req: Request, res: Response) => {
  try {
    // 1. Validate request
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }
    const { type, payload, correlationId } = parsed.data;

    // 2. Create job in PostgreSQL
    const job = await prisma.job.create({
      data: {
        type,
        payload,
        status: 'PENDING',
        correlationId: correlationId || uuidv4(),
      },
    });

    // 3. Publish Kafka message
    const jobMessage: JobMessage = {
      id: job.id,
      type: job.type,
      version: 1,
      createdAt: job.createdAt.toISOString(),
      attempt: 0,
      payload: job.payload,
      metadata: {
        source: 'api',
        correlationId: job.correlationId || job.id,
      },
    };

    const topicMap: Record<string, TopicName> = {
      'send-email': TOPICS.SEND_EMAIL,
      'process-image': TOPICS.PROCESS_IMAGE,
      'process-video': TOPICS.PROCESS_VIDEO,
      'generate-report': TOPICS.GENERATE_REPORT,
    };
    
    const topic = topicMap[type];
    if (!topic) {
        throw new Error(`No topic configured for job type: ${type}`);
    }

    await kafkaProducer.publishJob(topic, jobMessage);

    // 4. Return job ID
    return res.status(202).json({ id: job.id, status: job.status });
  } catch (error) {
    console.error('Failed to create job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.json({
      id: job.id,
      status: job.status,
      attempts: job.attempts,
      failedAt: job.failedAt,
      errorMessage: job.errorMessage,
    });
  } catch (error) {
    console.error('Failed to get job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
