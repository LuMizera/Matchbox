import { Candidate } from '../models/interfaces/Candidate';
import { CandidateModel } from '../models/typegoose/Candidates';
import jwt from 'jsonwebtoken';

export const authenticateCandidate = async (
  candidate: Candidate,
  password: string,
) => {
  const passwordMatch = await CandidateModel.comparePassword(
    password,
    candidate.password,
  );
  if (!passwordMatch)
    throw { message: 'Password did not match', name: 'PasswordError' };

  return await jwt.sign(
    { _id: candidate._id, permission: candidate.permission },
    'key',
  );
};
