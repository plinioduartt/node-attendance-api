import { AttendanceType } from "@/src/domain/attendances/entities/attendance.entity";
import AttendanceRepository from "@/src/infrastructure/attendances/database/in-memory/repositories/attendance.repository";
import { AttendanceDtoType } from "@/src/infrastructure/attendances/presenters/mappers/attendance.mapper";
import mockedUsers from "@/src/mock/users/users-list.mock";
import AttendanceService, { AttendanceServiceInjectionType } from "./attendance.service";
import { omit } from "lodash";
import mockedAttendances from "@/src/mock/attendances/attendances.mock";
import attendanceEnums from "@/src/domain/attendances/enums/attendance.enum";
import MessageRepository from "@/src/infrastructure/attendances/messages/database/in-memory/repositories/message.repository";
import { MessageType } from "@/src/domain/attendances/messages/entities/message.entity";
import messageEnums from "@/src/domain/attendances/enums/message.enum";
import { MessageDtoType } from "@/src/infrastructure/attendances/messages/presenters/mappers/message.mapper";
import CustomerRepository from "@/src/infrastructure/users/customers/database/in-memory/repositories/customer.repository";
import CustomerService from "../../users/customers/services/customer.service";
import AttendantRepository from "@/src/infrastructure/users/attendants/database/in-memory/repositories/attendant.repository";
import AttendantService from "../../users/attendants/services/attendant.service";

function sutFactory() {
    const customerRepository: CustomerRepository = new CustomerRepository();
    const customerService: CustomerService = new CustomerService(customerRepository);
    const attendantRepository: AttendantRepository = new AttendantRepository();
    const attendantService: AttendantService = new AttendantService(attendantRepository);
    const attendanceRepository: AttendanceRepository = new AttendanceRepository();
    const messageRepository: MessageRepository = new MessageRepository();
    const service: AttendanceService = new AttendanceService({
        attendanceRepository,
        messageRepository,
        customerService,
        attendantService
    } as AttendanceServiceInjectionType);
    return service;
}

describe('Attendance services', () => {
    const sut: AttendanceService = sutFactory();
    const DEFAULT_ATTENDANCE_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
    const DEFAULT_USER_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
    const attendanceData: AttendanceType = {
        customerId: mockedUsers.customers[0].id ?? DEFAULT_USER_ID_FOR_TESTS,
    };

    it('Open Attendance: Should open a new valid attendance', async () => {
        // arrange

        // act
        const newAttendance: AttendanceDtoType = await sut.open(attendanceData);

        // assert
        expect(newAttendance).toBeTruthy();
        expect(newAttendance).toHaveProperty('protocol');
        expect(newAttendance).toHaveProperty('status');
        expect(newAttendance).toHaveProperty('customerId');
    });

    it('Close Attendance: Should close a specific attendance by passing ID', async () => {
        // arrange
        const VALID_ID: string = mockedAttendances.attendances[0].id || DEFAULT_ATTENDANCE_ID_FOR_TESTS;

        // act
        const newAttendance: AttendanceDtoType = await sut.close(VALID_ID);

        // assert
        expect(newAttendance).toBeTruthy();
        expect(newAttendance).toHaveProperty('protocol');
        expect(newAttendance).toHaveProperty('status');
        expect(newAttendance).toHaveProperty('customerId');
        expect(newAttendance.status).toBe(attendanceEnums.status.CLOSED);
    });

    it('Retrieve Attendance: Should return a specific attendance by id', async () => {
        // arrange
        const VALID_ID: string = mockedAttendances.attendances[0].id || DEFAULT_ATTENDANCE_ID_FOR_TESTS;

        // act
        const attendance: AttendanceDtoType = await sut.retrieve(VALID_ID);

        // assert
        expect(attendance).toBeTruthy();
        expect(attendance).toHaveProperty('protocol');
        expect(attendance).toHaveProperty('status');
        expect(attendance).toHaveProperty('customerId');
    });

    it('List Attendances: Should return an attendances list', async () => {
        // arrange

        // act
        const attendances: AttendanceDtoType[] = await sut.list();

        // assert
        expect(attendances).toBeTruthy();
        expect(attendances[0]).toHaveProperty('protocol');
        expect(attendances[0]).toHaveProperty('status');
        expect(attendances[0]).toHaveProperty('customerId');
    });

    it('Update Attendance: Should return an updated user', async () => {
        // arrange
        const VALID_ID: string = mockedAttendances.attendances[0].id ?? DEFAULT_ATTENDANCE_ID_FOR_TESTS;
        const ATTENDANT_ID_FOR_TESTS = mockedUsers.attendants[0].id ?? "625cc239a814e93465aaa470";
        const NEW_PROPERTY_VALUES: Partial<AttendanceType> = {
            attendantId: ATTENDANT_ID_FOR_TESTS,
        };

        // act
        const response: AttendanceDtoType = await sut.update(VALID_ID, NEW_PROPERTY_VALUES as AttendanceType);

        // assert
        expect(response).toBeTruthy();
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('protocol');
        expect(response).toHaveProperty('customerId');
        expect(response).toHaveProperty('customer');
        expect(response.customer).toHaveProperty('name');
        expect(response).toHaveProperty('attendantId');
        expect(response).toHaveProperty('attendant');
        expect(response.attendant).toHaveProperty('name');
        expect(response).toHaveProperty('status');
        expect(response).toHaveProperty('createdAt');
        expect(response.attendantId).toBe(NEW_PROPERTY_VALUES.attendantId);
    });

    it('Attendance Write Message: Should write a message in attendance chat', async () => {
        // arrange
        const attendanceId: string = mockedAttendances.attendances[0].id ?? DEFAULT_ATTENDANCE_ID_FOR_TESTS;
        const messageData: MessageType = {
            attendanceId,
            authorName: mockedUsers.customers[0].name,
            from: messageEnums.from.CUSTOMER,
            type: messageEnums.type.TEXT,
            message: "Mensagem de teste"
        };

        // act
        const response: MessageType = await sut.writeMessage(attendanceId, messageData);

        // assert
        expect(response).toBeTruthy();
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('authorName');
        expect(response).toHaveProperty('from');
        expect(response).toHaveProperty('type');
        expect(response).toHaveProperty('createdAt');
        expect(response.message).toBe(messageData.message);
    });

    it('Attendance List Messages: Should list the messages of an specific attendance chat', async () => {
        // arrange
        const attendanceId: string = mockedAttendances.attendances[0].id ?? DEFAULT_ATTENDANCE_ID_FOR_TESTS;

        // act
        const response: MessageDtoType[] = await sut.listMessages(attendanceId);

        // assert
        expect(response).toBeTruthy();
        expect(response[0]).toHaveProperty('id');
        expect(response[0]).toHaveProperty('authorName');
        expect(response[0]).toHaveProperty('from');
        expect(response[0]).toHaveProperty('type');
        expect(response[0]).toHaveProperty('createdAt');
        expect(response[0]).toHaveProperty('message');
    });
});

describe('Attendance services EXPECTED ERRORS', () => {
    const sut: AttendanceService = sutFactory();
    const DEFAULT_ATTENDANCE_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
    const DEFAULT_USER_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
    const attendanceData: AttendanceType = {
        customerId: mockedUsers.customers[0].id ?? DEFAULT_USER_ID_FOR_TESTS,
    };

    it('Open Attendance: Should return an error if customerId is not given', async () => {
        // arrange
        const MISSED_PROPERTY: string = 'customerId';
        const MISSED_PROPERTY_EXPECTED: string = 'customerId';

        // act
        const request = async () => await sut.open(omit(attendanceData, [MISSED_PROPERTY]) as AttendanceType);

        // assert
        expect(request).rejects.toThrowError(`property ${MISSED_PROPERTY_EXPECTED} is missing.`)
    });

    it('Close Attendance: Should return an not found attendance error', async () => {
        // arrange
        const INVALID_ID: string = 'invalid';

        // act
        const request = async () => await sut.close(INVALID_ID);

        // assert
        expect(request).rejects.toThrowError(`No attendances found with param ${INVALID_ID}.`)
    });

    it('Retrieve Attendance: Should return an error of not found atendance', async () => {
        // arrange
        const INVALID_ID: string = 'invalidID';

        // act
        const request = async () => await sut.retrieve(INVALID_ID);

        // assert
        expect(request).rejects.toThrowError(`No attendances found with param ${INVALID_ID}.`)
    });

    it('Update Attendance: Should return a error attendance not found', async () => {
        // arrange
        const INVALID_ID: string = "invalidID";
        const ATTENDANT_ID_FOR_TESTS = mockedUsers.attendants[0].id ?? "625cc239a814e93465aaa470";
        const NEW_PROPERTY_VALUES: Partial<AttendanceType> = {
            attendantId: ATTENDANT_ID_FOR_TESTS
        };

        // act
        const request = async () => await sut.update(INVALID_ID, NEW_PROPERTY_VALUES as AttendanceType);

        // assert
        expect(request).rejects.toThrowError(`No attendances found with id ${INVALID_ID}.`);
    });

    it('Update Attendant in Attendance: Should return a error attendant not found', async () => {
        // arrange
        const ATTENDANT_ID_FOR_TESTS = "123456";
        const NEW_PROPERTY_VALUES: Partial<AttendanceType> = {
            attendantId: ATTENDANT_ID_FOR_TESTS
        };

        // act
        const request = async () => await sut.update(DEFAULT_ATTENDANCE_ID_FOR_TESTS, NEW_PROPERTY_VALUES as AttendanceType);

        // assert
        expect(request).rejects.toThrowError(`No attendants found with param ${ATTENDANT_ID_FOR_TESTS}.`);
    });

    it('Attendance Write Message: Should return not found attendance error', async () => {
        // arrange
        const INVALID_ID: string = "invalidID";
        const messageData: MessageType = {
            attendanceId: INVALID_ID,
            authorName: mockedUsers.customers[0].name,
            from: messageEnums.from.CUSTOMER,
            type: messageEnums.type.TEXT,
            message: "Mensagem de teste"
        };

        // act
        const request = async () => await sut.writeMessage(INVALID_ID, messageData);

        // assert
        expect(request).rejects.toThrowError(`No attendances found with id ${INVALID_ID}.`);
    });

    it('Attendance Write Message: Should return and error missing props', async () => {
        // arrange
        const attendanceId: string = mockedAttendances.attendances[0].id ?? DEFAULT_ATTENDANCE_ID_FOR_TESTS;
        const messageData: MessageType = {
            attendanceId,
            authorName: mockedUsers.customers[0].name,
            from: messageEnums.from.CUSTOMER,
            type: messageEnums.type.TEXT,
            message: "Mensagem de teste"
        };
        const MISSED_PROPERTY: string = 'from';
        const MISSED_PROPERTY_EXPECTED: string = 'from';

        // act
        const request = async () => await sut.writeMessage(attendanceId, omit(messageData, [MISSED_PROPERTY]) as MessageType);

        // assert
        expect(request).rejects.toThrowError(`property ${MISSED_PROPERTY_EXPECTED} is missing.`)
    });

    it('Attendance List Messages: Should return a error when trying to listing messages of a non existing attendance', async () => {
        // arrange
        const INVALID_ID: string = "invalidID";

        // act
        const request = async () => await sut.listMessages(INVALID_ID);

        // assert
        expect(request).rejects.toThrowError(`No attendances found with id ${INVALID_ID}.`);

    });
});