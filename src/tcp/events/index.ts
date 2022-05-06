import { EventEmitter } from 'node:events';
import ClientSocket from '../socket/socket.io/client';
import eventsEnum from './enums/eventsEnum.enum';

class EventHandler {
    private ee: EventEmitter = new EventEmitter();

    init() {
        this._registerEvents();
    }

    private _registerEvents(): void {
        this.ee.on(eventsEnum.NEW_CHAT_MESSAGE, (data) => {
            ClientSocket.emit(data);
        });
    }

    emit(event: string, data: unknown) {
        this.ee.emit(event, data);
    }
}

export default new EventHandler();