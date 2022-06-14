import AdministratorController from '@/src/application/users/administrators/controller/administrator.controller';
import AdministratorService from '@/src/application/users/administrators/services/administrator.service';
import RequireAuthenticationMiddleware from '@/src/http/middlewares/auth.middleware';
import OnlyAdministratorMiddleware from '@/src/http/middlewares/users/administrators/only-administrator.middleware';
import { HttpMethods } from '@/src/http/protocols/http';
import { Endpoint } from '@/src/http/protocols/routes';
import Hateoas from '@/src/infrastructure/hateoas/Hateoas';
import AdministratorRepository from '@/src/infrastructure/users/administrators/database/in-memory/repositories/administrator.repository';
import { Router } from 'express';

export const administratorEndpoints: Endpoint<AdministratorController>[] = [
    {
        methodName: 'list',
        path: '/',
        httpMethod: HttpMethods.GET,
        middlewares: [
            RequireAuthenticationMiddleware,
            OnlyAdministratorMiddleware
        ]
    },
    {
        methodName: 'retrieve',
        path: '/:id',
        httpMethod: HttpMethods.GET,
        param: 'id',
        middlewares: [
            RequireAuthenticationMiddleware,
            OnlyAdministratorMiddleware
        ]
    },
    {
        methodName: 'create',
        path: '/',
        httpMethod: HttpMethods.POST,
        middlewares: [
            RequireAuthenticationMiddleware,
            OnlyAdministratorMiddleware
        ]
    },
    {
        methodName: 'update',
        path: '/:id',
        httpMethod: HttpMethods.PATCH,
        param: 'id',
        middlewares: [
            RequireAuthenticationMiddleware,
            OnlyAdministratorMiddleware
        ]
    }
]

const administratorsRouter = Router();

function initController(): AdministratorController {
    const repository: AdministratorRepository = new AdministratorRepository();
    const service: AdministratorService = new AdministratorService(repository);
    const controller: AdministratorController = new AdministratorController(service, Hateoas);
    return controller;
};

const controller = initController();

administratorEndpoints.map(endpoint => {
    const methodToBeCalled = Reflect
        .get(controller, endpoint.methodName)
        .bind(controller);

    if (!methodToBeCalled || typeof methodToBeCalled !== 'function') {
        throw Error('Not implemented!');
    }

    administratorsRouter[endpoint.httpMethod](endpoint.path, endpoint.middlewares, methodToBeCalled);
})

if (process.env.NODE_ENV !== "test") {
    console.info('Administrators routes has been initialized.');
}

export default administratorsRouter;