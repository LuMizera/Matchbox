import CandidateRoutes from './candidateRouter';
import JobRoutes from './jobRouter';

export default (app: any) => {
  new CandidateRoutes({ app });
  new JobRoutes({ app });
};
