import AttendanceController from '@/src/application/attendances/controllers/attendance.controller';
import { HttpMethods } from '@/src/http/protocols/http';
import { Endpoint } from '@/src/http/protocols/routes';
import { Router } from 'express';
import ControllerFactory from './controllerFactory';

export const attendancesEndpoints: Endpoint<AttendanceController>[] = [
    {
        methodName: 'list',
        path: '/',
        httpMethod: HttpMethods.GET
    },
    {
        methodName: 'retrieve',
        path: '/:id',
        httpMethod: HttpMethods.GET,
        param: 'id'
    },
    {
        methodName: 'close',
        path: '/:id/close',
        httpMethod: HttpMethods.PATCH,
        param: 'id'
    },
    {
        methodName: 'update',
        path: '/:id',
        httpMethod: HttpMethods.PATCH,
        param: 'id'
    },
    {
        methodName: 'writeMessage',
        path: '/:id/messages',
        httpMethod: HttpMethods.POST,
        param: 'id'
    },
    {
        methodName: 'listMessages',
        path: '/:id/messages',
        httpMethod: HttpMethods.GET,
        param: 'id'
    }
]

const controller = ControllerFactory();

const attendancesRouter = Router();

attendancesEndpoints.map(endpoint => {
    const methodToBeCalled = Reflect
        .get(controller, endpoint.methodName)
        .bind(controller);

    if (!methodToBeCalled || typeof methodToBeCalled !== 'function') {
        throw Error('Not implemented!');
    }

    attendancesRouter[endpoint.httpMethod](endpoint.path, methodToBeCalled);
})


if (process.env.NODE_ENV !== "test") {
    console.info('Attendance routes has been initialized.');
}

export default attendancesRouter;