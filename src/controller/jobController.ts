import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { Job } from '../models/interfaces/Job';
import { createJob, countJobs, listJobs, updateJob, findOneJob } from '../repositories/jobRepository';
import { CREATED, OK } from 'http-status';
import { errorHandler } from '../utils/errorHandler';

export const create = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const bodyData: Job = req.body;

    const myJob = await createJob(bodyData);

    return res.status(CREATED).json(myJob);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const list = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const queryString = req.query;

    const [data, count] = await Promise.all([
      listJobs(queryString),
      countJobs(queryString),
    ]);

    return res.status(OK).json({ data, count });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const update = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const body: Job = req.body;
    const jobId = req.params.id;

    const updatedJob = await updateJob(jobId, body);

    return res.status(OK).json(updatedJob);
  } catch (error) {
    return errorHandler(error, res);
  }
};



export const byId = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const jobId = req.params.id;

    const foundJob = await findOneJob(`_id=${jobId}`);

    if (foundJob.isDeleted) {
      throw { message: 'Job not found.', name: 'IdNotFound' };
    }

    return res.status(OK).json(foundJob);
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const remove = async (req: ExpressRequest, res: ExpressResponse) => {
  try {
    const jobId = req.params.id;

    await updateJob(jobId, { isDeleted: true } as Job);

    return res.status(OK).json({ message: 'Job deleted.' });
  } catch (error) {
    return errorHandler(error, res);
  }
};
