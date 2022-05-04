import AttendantController from '@/src/application/users/attendants/controller/attendant.controller';
import AttendantService from '@/src/application/users/attendants/services/attendant.service';
import AttendantRepository from '@/src/infrastructure/users/attendants/database/in-memory/repositories/attendant.repository';
import { Router } from 'express';

const attendantsRouter = Router();

function initController(): AttendantController {
    const repository: AttendantRepository = new AttendantRepository();
    const service: AttendantService = new AttendantService(repository);
    const controller: AttendantController = new AttendantController(service);
    return controller;
};

const controller = initController();

attendantsRouter.get('/attendants', controller.list.bind(controller));
attendantsRouter.get('/attendants/:id', controller.retrieve.bind(controller));
attendantsRouter.post('/attendants', controller.create.bind(controller));
attendantsRouter.patch('/attendants/:id', controller.update.bind(controller));

console.info('Attendants routes has been initialized.');

export default attendantsRouter;