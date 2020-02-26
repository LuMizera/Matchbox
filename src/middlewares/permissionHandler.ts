import {
  Request as ReqExpress,
  Response as ResExpress,
  NextFunction,
} from 'express';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/errorHandler';
import { Token } from '../models/interfaces/Token';

export const permissionHandler = (
  req: ReqExpress,
  res: ResExpress,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      return errorHandler(
        { name: 'Unauthorized', message: 'Unauthorized' },
        res,
      );
    }
    const decodedToken = jwt.decode(
      req.headers.authorization.replace('Bearer ', ''),
    ) as Token;

    if (decodedToken.permission === 'admin') {
      next();
      return;
    }

    if (req.params.id !== decodedToken._id) {
      return errorHandler(
        { name: 'Unauthorized', message: 'Unauthorized' },
        res,
      );
    }

    next();
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const adminOnly = (
  req: ReqExpress,
  res: ResExpress,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      return errorHandler(
        { name: 'Unauthorized', message: 'Unauthorized' },
        res,
      );
    }
    const decodedToken = jwt.decode(
      req.headers.authorization.replace('Bearer ', ''),
    ) as Token;

    if (decodedToken.permission === 'admin') {
      next();
      return;
    }

    return errorHandler({ name: 'Unauthorized', message: 'Unauthorized' }, res);
  } catch (error) {
    return errorHandler(error, res);
  }
};
