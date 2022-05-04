import { AttendanceType } from "@/src/domain/attendances/entities/attendance.entity";
import attendanceEnums from "@/src/domain/attendances/enums/attendance.enum";
import mockedUsers from "../users/users-list.mock";

const attendances: AttendanceType[] = [
    {
        id: '625cc239a814e93465aaa470',
        protocol: '625cc239a814e93465aaa470',
        customerId: '625cc239a814e93465aaa470',
        customer: mockedUsers.customers[0],
        createdAt: new Date("2022-05-04"),
        status: attendanceEnums.status.OPENED
    },
    {
        id: '625dd239a814e93465aaa470',
        protocol: '625dd239a814e93465aaa470',
        customerId: '625dd239a814e93465aaa470',
        customer: mockedUsers.customers[0],
        createdAt: new Date("2022-05-04"),
        status: attendanceEnums.status.OPENED
    },
    {
        id: '625ee239a814e93465aaa470',
        protocol: '625ee239a814e93465aaa470',
        customerId: '625ee239a814e93465aaa470',
        customer: mockedUsers.customers[0],
        createdAt: new Date("2022-05-04"),
        status: attendanceEnums.status.OPENED
    },
];

const mockedAttendances = {
    attendances,
};

export default mockedAttendances;