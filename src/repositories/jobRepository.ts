import { Job } from '../models/interfaces/Job';
import { JobModel } from '../models/typegoose/Job';
// @ts-ignore
import aqp from 'api-query-params';
import updateDocument from '../utils/updateDocument';

export const createJob = async (job: Job) => {
  const createdJob = new JobModel({
    ...job,
    isDeleted: false,
    candidates: [],
  });

  await createdJob.save();

  return createdJob;
};

export const listJobs = async (queryString: string) => {
  const {
    filter,
    skip = 0,
    limit = 10,
    sort = { createdAt: -1 },
    projection,
    population
  } = aqp(queryString);

  const jobs = await JobModel.find({
    ...filter,
    isDeleted: false,
  })
    .sort(sort)
    .select(projection)
    .skip(skip)
    .limit(limit)
    .populate(population);

  return jobs;
};

export const countJobs = async (queryString: string) => {
  const { filter } = aqp(queryString);

  const jobsCount: number = await JobModel.countDocuments({
    ...filter,
    isDeleted: false,
  });

  return jobsCount;
};


export const findOneJob = async (queryString: any) => {
  const { filter, projection } = aqp(queryString);

  const job = await JobModel.findOne(filter).select(projection);

  if (!job) {
    throw { message: 'Job not found.', name: 'IdNotFound' };
  }

  return job;
};

export const updateJob = async (
  jobId: string,
  jobBody: Job,
) => {
  const actualJob = await findOneJob(`_id=${jobId}`);

  if (actualJob.isDeleted) {
    throw { message: 'Job not found.', name: 'IdNotFound' };
  }

  const updatedJob = updateDocument(actualJob, jobBody);

  await updatedJob.save();

  return updatedJob;
};
