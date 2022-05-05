import AttendantController from '@/src/application/users/attendants/controller/attendant.controller';
import AttendantService from '@/src/application/users/attendants/services/attendant.service';
import RequireAuthenticationMiddleware from '@/src/http/middlewares/auth.middleware';
import OnlyAdministratorMiddleware from '@/src/http/middlewares/users/administrators/only-administrator.middleware';
import HandleRetrieveAttendantsMiddleware from '@/src/http/middlewares/users/attendants/handle-retrieve-attendants.middleware';
import HandleUpdateAttendantsMiddleware from '@/src/http/middlewares/users/attendants/handle-update-attendants.middleware';
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

attendantsRouter.get('/attendants', [
    RequireAuthenticationMiddleware,
    OnlyAdministratorMiddleware
], controller.list.bind(controller));

attendantsRouter.get('/attendants/:id', [
    RequireAuthenticationMiddleware,
    HandleRetrieveAttendantsMiddleware
], controller.retrieve.bind(controller));

attendantsRouter.post('/attendants', [
    RequireAuthenticationMiddleware,
    OnlyAdministratorMiddleware
], controller.create.bind(controller));

attendantsRouter.patch('/attendants/:id', [
    RequireAuthenticationMiddleware,
    HandleUpdateAttendantsMiddleware
], controller.update.bind(controller));

console.info('Attendants routes has been initialized.');

export default attendantsRouter;