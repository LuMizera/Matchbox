import {
  Typegoose,
  prop as Property,
  arrayProp as ArrayProp,
  Ref,
} from 'typegoose';
import { Job as JobInterface } from '../interfaces/Job';
import { Candidate } from './Candidates';

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
  public candidates: Ref<Candidate>;

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

        job.isExpired = Date.now() > job.limitDate.valueOf();
      },
    },
  },
});
