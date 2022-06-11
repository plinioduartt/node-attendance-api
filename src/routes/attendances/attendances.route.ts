import AttendanceController from '@/src/application/attendances/controllers/attendance.controller';
import AttendanceService, { AttendanceServiceInjectionType } from '@/src/application/attendances/services/attendance.service';
import AttendantService from '@/src/application/users/attendants/services/attendant.service';
import CustomerService from '@/src/application/users/customers/services/customer.service';
import AttendanceRepository from '@/src/infrastructure/attendances/database/in-memory/repositories/attendance.repository';
import MessageRepository from '@/src/infrastructure/attendances/messages/database/in-memory/repositories/message.repository';
import AttendantRepository from '@/src/infrastructure/users/attendants/database/in-memory/repositories/attendant.repository';
import CustomerRepository from '@/src/infrastructure/users/customers/database/in-memory/repositories/customer.repository';
import NodeMailerService from '@/src/utils/mailer/nodemailer/nodemailer.service';
import { Router } from 'express';

function initController(): AttendanceController {
    const customerRepository: CustomerRepository = new CustomerRepository();
    const customerService: CustomerService = new CustomerService(customerRepository);
    const attendantRepository: AttendantRepository = new AttendantRepository();
    const attendantService: AttendantService = new AttendantService(attendantRepository);
    const attendanceRepository: AttendanceRepository = new AttendanceRepository();
    const messageRepository: MessageRepository = new MessageRepository();
    const mailerService: NodeMailerService = new NodeMailerService();
    const service: AttendanceService = new AttendanceService({
        attendanceRepository,
        messageRepository,
        customerService,
        attendantService,
        mailerService
    } as AttendanceServiceInjectionType);
    const controller: AttendanceController = new AttendanceController(service);
    return controller;
};

const controller = initController();

const attendancesRouter = Router();

attendancesRouter.get('/', controller.list.bind(controller));
attendancesRouter.get('/:id', controller.retrieve.bind(controller));
attendancesRouter.post('/', controller.open.bind(controller));
attendancesRouter.patch('/:id/close', controller.close.bind(controller));
attendancesRouter.patch('/:id', controller.update.bind(controller));
attendancesRouter.post('/:id/messages', controller.writeMessage.bind(controller));
attendancesRouter.get('/:id/messages', controller.listMessages.bind(controller));

if (process.env.NODE_ENV !== "test") {
    console.info('Attendance routes has been initialized.');
}

export default attendancesRouter;