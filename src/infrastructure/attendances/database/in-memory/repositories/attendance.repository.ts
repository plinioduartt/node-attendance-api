import { AttendanceType } from "@/src/domain/attendances/entities/attendance.entity";
import attendanceEnums from "@/src/domain/attendances/enums/attendance.enum";
import IAttendanceRepository from "@/src/domain/attendances/repositories/attendance.interface";
import mockedAttendances from "@/src/mock/attendances/attendances.mock";
import AttendanceMapper, { AttendanceDtoType } from "../../../presenters/mappers/attendance.mapper";

/**
 * Returns mapped data
 */

class AttendanceRepository implements IAttendanceRepository {
    public attendances: AttendanceType[] = mockedAttendances.attendances;

    async list(): Promise<AttendanceDtoType[]> {
        let mappedAttendances: AttendanceDtoType[] = [];

        for await (const attendance of this.attendances) {
            const mappedAttendance: AttendanceDtoType = AttendanceMapper
                .domainToDto(attendance);
            mappedAttendances.push(mappedAttendance);
        }

        return mappedAttendances;
    }

    async open(data: AttendanceType): Promise<AttendanceDtoType> {
        // insert Attendance into database
        this.attendances.push(data);

        // Adapter:Converting the internal data type to an http external data type that clients expects
        // map the properties of the Attendance as dto
        const mappedAttendance: AttendanceDtoType = AttendanceMapper.domainToDto(data);
        return mappedAttendance;
    }

    async close(param: string): Promise<AttendanceDtoType> {
        const index: number = this.attendances.findIndex(item => item.id === param);
        this.attendances[index] = {
            ...this.attendances[index],
            status: attendanceEnums.status.CLOSED,
            closedAt: new Date(),
        };
        const updatedUser: AttendanceType = this.attendances[index];
        const mappedAttendance: AttendanceDtoType = AttendanceMapper.domainToDto(updatedUser);
        return mappedAttendance;
    }

    async retrieve(param: string): Promise<AttendanceDtoType | undefined> {
        const attendance: AttendanceType | undefined = this.attendances.find(item => item.id === param);
        if (!!attendance) {
            const mappedAttendance: AttendanceDtoType = AttendanceMapper.domainToDto(attendance);
            return mappedAttendance;
        }
        return attendance;
    }

    async update(id: string, data: AttendanceType): Promise<AttendanceDtoType> {
        const index: number = this.attendances.findIndex(item => item.id === id);
        this.attendances[index] = {
            ...this.attendances[index],
            ...data
        };
        const updatedUser: AttendanceType = this.attendances[index];
        const mappedAttendance: AttendanceDtoType = AttendanceMapper.domainToDto(updatedUser);
        return mappedAttendance;
    }
}

export default AttendanceRepository;