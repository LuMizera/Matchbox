import { MongooseRequest } from './MongooseRequests';

export interface Job extends MongooseRequest {
  title: string;
  description: string;
  limitDate: Date;
  jobQty: number;
  isExpired?: boolean;
}
