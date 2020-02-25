import { Response as ExpressResponse } from 'express';
import {
  CONFLICT,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from 'http-status';

export const errorHandler = (error: any, res: ExpressResponse) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    if (error.keyValue.email) {
      return res
        .status(CONFLICT)
        .json({ message: `Email ${error.keyValue.email} is already in use` });
    }
  }
  if (error.name === 'ValidationError') {
    const returnMessage: string[] = [];

    const errorsAsArray = Object.keys(error.errors);

    errorsAsArray.forEach((err: any) => {
      returnMessage.push(error.errors[err].message);
    });
    return res.status(BAD_REQUEST).json({ message: returnMessage });
  }
  if (error.name === 'IdNotFound') {
    return res.status(NOT_FOUND).json({ message: error.message });
  }
  if (error.name === 'PasswordError') {
    return res.status(BAD_REQUEST).json({ message: error.message });
  }
  if (error.name === 'ObjectConflict') {
    return res.status(CONFLICT).json({ message: error.message });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .json({ message: 'Unexpected Error' });
};
