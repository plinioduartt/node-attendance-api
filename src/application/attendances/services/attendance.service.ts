import Attendance, { AttendanceType } from "@/src/domain/attendances/entities/attendance.entity";
import Message, { MessageType } from "@/src/domain/attendances/messages/entities/message.entity";
import IMessageRepository, { ListMessagesParamsType } from "@/src/domain/attendances/messages/repository/message.interface";
import IAttendanceRepository from "@/src/domain/attendances/repositories/attendance.interface";
import CustomError from "@/src/http/errors/customError";
import { MessageDtoType } from "@/src/infrastructure/attendances/messages/presenters/mappers/message.mapper";
import { AttendanceDtoType } from "@/src/infrastructure/attendances/presenters/mappers/attendance.mapper";
import IMailerService from "@/src/utils/mailer/mailer.interface";
import IAttendantService from "../../users/attendants/services/attendant.interface";
import ICustomerService from "../../users/customers/services/customer.interface";
import IAttendanceService from "./attendance.interface";

export type AttendanceServiceInjectionType = {
    attendanceRepository: IAttendanceRepository;
    messageRepository: IMessageRepository;
    customerService: ICustomerService;
    attendantService: IAttendantService;
    mailerService: IMailerService;
}

class AttendanceService implements IAttendanceService {
    private readonly _attendanceRepository: IAttendanceRepository;
    private readonly _messageRepository: IMessageRepository;
    private readonly _customerService: ICustomerService;
    private readonly _attendantService: IAttendantService;
    public mailerService: IMailerService;

    constructor({
        attendanceRepository,
        messageRepository,
        customerService,
        attendantService,
        mailerService
    }: AttendanceServiceInjectionType) {
        this._attendanceRepository = attendanceRepository;
        this._messageRepository = messageRepository;
        this._customerService = customerService;
        this._attendantService = attendantService;
        this.mailerService = mailerService;
    }

    async list(): Promise<AttendanceDtoType[]> {
        const attendances: AttendanceDtoType[] = await this._attendanceRepository.list();
        return attendances;
    }

    async open(data: AttendanceType): Promise<AttendanceDtoType> {
        if (!data.customerId) {
            throw new CustomError(400, `property customerId is missing.`)
        }

        const customer = await this._customerService.retrieve(data.customerId);
        const newAttendanceInstance: Attendance = await Attendance.open({
            ...data,
            customer
        });
        const newAttendance: AttendanceDtoType = await this._attendanceRepository.open(newAttendanceInstance);
        return newAttendance;
    }

    async close(param: string): Promise<AttendanceDtoType> {
        const attendanceFound: AttendanceDtoType | undefined = await this._attendanceRepository.retrieve(param);

        if (!attendanceFound) {
            throw new CustomError(404, `No attendances found with param ${param}.`);
        }

        //** Logic for send the resume of attendance in customer email */
        const attendant: AttendanceDtoType = await this._attendanceRepository.close(param);
        await Attendance.close(this.mailerService, attendant);
        return attendant;
    }

    async retrieve(param: string): Promise<AttendanceDtoType> {
        const attendanceFound: AttendanceDtoType | undefined = await this._attendanceRepository.retrieve(param);

        if (!attendanceFound) {
            throw new CustomError(404, `No attendances found with param ${param}.`);
        }

        return attendanceFound;
    }

    async update(id: string, data: AttendanceType): Promise<AttendanceDtoType> {
        const attendanceFound: AttendanceDtoType | undefined = await this._attendanceRepository.retrieve(id);

        if (!attendanceFound) {
            throw new CustomError(404, `No attendances found with id ${id}.`);
        }

        if (data.attendantId) {
            const attendant = await this._attendantService.retrieve(data.attendantId);
            data.attendant = attendant;
        }

        //** Logic for send the resume of attendance in customer email */
        const attendant: AttendanceDtoType = await this._attendanceRepository.update(id, data);
        return attendant;
    }

    async writeMessage(id: string, data: MessageType): Promise<MessageDtoType> {
        const attendanceFound: AttendanceDtoType | undefined = await this._attendanceRepository.retrieve(id);

        if (!attendanceFound) {
            throw new CustomError(404, `No attendances found with id ${id}.`);
        }

        const newMessageInstance: Message = await Attendance.writeMessage({
            ...data,
            attendanceId: id
        });
        const newMessage: MessageDtoType = await this._messageRepository.create(newMessageInstance);
        return newMessage;
    }

    async listMessages(id: string): Promise<MessageDtoType[]> {
        const attendanceFound: AttendanceDtoType | undefined = await this._attendanceRepository.retrieve(id);

        if (!attendanceFound) {
            throw new CustomError(404, `No attendances found with id ${id}.`);
        }

        const params: ListMessagesParamsType = {
            params: {
                attendanceId: id
            }
        };

        const messages: MessageType[] = await this._messageRepository.list(params);
        return messages;
    }
}

export default AttendanceService;