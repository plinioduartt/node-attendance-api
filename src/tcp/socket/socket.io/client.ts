import { io, Socket } from "socket.io-client";
import eventsEnum from "../../events/enums/eventsEnum.enum";

class ClientSocket {
    static socket: Socket = io(`http://${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`);
    private constructor() { }

    static initSocket() {
        this.socket.connect();
        // this.socket.emit(eventsEnum.JOIN_CHAT, {
        //     protocol: '625cc239a814e93465aaa470',
        //     userName: "plinio"
        // });
    }

    static closeSocket() {
        this.socket.disconnect();
    }

    static emit(data: any): void {
        this.socket.emit(eventsEnum.NEW_CHAT_MESSAGE, data);
    }

    // static eventListeners(): void {
    //     this.socket.on(eventsEnum.NEW_CHAT_MESSAGE, (data) => {
    //         console.log('Mensagem recebida pelo client ==> ', data);
    //     });

    //     this.socket.on(eventsEnum.JOINED_CHAT, (data) => {
    //         console.log(`${data} entrou no chat.`);
    //     });
    // }
}

export default ClientSocket;
