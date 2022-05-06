type EventsType = {
    [key: string]: string;
};

const eventsEnum: EventsType = {
    NEW_CHAT_MESSAGE: 'chat:message',
    JOINED_CHAT: 'chat:joined-chat',
    JOIN_CHAT: 'chat:join-chat',
};

export default eventsEnum;