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
import { listJobs, updateJob } from '../repositories/jobRepository';
import { CREATED, OK } from 'http-status';
import { errorHandler } from '../utils/errorHandler';
import { Job } from '../models/interfaces/Job';
import { populateCandidateJobs } from '../utils/populate';

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

    const formatedData = [];

    for (const item of data) {
      formatedData.push(await populateCandidateJobs(item.toJSON()));
    }

    return res.status(OK).json({ data: formatedData, count });
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

    const foundCandidate = await candidateByIdHandler(candidateId);

    const formatedData = await populateCandidateJobs(foundCandidate.toJSON());

    return res.status(OK).json(formatedData);
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

export const assignCandidate = async (
  req: ExpressRequest,
  res: ExpressResponse,
) => {
  try {
    const candidateId = req.params.id;

    const jobsId = req.body.jobs;

    if (!jobsId || !jobsId.length) {
      return errorHandler(
        {
          name: 'MalformedBody',
          message:
            'Incorrect body, see the documentation provided on \'Insomnia.json\'',
        },
        res,
      );
    }

    const cleanedJobList = jobsId.reduce(
      (accumulator: string[], actual: string) => {
        if (accumulator.find(item => item === actual)) return accumulator;
        return [...accumulator, actual];
      },
      [],
    );

    await candidateByIdHandler(candidateId);

    const alreadySigned: Job[] = [];
    const outOfSpace: Job[] = [];
    const expired: Job[] = [];
    const successfullyJoined: Job[] = [];

    const jobListMongoose = await listJobs(`_id=${cleanedJobList.join(',')}`);
    const jobList = jobListMongoose.map(job => job.toJSON());

    for (let job of jobList) {
      if (job.isExpired) {
        expired.push(job);
        continue;
      }
      if (job.qtyLeft === 0) {
        outOfSpace.push(job);
        continue;
      }
      if (
        job.candidates.find(
          (candidate: string) => candidate.toString() === candidateId,
        )
      ) {
        alreadySigned.push(job);
        continue;
      }
      job.candidates = [...job.candidates, candidateId];

      await updateJob(job._id, {
        candidates: job.candidates,
      } as Job);

      successfullyJoined.push(job);
    }

    return res.status(OK).json({
      success: successfullyJoined.map(jobMapper),
      errors: {
        expired: expired.map(jobMapper),
        alreadySigned: alreadySigned.map(jobMapper),
        outOfSpace: outOfSpace.map(jobMapper),
      },
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

const jobMapper = (job: Job): { title: string; _id: string } => {
  return { title: job.title, _id: job._id || '' };
};

const candidateByIdHandler = async (candidateId: string) => {
  if (!candidateId)
    throw {
      message: 'Candidate not found.',
      name: 'IdNotFound',
    };
  const foundCandidate = await findOneCandidate(`_id=${candidateId}`);

  if (foundCandidate.isDeleted) {
    throw { message: 'Candidate not found.', name: 'IdNotFound' };
  }

  return foundCandidate;
};
