import { create, list, update, byId, remove } from '../controller/jobController';
import { Express } from 'express';

class JobRouter {
  app: Express;
  constructor({ app }: { app: Express }) {
    this.app = app;

    app.route('/job').post(create);
    app.route('/job').get(list);
    app.route('/job/:id').put(update);
    app.route('/job/:id').get(byId);
    app.route('/job/:id').delete(remove);
  }
}
export default JobRouter;
