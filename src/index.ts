import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();
const app = express();

//CORS
app.use(
  cors({
    preflightContinue: false,
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
    ],
  }),
);

//MIDDLEWARES
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

routes(app);

mongoose
  .connect(process.env.CONNECTION_STRING_MONGODB || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('-----------------------------------------------');
      console.log(`API Rodando na porta: ${process.env.PORT || 5000}`);
      console.log('-----------------------------------------------');
    });
  })
  .catch(err => {
    console.log('err', err);
    console.log('Não foi possivel conectar com o banco de dados :(');
  });

module.exports = app;
