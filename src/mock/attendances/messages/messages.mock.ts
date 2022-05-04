import messageEnums from "@/src/domain/attendances/enums/message.enum";
import { MessageType } from "@/src/domain/attendances/messages/entities/message.entity";

const messages: MessageType[] = [
    {
        id: '625ee239a814e93465aaa470',
        authorName: 'Plinio Duarte',
        from: messageEnums.from.CUSTOMER,
        type: messageEnums.type.TEXT,
        attendanceId: '625cc239a814e93465aaa470',
        message: 'Teste 1',
        createdAt: new Date("2022-05-04 14:00"),
        status: messageEnums.status.SENT,
    },
    {
        id: '625ee239a814e93465aaa470',
        authorName: 'Plinio Duarte',
        from: messageEnums.from.CUSTOMER,
        type: messageEnums.type.TEXT,
        attendanceId: '625cc239a814e93465aaa470',
        message: 'Teste 2',
        createdAt: new Date("2022-05-04 14:05"),
        status: messageEnums.status.SENT,
    },
    {
        id: '625ee239a814e93465aaa470',
        authorName: 'Plinio Duarte',
        receiverName: 'Nome Atendente',
        from: messageEnums.from.CUSTOMER,
        type: messageEnums.type.TEXT,
        attendanceId: '625dd239a814e93465aaa470',
        message: 'Teste 3',
        createdAt: new Date("2022-05-03 17:00"),
        status: messageEnums.status.SENT,
    },
];

const mockedMessages = {
    messages
};

export default mockedMessages;