import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { errorHandler } from '../utils/errorHandler';
import { findOneCandidate } from '../repositories/candidateRepository';
import { authenticateCandidate } from '../repositories/authRepository';
import { OK } from 'http-status';

export const authenticate = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const candidateEmail = req.body.email;
    const candidatePassword = req.body.password;

    if (!candidateEmail || !candidatePassword) {
      return errorHandler(
        {
          name: 'MalformedBody',
          message: 'You need to send the correct Body with e-mail and password',
        },
        res,
      );
    }

    const myCandidate: any = await findOneCandidate(`email=${candidateEmail}`);

    const token = await authenticateCandidate(myCandidate, candidatePassword);

    return res.status(OK).json({ token });
  } catch (error) {
    return errorHandler(error, res);
  }
};
