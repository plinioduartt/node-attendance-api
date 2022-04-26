import express, { Application } from 'express';
import dotenv from 'dotenv';
import routes from './route';
import cors from 'cors';

dotenv.config();
const application: Application = express();

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  application.use(cors());
}

application.use(routes);

export default application;