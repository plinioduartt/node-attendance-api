export type MailDataType = {
    from: string;
    to: string;
    cc: string;
    subject: string;
    text: string;
    html: string;
}

interface IMailerService {
    send(data: MailDataType): Promise<void>;
}

export default IMailerService;