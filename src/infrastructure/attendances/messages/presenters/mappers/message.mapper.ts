import { MessageType } from "@/src/domain/attendances/messages/entities/message.entity";

export type MessageDtoType = {
    id?: string | undefined;
    authorName: string;
    receiverName?: string | undefined;
    from: string;
    type: string;
    attendanceId: string;
    createdAt?: Date | undefined;
    status?: string | undefined;
    message: string;
}

const MessageMapper = {
    domainToDto: (data: MessageType): MessageDtoType => {
        const result: MessageDtoType = {
            id: data.id,
            authorName: data.authorName,
            receiverName: data.receiverName,
            from: data.from,
            type: data.type,
            attendanceId: data.attendanceId,
            createdAt: data.createdAt,
            status: data.status,
            message: data.message,
        };

        return result;
    }
}

export default MessageMapper;