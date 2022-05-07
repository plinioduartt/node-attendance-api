import { MessageDtoType } from "@/src/infrastructure/attendances/messages/presenters/mappers/message.mapper";
import { AttendanceDtoType } from "@/src/infrastructure/attendances/presenters/mappers/attendance.mapper";
import { Application } from "express";
import { createServer, Server as IHttpServer } from "http";
import { Server } from "socket.io";
import eventsEnum from "../../events/enums/eventsEnum.enum";

export type JoinChatDataType = {
    protocol: string;
    userName: string;
}

function initSocket(application: Application): void {
    const httpServer: IHttpServer = createServer(application);
    const io: Server = new Server(httpServer, {});

    io.on("connection", (socket): void => {
        socket.on(eventsEnum.JOIN_CHAT, (data: JoinChatDataType) => {
            socket.join(data.protocol);
            io.to(data.protocol).emit(eventsEnum.JOINED_CHAT, data.userName);
        });

        socket.on(eventsEnum.NEW_CHAT_MESSAGE, (data: AttendanceDtoType & MessageDtoType) => {
            if (data?.protocol) {
                io.to(data.protocol).emit(eventsEnum.NEW_CHAT_MESSAGE, data);
            }
        });
    });
    
    const testingEnv: boolean = process.env.NODE_ENV === "test";

    if (!testingEnv) {
        httpServer.listen(process.env.SOCKET_PORT, () => {
            console.info(`Socket is listening on port: ${process.env.SOCKET_PORT}`);
        });
    }  
}

export default initSocket;