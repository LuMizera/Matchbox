import { MongooseRequest } from './MongooseRequests';

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
}
