import { AttendanceType } from "@/src/domain/attendances/entities/attendance.entity";
import { MessageType } from "@/src/domain/attendances/messages/entities/message.entity";
import { MessageDtoType } from "@/src/infrastructure/attendances/messages/presenters/mappers/message.mapper";
import { AttendanceDtoType } from "@/src/infrastructure/attendances/presenters/mappers/attendance.mapper";

interface IAttendanceService {
    list(): Promise<AttendanceDtoType[]>;
    open(data: AttendanceType): Promise<AttendanceDtoType>;
    close(param: string): Promise<AttendanceDtoType>;
    retrieve(param: string): Promise<AttendanceDtoType>;
    update(id: string, data: AttendanceType): Promise<AttendanceDtoType>;
    writeMessage(id: string, data: MessageType): Promise<MessageDtoType>;
    listMessages(id: string): Promise<MessageDtoType[]>;
}

export default IAttendanceService;