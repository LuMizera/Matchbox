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
  CONFLICT,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  NOT_FOUND,
} from 'http-status';

export const create = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const bodyData: Candidate = req.body;

    const myCandidate = await createCandidate(bodyData);

    return res.status(CREATED).json(myCandidate);
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      const errors = [];
      if (error.keyValue.email) {
        errors.push(`Email ${error.keyValue.email} is already in use`);
      }
      if (error.keyValue.cpf) {
        errors.push(`CPF ${error.keyValue.cpf} is already in use`);
      }
      return res.status(CONFLICT).json({
        message: errors,
      });
    }
    if (error.name === 'ValidationError') {
      const returnMessage: string[] = [];

      const errorsAsArray = Object.keys(error.errors);

      errorsAsArray.forEach((err: any) => {
        returnMessage.push(error.errors[err].message);
      });
      return res.status(BAD_REQUEST).json({ message: returnMessage });
    }
    console.log('error', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Unexpected Error' });
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
    console.log('error', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Unexpected Error' });
  }
};

export const update = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const body = req.body;
    const candidateId = req.params.id;

    const updatedCandidate = await updateCandidate(candidateId, body);

    return res.status(OK).json(updatedCandidate);
  } catch (error) {
    if (error.name === 'IdNotFound') {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    if (error.name === 'PasswordError') {
      return res.status(BAD_REQUEST).json({ message: error.message });
    }
    console.log('error', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Unexpected Error' });
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
    if (error.name === 'IdNotFound') {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    console.log('error', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Unexpected Error' });
  }
};

export const remove = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const candidateId = req.params.id;

    await updateCandidate(candidateId, { isDeleted: true } as Candidate);

    return res.status(OK).json({ message: 'Candidate deleted.' });
  } catch (error) {
    if (error.name === 'IdNotFound') {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    if (error.name === 'PasswordError') {
      return res.status(BAD_REQUEST).json({ message: error.message });
    }
    console.log('error', error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Unexpected Error' });
  }
};
