import crypto from 'node:crypto';
import CustomError from "@/src/http/errors/customError";
import IsValidInstanceType from "../../../_commons/types/isValidInstance.type";
import messageEnums from "../../enums/message.enum";

export type MessageType = {
    id?: string | undefined;
    authorName: string;
    receiverName?: string | undefined;
    from: string; // CUSTOMER | ATTENDANT | AUTOMATIC
    type: string; // TEXT | IMAGE (initially, it will work only with text messages...)
    attendanceId: string;
    createdAt?: Date | undefined;
    status?: string | undefined; // SENT | READ
    message: string;
}

class Message {
    private readonly _id?: string | undefined;
    public readonly authorName: string;
    public readonly receiverName?: string | undefined;
    public readonly from: string;
    public readonly type: string;
    public readonly attendanceId: string;
    public readonly status?: string | undefined;
    public readonly createdAt?: Date | undefined;
    public readonly message: string;

    private constructor({ ...args }: MessageType) {
        this._id = args.id ?? crypto.randomUUID();
        this.authorName = args.authorName;
        this.from = args.from;
        this.message = args.message;
        this.type = args.type;
        this.attendanceId = args.attendanceId;
        this.status = args.status ?? messageEnums.status.SENDING;
        if (args.receiverName) this.receiverName = args.receiverName;
        if (args.createdAt) this.createdAt = args.createdAt ?? new Date();
    }

    get id(): string | undefined {
        return this._id;
    }

    static async write(data: MessageType): Promise<Message> {
        const newMessage: Message = new Message(data);
        const { isValid, errors }: IsValidInstanceType = newMessage.isValidInstance();

        if (!isValid && errors.length > 0) {
            const ERROR_MSG: string = errors.join(' ');
            throw new CustomError(400, ERROR_MSG);
        }

        return newMessage;
    }

    private isValidInstance(): IsValidInstanceType {
        const propertyNames: string[] = Object.getOwnPropertyNames(this);

        const errors: (string | null)[] = propertyNames
            .map(property => this[property as keyof Message] != null ? null : `property ${property} is missing.`)
            .filter(item => !!item);

        return {
            isValid: errors.length === 0,
            errors
        }
    }
}

export default Message;