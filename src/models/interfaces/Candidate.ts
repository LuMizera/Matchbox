import { MongooseRequest } from './MongooseRequests';
import { Job } from './Job';

export interface Candidate extends MongooseRequest {
  name: string;
  password: string;
  email: string;
  cpf?: string;
  birthDate?: Date;
  graduation?: {
    institutionName?: string;
    courseName?: string;
    formationYear?: number;
  };
  newPassword?: string;
  jobs: MyJobs;
}

export interface MyJobs {
  expired: Job[];
  notExpired:  Job[];
}
