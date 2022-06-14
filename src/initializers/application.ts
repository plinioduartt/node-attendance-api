import express, { Application, Router } from 'express';
import dotenv from 'dotenv';
import routes from './route';
import cors from 'cors';
import helmet from 'helmet';
import events from '../tcp/events';
import initSocket from '../tcp/socket/socket.io/server';
import ClientSocket from '../tcp/socket/socket.io/client';
import attendancesRouter from '../routes/attendances/attendances.route';
import administratorsRouter from '../routes/users/administrators.route';
import attendantsRouter from '../routes/users/attendants.route';
import customersRouter from '../routes/users/customers.route';
import signInRouter from '../routes/authentication/sign-in.route';

dotenv.config();
const application: Application = express();
const router: Router = express.Router();

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  application.use(cors());
}

application.use(helmet());

router.use(express.json());
router.use('/auth', signInRouter)
router.use('/attendances', attendancesRouter)
router.use('/administrators', administratorsRouter)
router.use('/attendants', attendantsRouter)
router.use('/customers', customersRouter)
application.use(router)
application.use(routes)

events.init();
initSocket(application);
ClientSocket.initSocket();
// ClientSocket.eventListeners();

export default application;