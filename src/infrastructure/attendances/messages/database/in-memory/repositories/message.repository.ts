import { MessageType } from "@/src/domain/attendances/messages/entities/message.entity";
import IMessageRepository, { ListMessagesParamsType } from "@/src/domain/attendances/messages/repository/message.interface";
import mockedMessages from "@/src/mock/attendances/messages/messages.mock";
import MessageMapper, { MessageDtoType } from "../../../presenters/mappers/message.mapper";

class MessageRepository implements IMessageRepository {
    public messages: MessageType[] = mockedMessages.messages;

    async list(receivedParams: ListMessagesParamsType): Promise<MessageType[]> {
        const { params }: ListMessagesParamsType = receivedParams;
        const foundMessages: MessageType[] = this.messages
            .filter(message => message.attendanceId === params.attendanceId);
        return foundMessages;
    }

    async create(data: MessageType): Promise<MessageDtoType> {
        // insert Attendant into database
        this.messages.push(data);
        // Adapter:Converting the internal data type to an http external data type that clients expects
        // map the properties of the customer as dto
        const mappedCustomer: MessageDtoType = MessageMapper.domainToDto(data);
        return mappedCustomer;
    }
}

export default MessageRepository;