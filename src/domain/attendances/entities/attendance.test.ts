import mockedUsers from "@/src/mock/users/users-list.mock";
import { omit } from "lodash";
import Attendance, { AttendanceType } from "./attendance.entity";

describe('Attendance entity', () => {
    it('Open attendance ==> Should open a new attendance', async () => {
        // arrange
        const data: AttendanceType = {
            customerId: mockedUsers.customers[0].id ?? "625cc239a814e93465aaa470",
        };

        // act
        const newAttendance: Attendance = await Attendance.open(data);

        // assertions
        expect(newAttendance).toBeTruthy();
        expect(newAttendance).toBeInstanceOf(Attendance);
        expect(newAttendance).toHaveProperty('protocol');
        expect(newAttendance).toHaveProperty('status');
        expect(newAttendance.status).toBe('OPENED');
    });
});

describe('Attendance entity EXPECTED ERRORS', () => {
    it('Open attendance ==> Should return an error when prop missing', async () => {
        // arrange
        const data: AttendanceType = {
            customerId: mockedUsers.customers[0].id ?? "625cc239a814e93465aaa470",
        };
        const MISSED_PROPERTY = 'customerId';
        const MISSED_PROPERTY_EXPECTED = 'customerId';

        // act
        const request = async () => await Attendance.open(omit(data, [MISSED_PROPERTY]) as AttendanceType);

        // assertions
        expect(request).rejects.toThrowError(`property ${MISSED_PROPERTY_EXPECTED} is missing.`);
    });
});