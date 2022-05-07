import { io, Socket } from "socket.io-client";
import eventsEnum from "../../events/enums/eventsEnum.enum";

class ClientSocket {
    static socket: Socket = io(`http://${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`);
    private constructor() { }

    static initSocket(): void {
        this.socket.connect();
    }

    static closeSocket(): void {
        this.socket.disconnect();
    }

    static emit(data: any): void {
        this.socket.emit(eventsEnum.NEW_CHAT_MESSAGE, data);
    }
}

export default ClientSocket;
