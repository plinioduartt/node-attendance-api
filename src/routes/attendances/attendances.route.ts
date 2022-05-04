import AttendanceController from '@/src/application/attendances/controllers/attendance.controller';
import AttendanceService, { AttendanceServiceInjectionType } from '@/src/application/attendances/services/attendance.service';
import AttendantService from '@/src/application/users/attendants/services/attendant.service';
import CustomerService from '@/src/application/users/customers/services/customer.service';
import AttendanceRepository from '@/src/infrastructure/attendances/database/in-memory/repositories/attendance.repository';
import MessageRepository from '@/src/infrastructure/attendances/messages/database/in-memory/repositories/message.repository';
import AttendantRepository from '@/src/infrastructure/users/attendants/database/in-memory/repositories/attendant.repository';
import CustomerRepository from '@/src/infrastructure/users/customers/database/in-memory/repositories/customer.repository';
import { Router } from 'express';

const attendancesRouter = Router();

function initController(): AttendanceController {
    const customerRepository: CustomerRepository = new CustomerRepository();
    const customerService: CustomerService = new CustomerService(customerRepository);
    const attendantRepository: AttendantRepository = new AttendantRepository();
    const attendantService: AttendantService = new AttendantService(attendantRepository);
    const attendanceRepository: AttendanceRepository = new AttendanceRepository();
    const messageRepository: MessageRepository = new MessageRepository();
    const service: AttendanceService = new AttendanceService({
        attendanceRepository,
        messageRepository,
        customerService,
        attendantService
    } as AttendanceServiceInjectionType);
    const controller: AttendanceController = new AttendanceController(service);
    return controller;
};

const controller = initController();

attendancesRouter.get('/attendances', controller.list.bind(controller));
attendancesRouter.get('/attendances/:id', controller.retrieve.bind(controller));
attendancesRouter.post('/attendances', controller.open.bind(controller));
attendancesRouter.patch('/attendances/:id/close', controller.close.bind(controller));
attendancesRouter.patch('/attendances/:id', controller.update.bind(controller));
attendancesRouter.post('/attendances/:id/messages', controller.writeMessage.bind(controller));
attendancesRouter.get('/attendances/:id/messages', controller.listMessages.bind(controller));

console.info('Attendance routes has been initialized.');

export default attendancesRouter;