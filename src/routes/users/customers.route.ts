import CustomerController from '@/src/application/users/customers/controller/customer.controller';
import CustomerService from '@/src/application/users/customers/services/customer.service';
import RequireAuthenticationMiddleware from '@/src/http/middlewares/auth.middleware';
import OnlyEmployeesMiddleware from '@/src/http/middlewares/only-employees.middleware';
import OnlyAdministratorMiddleware from '@/src/http/middlewares/users/administrators/only-administrator.middleware';
import HandleRetrieveCustomersMiddleware from '@/src/http/middlewares/users/customers/handle-retrieve-customers.middleware';
import HandleUpdateCustomersMiddleware from '@/src/http/middlewares/users/customers/handle-update-customers.middleware';
import CustomerRepository from '@/src/infrastructure/users/customers/database/in-memory/repositories/customer.repository';
import { Router } from 'express';

const customersRouter = Router();

function initController(): CustomerController {
    const repository: CustomerRepository = new CustomerRepository();
    const service: CustomerService = new CustomerService(repository);
    const controller: CustomerController = new CustomerController(service);
    return controller;
};

const controller = initController();

customersRouter.get('/customers', [
    RequireAuthenticationMiddleware,
    OnlyEmployeesMiddleware
], controller.list.bind(controller));

customersRouter.get('/customers/:id', [
    RequireAuthenticationMiddleware,
    HandleRetrieveCustomersMiddleware
], controller.retrieve.bind(controller));

customersRouter.post('/customers', controller.create.bind(controller));

customersRouter.patch('/customers/:id', [
    RequireAuthenticationMiddleware,
    HandleUpdateCustomersMiddleware
], controller.update.bind(controller));

console.info('Customers routes has been initialized.');

export default customersRouter;