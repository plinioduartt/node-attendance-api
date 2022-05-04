import mockedUsers from "@/src/mock/users/users-list.mock";
import { omit } from "lodash";
import Attendance, { AttendanceType } from "../../entities/attendance.entity";
import messageEnums from "../../enums/message.enum";
import Message, { MessageType } from "./message.entity";

describe('Attendance entity', () => {
    it('Write message ==> Should return a valid new message instance', async () => {
        // arrange
        const attendanceData: AttendanceType = {
            customerId: mockedUsers.customers[0].id ?? "625cc239a814e93465aaa470",
        };
        const newAttendance: Attendance = await Attendance.open(attendanceData);
        const messageData: MessageType = {
            authorName: "Plinio Duarte",
            from: messageEnums.from.CUSTOMER,
            type: messageEnums.type.TEXT,
            attendanceId: newAttendance.id ?? "invalidID",
            message: "teste"
        };

        // act
        const newMessage: Message = await Attendance.writeMessage(messageData);

        // assertions
        expect(newAttendance).toBeTruthy();
        expect(newAttendance).toBeInstanceOf(Attendance);
        expect(newMessage).toBeTruthy();
        expect(newMessage).toBeInstanceOf(Message);
        expect(newAttendance).toHaveProperty('protocol');
        expect(newAttendance).toHaveProperty('status');
        expect(newAttendance.status).toBe('OPENED');
        expect(newMessage).toHaveProperty('authorName');
        expect(newMessage).toHaveProperty('status');
        expect(newMessage.status).toBe('SENDING');
    });
});

describe('Attendance entity EXPECTED ERRORS', () => {
    it('Write message ==> Should return a error when props missing', async () => {
        // arrange
        const attendanceData: AttendanceType = {
            customerId: mockedUsers.customers[0].id ?? "625cc239a814e93465aaa470",
        };
        const newAttendance: Attendance = await Attendance.open(attendanceData);
        const messageData: MessageType = {
            authorName: "Plinio Duarte",
            from: messageEnums.from.CUSTOMER,
            type: messageEnums.type.TEXT,
            attendanceId: newAttendance.id ?? "invalidID",
            message: "teste"
        };
        const MISSED_PROPERTY = 'authorName';
        const MISSED_PROPERTY_EXPECTED = 'authorName';

        // act
        const request = async () => await Attendance.writeMessage(omit(messageData, [MISSED_PROPERTY]) as MessageType);

        // assertions
        expect(newAttendance).toBeTruthy();
        expect(newAttendance).toBeInstanceOf(Attendance);
        expect(request).rejects.toThrowError(`property ${MISSED_PROPERTY_EXPECTED} is missing.`);
    });
});