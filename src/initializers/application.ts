import express, { Application } from 'express';
import dotenv from 'dotenv';
import routes from './route';
import cors from 'cors';
import helmet from 'helmet';
import events from '../tcp/events';
import initSocket from '../tcp/socket/socket.io/server';
import ClientSocket from '../tcp/socket/socket.io/client';

dotenv.config();
const application: Application = express();

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  application.use(cors());
}

application.use(helmet());
application.use(routes);
events.init();
initSocket(application);
ClientSocket.initSocket();
// ClientSocket.eventListeners();

export default application;