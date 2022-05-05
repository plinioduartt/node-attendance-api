
import AuthController from '@/src/application/authentication/jwt/controllers/auth.controller';
import AuthService from '@/src/application/authentication/jwt/services/auth.service';
import AbstractUserService from '@/src/application/users/abstract-users/services/abstract-user.service';
import AbstractUserRepository from '@/src/infrastructure/users/abstract-users/database/in-memory/repositories/abstract-user.repository';
import { Router } from 'express';

const administratorsRouter = Router();

function initController(): AuthController {
    const abstractUserRepository: AbstractUserRepository = new AbstractUserRepository();
    const abstractUserService: AbstractUserService = new AbstractUserService(abstractUserRepository);
    const service: AuthService = new AuthService({ service: abstractUserService });
    const controller: AuthController = new AuthController(service);
    return controller;
};

const controller = initController();

administratorsRouter.post('/sign-in', controller.signIn.bind(controller));

console.info('SignIn route has been initialized.');

export default administratorsRouter;