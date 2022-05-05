import IMailerService, { MailDataType } from "../mailer.interface";
import nodemailer from "nodemailer";
import CustomError from "@/src/http/errors/customError";

type AccountType = {
    user: string | undefined;
    pass: string | undefined;
};

class NodeMailerService implements IMailerService {
    private readonly _host: string | undefined = process.env.NODE_ENV === "test" ? process.env.TEST_SMTP_HOST : process.env.SMTP_HOST;
    private readonly _port: number | undefined = Number(process.env.SMTP_PORT);
    private _transporter: nodemailer.Transporter;
    private readonly _account: AccountType = {
        user: process.env.NODE_ENV === "test" ? process.env.TEST_SMTP_ADDRESS : process.env.SMTP_ADDRESS,
        pass: process.env.NODE_ENV === "test" ? process.env.TEST_SMTP_PASS : process.env.SMTP_PASS
    };

    constructor() {
        this._initTransporter();
    }

    private async _initTransporter() {
        this._transporter = nodemailer.createTransport({
            host: this._host,
            port: this._port,
            secure: false,
            auth: {
                user: this._account.user,
                pass: this._account.pass,
            },
        });
    }

    async send(data: MailDataType): Promise<void> {
        try {
            const emailData: nodemailer.SendMailOptions = {
                from: data.from,
                to: data.to,
                cc: data.cc,
                subject: data.subject,
                text: data.text,
                html: data.html,
            };

            let info: nodemailer.SentMessageInfo = await this._transporter.sendMail(emailData);

            console.info("Email sent: %s", info.messageId);
        } catch (error: any) {
            console.error(error.message);
            throw new CustomError(400, 'Unexpected error while sending email.')
        }
    }
}

export default NodeMailerService;