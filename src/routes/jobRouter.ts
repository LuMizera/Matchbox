import { create, list, update, byId, remove } from '../controller/jobController';
import { Express } from 'express';
import { permissionHandler, adminOnly } from '../middlewares/permissionHandler';

class JobRouter {
  app: Express;
  constructor({ app }: { app: Express }) {
    this.app = app;

    // CRUD
    app.route('/job').post(adminOnly, create);
    app.route('/job').get(permissionHandler, list);
    app.route('/job/:id').put(adminOnly, update);
    app.route('/job/:id').get(permissionHandler, byId);
    app.route('/job/:id').delete(adminOnly, remove);
  }
}
export default JobRouter;
