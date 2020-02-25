import { Candidate } from '../models/interfaces/Candidate';
import { CandidateModel } from '../models/typegoose/Candidates';
// @ts-ignore
import aqp from 'api-query-params';
import updateDocument from '../utils/updateDocument';

export const createCandidate = async (candidate: Candidate) => {
  const encriptPassword = await CandidateModel.encriptPasswordFunc(
    candidate.password,
  );

  const createdCandidate = new CandidateModel({
    ...candidate,
    password: encriptPassword,
    isDeleted: false,
  });

  await createdCandidate.save();

  return createdCandidate;
};

export const listCandidates = async (queryString: string) => {
  const {
    filter,
    skip = 0,
    limit = 10,
    sort = { createdAt: -1 },
    projection,
  } = aqp(queryString);

  const candidates = await CandidateModel.find({
    ...filter,
    isDeleted: false,
  })
    .sort(sort)
    .select(projection)
    .skip(skip)
    .limit(limit);

  return candidates;
};

export const countCandidates = async (queryString: string) => {
  const { filter } = aqp(queryString);

  const candidatesCount: number = await CandidateModel.countDocuments({
    ...filter,
    isDeleted: false,
  });

  return candidatesCount;
};

export const findOneCandidate = async (queryString: any) => {
  const { filter, projection } = aqp(queryString);

  const candidate = await CandidateModel.findOne(filter).select(projection);

  if (!candidate) {
    throw { message: 'Candidate not found.', name: 'IdNotFound' };
  }

  return candidate;
};

export const updateCandidate = async (
  candidateId: string,
  candidateBody: Candidate,
) => {
  const actualCandidate = await findOneCandidate(`_id=${candidateId}`);

  if (actualCandidate.isDeleted) {
    throw { message: 'Candidate not found.', name: 'IdNotFound' };
  }

  if (candidateBody.newPassword) {
    const passwordMatch = await CandidateModel.comparePassword(
      candidateBody.password,
      actualCandidate.password,
    );
    if (!passwordMatch)
      throw { message: 'Password did not match', name: 'PasswordError' };

    candidateBody.password = await CandidateModel.encriptPasswordFunc(
      candidateBody.newPassword,
    );
  } else {
    delete candidateBody.password;
  }

  const updatedCandidate = updateDocument(actualCandidate, candidateBody);

  await updatedCandidate.save();

  return updatedCandidate;
};
