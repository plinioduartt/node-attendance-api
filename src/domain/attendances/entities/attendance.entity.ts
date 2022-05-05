import CustomError from '@/src/http/errors/customError';
import { AttendanceDtoType } from '@/src/infrastructure/attendances/presenters/mappers/attendance.mapper';
import { AttendantDtoType } from '@/src/infrastructure/users/attendants/presenters/mappers/attendant.mapper';
import { CustomerDtoType } from '@/src/infrastructure/users/customers/presenters/mappers/customer.mapper';
import IMailerService, { MailDataType } from '@/src/utils/mailer/mailer.interface';
import crypto from 'node:crypto';
import IsValidInstanceType from '../../_commons/types/isValidInstance.type';
import attendanceEnums from '../enums/attendance.enum';
import Message, { MessageType } from '../messages/entities/message.entity';

export type AttendanceType = {
    id?: string | undefined;
    protocol?: string | undefined;
    status?: string | undefined; // OPENED | CLOSED
    customerId: string;
    customer?: CustomerDtoType | undefined;
    attendantId?: string | undefined;
    attendant?: AttendantDtoType | undefined;
    createdAt?: Date | undefined;
    closedAt?: Date | undefined;
}

class Attendance {
    private readonly _id?: undefined | string;
    public readonly protocol: string;
    public readonly status: string;
    public readonly customerId: string;
    public readonly customer: CustomerDtoType;
    public readonly attendantId?: string | undefined;
    public readonly attendant?: AttendantDtoType | undefined;
    public readonly createdAt?: Date | undefined;
    public readonly closedAt?: Date | undefined;

    private constructor({ ...args }: AttendanceType) {
        this._id = args.id ?? crypto.randomUUID();
        this.protocol = args.protocol ?? crypto.randomUUID();
        this.status = args.status ?? attendanceEnums.status.OPENED;
        this.customerId = args.customerId;
        if (args.customer) this.customer = args.customer;
        if (args.attendantId) this.attendantId = args.attendantId;
        if (args.attendant) this.attendant = args.attendant;
        if (args.createdAt) this.createdAt = args.createdAt;
        if (args.closedAt) this.closedAt = args.closedAt;
    }

    get id(): string | undefined {
        return this._id;
    }

    static async open(data: AttendanceType): Promise<Attendance> {
        const newAttendance: Attendance = new Attendance(data);
        const { isValid, errors }: IsValidInstanceType = newAttendance.isValidInstance();

        if (!isValid && errors.length > 0) {
            const ERROR_MSG: string = errors.join(' ');
            throw new CustomError(400, ERROR_MSG);
        }

        return newAttendance;
    }

    static async close(mailer: IMailerService, data: AttendanceDtoType): Promise<void> {
        const html = `
        <html>
        <head>
            <title>Href Attribute Example</title>
        </head>
        <body>
            <h1>Href Attribute Example</h1>
            <p>
            <a href="https://www.freecodecamp.org/contribute/">The freeCodeCamp Contribution Page</a> shows you how and where you can contribute to freeCodeCamp's community and growth.
            </p>
        </body>
        </html>
        `

        const emailData: MailDataType = {
            from: "atendeai@gmail.com",
            to: data.customer.email ?? "",
            cc: "plinio.desenvolvimento@gmail.com",
            subject: "Histórico do seu atendimento",
            text: "Histórico do seu atendimento",
            html
        };

        await mailer.send(emailData);
        return;
    }

    static async writeMessage(data: MessageType): Promise<Message> {
        const newMessage: Message = await Message.write(data);
        return newMessage;
    }

    evaluateService() {
        // evaluate attendant
    }

    private isValidInstance(): IsValidInstanceType {
        const propertyNames: string[] = Object.getOwnPropertyNames(this);

        const errors: (string | null)[] = propertyNames
            .map(property => this[property as keyof Attendance] != null ? null : `property ${property} is missing.`)
            .filter(item => !!item);

        return {
            isValid: errors.length === 0,
            errors
        }
    }
}

export default Attendance;