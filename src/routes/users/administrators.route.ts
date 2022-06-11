import AdministratorController from '@/src/application/users/administrators/controller/administrator.controller';
import AdministratorService from '@/src/application/users/administrators/services/administrator.service';
import RequireAuthenticationMiddleware from '@/src/http/middlewares/auth.middleware';
import OnlyAdministratorMiddleware from '@/src/http/middlewares/users/administrators/only-administrator.middleware';
import AdministratorRepository from '@/src/infrastructure/users/administrators/database/in-memory/repositories/administrator.repository';
import { Router } from 'express';

const administratorsRouter = Router();

function initController(): AdministratorController {
    const repository: AdministratorRepository = new AdministratorRepository();
    const service: AdministratorService = new AdministratorService(repository);
    const controller: AdministratorController = new AdministratorController(service);
    return controller;
};

const controller = initController();

administratorsRouter.get('/', [
    RequireAuthenticationMiddleware,
    OnlyAdministratorMiddleware
], controller.list.bind(controller));

administratorsRouter.get('/:id', [
    RequireAuthenticationMiddleware,
    OnlyAdministratorMiddleware
], controller.retrieve.bind(controller));

administratorsRouter.post('/', [
    RequireAuthenticationMiddleware,
    OnlyAdministratorMiddleware
], controller.create.bind(controller));

administratorsRouter.patch('/:id', [
    RequireAuthenticationMiddleware,
    OnlyAdministratorMiddleware
], controller.update.bind(controller));

if (process.env.NODE_ENV !== "test") {
    console.info('Administrators routes has been initialized.');
}

export default administratorsRouter;