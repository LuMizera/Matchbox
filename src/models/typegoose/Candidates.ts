import {
  Typegoose,
  prop as Property,
  staticMethod as StaticMethod,
  ModelType,
  pre,
} from 'typegoose';
import { Candidate as CandidateInterface } from '../interfaces/Candidate';
import { emailValidator, cpfValidator } from '../../utils/mongooseValidators';
import bcrypt from 'bcrypt';

class Graduation {
  @Property({ required: false })
  public institutionName: string;

  @Property({ required: false })
  public courseName: string;

  @Property({ required: false })
  public formationYear: number;
}

@pre<Candidate>('save', async function(next) {
  if (this.cpf) {
    const isCPFinUse = await CandidateModel.isCPFinUse(this.cpf, this._id);

    if (isCPFinUse)
      throw {
        message: `CPF ${this.cpf} already in use`,
        name: 'ObjectConflict',
      };

    this.cpf = this.cpf.replace(/[^0-9]/g, '');
  }

  if (this.isDeleted) {
    //@ts-ignore
    const attachedJobs = await this.model('Job').find({
      candidates: { $in: [this._id] },
    });

    for (let job of attachedJobs) {
      const index = job.candidates.findIndex(
        (item: string) => item.toString() === this._id.toString(),
      );

      job.candidates.splice(index, 1);

      await job.save();
    }
  }
  next();
})
export class Candidate extends Typegoose {
  @StaticMethod
  public static async encriptPasswordFunc(
    this: ModelType<Candidate> & typeof Candidate,
    password: string,
  ) {
    const encriptPassword = await bcrypt.hashSync(
      password,
      await bcrypt.genSaltSync(),
    );

    return encriptPassword;
  }

  @StaticMethod
  public static async comparePassword(
    this: ModelType<Candidate> & typeof Candidate,
    newPassword: string,
    oldPassword: string,
  ) {
    const match = await bcrypt.compareSync(newPassword, oldPassword);

    return match;
  }

  @StaticMethod
  public static async isCPFinUse(
    this: ModelType<Candidate> & typeof Candidate,
    newCpf: string,
    candidateId: string,
  ) {
    const baseQuery = { _id: { $ne: candidateId }, cpf: newCpf };

    return (await this.countDocuments(baseQuery)) > 0;
  }

  @Property({ required: true, trim: true, unique: false })
  public name: string;

  @Property({ required: true, unique: false })
  public password: string;

  @Property({
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [
      {
        message: 'Invalid e-mail.',
        validator: emailValidator,
      },
    ],
  })
  public email: string;

  @Property({
    default: false,
  })
  public isDeleted: boolean;

  @Property({
    required: false,
    index: true,
    trim: true,
    validate: {
      message: 'Invalid CPF.',
      validator: cpfValidator,
    },
  })
  public cpf: string;

  @Property({ required: false })
  public birthDate: Date;

  @Property({ required: false })
  public graduation: Graduation;
}

export const CandidateModel = new Candidate().getModelForClass(Candidate, {
  schemaOptions: {
    collection: 'candidates',
    timestamps: true,
    autoIndex: true,
    toJSON: {
      transform(doc: CandidateInterface, candidate: CandidateInterface) {
        delete candidate.__v;
        delete candidate.password;
        delete candidate.isDeleted;
      },
    },
  },
});
