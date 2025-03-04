import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import appRoutes from '../../routes';
import { errorHandler } from '../../middlewares/status';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(bodyParser.json());
app.use('/api/v1', appRoutes);
app.use(errorHandler);

export default app;
