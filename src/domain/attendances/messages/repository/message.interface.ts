import { MessageDtoType } from "@/src/infrastructure/attendances/messages/presenters/mappers/message.mapper";
import { MessageType } from "../entities/message.entity";

export type ListMessagesParamsType = {
    params: {
        attendanceId: string;
    }
};

interface IMessageRepository {
    list(params: ListMessagesParamsType): Promise<MessageDtoType[]>;
    create(data: MessageType): Promise<MessageDtoType>;
};

export default IMessageRepository;