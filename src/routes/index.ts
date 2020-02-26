import CandidateRoutes from './candidateRouter';
import JobRoutes from './jobRouter';
import AuthRouter from './authRouter';

export default (app: any) => {
  new CandidateRoutes({ app });
  new JobRoutes({ app });
  new AuthRouter({ app });
};
