import {
  create,
  list,
  update,
  byId,
  remove,
  assignCandidate,
} from '../controller/candidateController';
import { Express } from 'express';

class CandidateRouter {
  app: Express;
  constructor({ app }: { app: Express }) {
    this.app = app;

    // CRUD
    app.route('/candidate').post(create);
    app.route('/candidate').get(list);
    app.route('/candidate/:id').put(update);
    app.route('/candidate/:id').get(byId);
    app.route('/candidate/:id').delete(remove);

    // JOB ASSIGN
    app.route('/candidate/:id/assign-jobs').post(assignCandidate);
  }
}
export default CandidateRouter;
