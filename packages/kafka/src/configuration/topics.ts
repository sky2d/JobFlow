export const TOPICS = {
  SEND_EMAIL: 'jobs.send-email',
  SEND_EMAIL_DLQ: 'jobs.send-email.dlq',
  PROCESS_IMAGE: 'jobs.process-image',
  PROCESS_IMAGE_DLQ: 'jobs.process-image.dlq',
  PROCESS_VIDEO: 'jobs.process-video',
  PROCESS_VIDEO_DLQ: 'jobs.process-video.dlq',
  GENERATE_REPORT: 'jobs.generate-report',
  GENERATE_REPORT_DLQ: 'jobs.generate-report.dlq',
} as const;

export type TopicName = typeof TOPICS[keyof typeof TOPICS];
