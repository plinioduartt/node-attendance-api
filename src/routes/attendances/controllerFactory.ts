import AttendanceController from "@/src/application/attendances/controllers/attendance.controller";
import AttendanceService, { AttendanceServiceInjectionType } from "@/src/application/attendances/services/attendance.service";
import AttendantService from "@/src/application/users/attendants/services/attendant.service";
import CustomerService from "@/src/application/users/customers/services/customer.service";
import AttendanceRepository from "@/src/infrastructure/attendances/database/in-memory/repositories/attendance.repository";
import MessageRepository from "@/src/infrastructure/attendances/messages/database/in-memory/repositories/message.repository";
import Hateoas from "@/src/infrastructure/hateoas/Hateoas";
import AttendantRepository from "@/src/infrastructure/users/attendants/database/in-memory/repositories/attendant.repository";
import CustomerRepository from "@/src/infrastructure/users/customers/database/in-memory/repositories/customer.repository";
import NodeMailerService from "@/src/utils/mailer/nodemailer/nodemailer.service";

function ControllerFactory(): AttendanceController {
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
  const controller: AttendanceController = new AttendanceController(service, Hateoas);
  return controller;
};

export default ControllerFactory