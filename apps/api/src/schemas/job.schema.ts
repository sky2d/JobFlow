import { z } from 'zod';

export const createJobSchema = z.object({
  type: z.enum(['send-email', 'process-image', 'process-video', 'generate-report']),
  payload: z.any(),
  correlationId: z.string().optional(),
});
