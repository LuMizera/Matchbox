import { MongooseRequest } from './MongooseRequests';
import { Candidate } from '../interfaces/Candidate';

export interface Job extends MongooseRequest {
  title: string;
  description: string;
  limitDate: Date;
  jobQty: number;
  isExpired?: boolean;
  qtyLeft?: number;
  candidates: Candidate[];
}
