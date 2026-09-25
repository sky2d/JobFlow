export interface JobMessage {
  id: string;
  type: string;
  version: number;
  createdAt: string;
  attempt: number;
  payload: any;
  metadata: {
    source: string;
    correlationId: string;
  };
}
