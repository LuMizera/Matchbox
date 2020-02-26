import {
  create,
  list,
  update,
  byId,
  remove,
  assignCandidate,
  unassignCandidate,
} from '../controller/candidateController';
import { Express } from 'express';
import { permissionHandler, adminOnly } from '../middlewares/permissionHandler';

class CandidateRouter {
  app: Express;
  constructor({ app }: { app: Express }) {
    this.app = app;

    // CRUD
    app.route('/candidate').post(create);
    app.route('/candidate').get(adminOnly, list);
    app.route('/candidate/:id').put(permissionHandler, update);
    app.route('/candidate/:id').get(permissionHandler, byId);
    app.route('/candidate/:id').delete(permissionHandler, remove);

    // JOB ASSIGN
    app
      .route('/candidate/:id/assign-jobs')
      .post(permissionHandler, assignCandidate);
    app.route('/candidate/:id/unassign-jobs').post(permissionHandler, unassignCandidate);
  }
}
export default CandidateRouter;
