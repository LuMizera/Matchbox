import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { Candidate } from '../models/interfaces/Candidate';
import {
  createCandidate,
  listCandidates,
  countCandidates,
  updateCandidate,
  findOneCandidate,
} from '../repositories/candidateRepository';
import {
  CREATED,
  OK,
} from 'http-status';
import { errorHandler } from '../utils/errorHandler';

export const create = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const bodyData: Candidate = req.body;

    const myCandidate = await createCandidate(bodyData);

    return res.status(CREATED).json(myCandidate);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const list = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const queryString = req.query;

    const [data, count] = await Promise.all([
      listCandidates(queryString),
      countCandidates(queryString),
    ]);

    return res.status(OK).json({ data, count });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const update = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const body: Candidate = req.body;
    const candidateId = req.params.id;

    const updatedCandidate = await updateCandidate(candidateId, body);

    return res.status(OK).json(updatedCandidate);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const byId = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const candidateId = req.params.id;

    const foundCandidate = await findOneCandidate(`_id=${candidateId}`);

    if (foundCandidate.isDeleted) {
      throw { message: 'Candidate not found.', name: 'IdNotFound' };
    }

    return res.status(OK).json(foundCandidate);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const remove = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const candidateId = req.params.id;

    await updateCandidate(candidateId, { isDeleted: true } as Candidate);

    return res.status(OK).json({ message: 'Candidate deleted.' });
  } catch (error) {
    return errorHandler(error, res);
  }
};
