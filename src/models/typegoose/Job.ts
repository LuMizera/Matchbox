import {
  Typegoose,
  prop as Property,
  arrayProp as ArrayProp,
  Ref,
  pre,
} from 'typegoose';
import { Job as JobInterface } from '../interfaces/Job';
import { Candidate } from './Candidates';


@pre<Job>('save', async function(next) {
  if (this.isDeleted && this.candidates.length > 0) {

    throw {message: 'Can\'t delete a job with assigned candidates', name: 'DeleteErrorCascade'};
  }
  next();
})
export class Job extends Typegoose {
  @Property({ required: true, trim: true })
  public title: string;

  @Property({ required: true, trim: true })
  public description: string;

  @Property({ required: true })
  public limitDate: Date;

  @Property({ required: true, min: 0 })
  public jobQty: number;

  @ArrayProp({ itemsRef: Candidate })
  public candidates: Ref<Candidate>[];

  @Property({ required: true, default: false })
  public isDeleted: boolean;
}

export const JobModel = new Job().getModelForClass(Job, {
  schemaOptions: {
    collection: 'jobs',
    timestamps: true,
    autoIndex: true,
    toJSON: {
      transform(doc: JobInterface, job: JobInterface) {
        delete job.__v;
        delete job.isDeleted;

        if (job.limitDate) job.isExpired = Date.now() > job.limitDate.valueOf();
        if (job.candidates) job.qtyLeft = job.jobQty - job.candidates.length;
      },
    },
  },
});
