import { authenticate } from '../controller/authController';
import { Express } from 'express';

class CandidateRouter {
  app: Express;
  constructor({ app }: { app: Express }) {
    this.app = app;

    // CRUD
    app.route('/login').post(authenticate);
  }
}
export default CandidateRouter;
