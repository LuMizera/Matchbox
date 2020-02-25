import { Candidate } from '../models/interfaces/Candidate';
import { listJobs } from '../repositories/jobRepository';
import { MyJobs } from '../models/interfaces/Candidate';
import { Job } from '../models/interfaces/Job';

export const populateCandidateJobs = async (candidate: Candidate) => {
  const jobListMongoose = await listJobs(
    `candidates=${candidate._id}&fields=title,_id,limitDate`,
  );
  const jobList: Job[] = jobListMongoose.map(item => item.toJSON());

  const toAdd: MyJobs = {
    expired: [],
    notExpired: [],
  };

  for (const job of jobList) {
    if (job.isExpired) toAdd.expired.push(jobMapper(job) as Job);
    else toAdd.notExpired.push(jobMapper(job) as Job);
  }

  Object.assign(candidate, {
    jobs: toAdd,
  });

  return candidate;
};

const jobMapper = (job: Job) => {
  return {title: job.title, _id: job._id};
};
