import { io } from "socket.io-client";
import eventsEnum from "../../events/enums/eventsEnum.enum";
const socket = io(`http://${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`);

class ClientSocket {
    private constructor() { }

    static initSocket() {
        socket.connect();
        // socket.emit(eventsEnum.JOIN_CHAT, {
        //     protocol: '625cc239a814e93465aaa470',
        //     userName: "plinio"
        // });
    }

    static closeSocket() {
        socket.disconnect();
    }

    static emit(data: any): void {
        socket.emit(eventsEnum.NEW_CHAT_MESSAGE, data);
    }

    // static eventListeners(): void {
    //     socket.on(eventsEnum.NEW_CHAT_MESSAGE, (data) => {
    //         console.log('Mensagem recebida pelo client ==> ', data);
    //     });

    //     socket.on(eventsEnum.JOINED_CHAT, (data) => {
    //         console.log(`${data} entrou no chat.`);
    //     });
    // }
}

export default ClientSocket;
