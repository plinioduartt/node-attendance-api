type MessageEnumType = {
    from: {
        [key: string]: string;
    },
    type: {
        [key: string]: string;
    },
    status: {
        [key: string]: string;
    }
}

const messageEnums: MessageEnumType = {
    from: {
        CUSTOMER: 'CUSTOMER',
        ATTENDANT: 'ATTENDANT',
        AUTOMATIC: 'AUTOMATIC',
    },
    type: {
        TEXT: 'TEXT',
        IMAGE: 'IMAGE'
    },
    status: {
        SENDING: 'SENDING',
        SENT: 'SENT',
        READ: 'READ'
    }
};

export default messageEnums;