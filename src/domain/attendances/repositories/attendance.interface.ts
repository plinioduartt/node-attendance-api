import { AttendanceDtoType } from "@/src/infrastructure/attendances/presenters/mappers/attendance.mapper";
import { AttendanceType } from "../entities/attendance.entity";

interface IAttendanceRepository {
    list(): Promise<AttendanceDtoType[]>;
    open(data: AttendanceType): Promise<AttendanceDtoType>;
    close(param: string): Promise<AttendanceDtoType>;
    retrieve(param: string): Promise<AttendanceDtoType | undefined>;
    update(id: string, data: AttendanceType): Promise<AttendanceDtoType>;
}

export default IAttendanceRepository;