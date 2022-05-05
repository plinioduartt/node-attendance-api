import { AttendanceType } from "@/src/domain/attendances/entities/attendance.entity";
import messageEnums from "@/src/domain/attendances/enums/message.enum";
import { MessageType } from "@/src/domain/attendances/messages/entities/message.entity";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import ApiJsonResponseListType from "@/src/http/types/api-responses/api-json-response-list.type";
import ApiJsonResponseRetrieveType from "@/src/http/types/api-responses/api-json-response-retrieve.type";
import AttendanceRepository from "@/src/infrastructure/attendances/database/in-memory/repositories/attendance.repository";
import MessageRepository from "@/src/infrastructure/attendances/messages/database/in-memory/repositories/message.repository";
import { AttendanceDtoType } from "@/src/infrastructure/attendances/presenters/mappers/attendance.mapper";
import AttendantRepository from "@/src/infrastructure/users/attendants/database/in-memory/repositories/attendant.repository";
import CustomerRepository from "@/src/infrastructure/users/customers/database/in-memory/repositories/customer.repository";
import mockedAttendances from "@/src/mock/attendances/attendances.mock";
import mockedUsers from "@/src/mock/users/users-list.mock";
import NodeMailerService from "@/src/utils/mailer/nodemailer/nodemailer.service";
import { Request, Response } from "express";
import AttendantService from "../../users/attendants/services/attendant.service";
import CustomerService from "../../users/customers/services/customer.service";
import AttendanceService, { AttendanceServiceInjectionType } from "../services/attendance.service";
import AttendanceController from "./attendance.controller";

jest.setTimeout(50000);

function sutFactory() {
    const customerRepository: CustomerRepository = new CustomerRepository();
    const customerService: CustomerService = new CustomerService(customerRepository);
    const attendantRepository: AttendantRepository = new AttendantRepository();
    const attendantService: AttendantService = new AttendantService(attendantRepository);
    const attendanceRepository: AttendanceRepository = new AttendanceRepository();
    const messageRepository: MessageRepository = new MessageRepository();
    const mailerService: NodeMailerService = new NodeMailerService();
    const attendanceService: AttendanceService = new AttendanceService(
        {
            attendanceRepository,
            messageRepository,
            customerService,
            attendantService,
            mailerService
        } as AttendanceServiceInjectionType
    );
    return new AttendanceController(attendanceService);
}

describe("Attendance controller", () => {
    const sut: AttendanceController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("Open Attendance ==> Should open a new valid attendance", async () => {
        // arrange
        const request: Partial<Request> = {
            body: {
                customerId: mockedUsers.customers[0].id ?? "625cc239a814e93465aaa470",
            } as AttendanceType
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:open() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:open() ->  Mock response json function')
        }

        // act
        const result: any = await sut.open(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<AttendanceDtoType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(201);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('protocol');
        expect(json.data).toHaveProperty('status');
        expect(json.data).toHaveProperty('customerId');
    });

    it("Retrieve Attendance ==> Should return a attendance by id", async () => {
        // arrange
        const DEFAULT_ATTENDANCE_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const request: Partial<Request> = {
            params: {
                id: mockedAttendances.attendances[0].id ?? DEFAULT_ATTENDANCE_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:retrieve() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:retrieve() ->  Mock response json function')
        }

        // act
        const result: any = await sut.retrieve(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseRetrieveType<AttendanceType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('protocol');
        expect(json.data).toHaveProperty('status');
        expect(json.data).toHaveProperty('customerId');
    });

    it("List Attendances ==> Should return Attendances list", async () => {
        // arrange
        const request: Partial<Request> = {
            query: {
                // 
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:list() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:list() ->  Mock response json function')
        }

        // act
        const result: any = await sut.list(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseListType<AttendanceType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data[0]).toHaveProperty('id');
        expect(json.data[0]).toHaveProperty('protocol');
        expect(json.data[0]).toHaveProperty('status');
        expect(json.data[0]).toHaveProperty('customerId');
    });

    it("Update Attendance ==> Should update a specific Attendance by ID", async () => {
        // arrange
        const DEFAULT_ATTENDANCE_ID_FOR_TESTS: string = "625cc239a814e93465aaa470";
        const ATTENDANT_ID_FOR_TESTS: string = mockedUsers.attendants[0].id ?? "625cc239a814e93465aaa470";
        const NEW_PROPERTY_VALUES: Partial<AttendanceType> = {
            attendantId: ATTENDANT_ID_FOR_TESTS
        };

        const request: Partial<Request> = {
            params: {
                id: mockedAttendances.attendances[0].id ?? DEFAULT_ATTENDANCE_ID_FOR_TESTS
            },
            body: NEW_PROPERTY_VALUES
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:update() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:update() ->  Mock response json function')
        }

        // act
        const result: any = await sut.update(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<AttendanceDtoType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('protocol');
        expect(json.data).toHaveProperty('status');
        expect(json.data).toHaveProperty('customerId');
        expect(json.data).toHaveProperty('customer');
        expect(json.data.customer).toHaveProperty('name');
        expect(json.data).toHaveProperty('attendantId');
        expect(json.data).toHaveProperty('attendant');
        expect(json.data.attendant).toHaveProperty('name');
        expect(json.data.attendantId).toBe(NEW_PROPERTY_VALUES.attendantId);
    });

    it("Write Attendance Message ==> Should write new Attendance Message", async () => {
        // arrange
        const DEFAULT_ATTENDANCE_ID_FOR_TESTS: string = "625cc239a814e93465aaa470";
        const messageData: MessageType = {
            authorName: mockedUsers.customers[0].name,
            from: messageEnums.from.CUSTOMER,
            type: messageEnums.type.TEXT,
            attendanceId: mockedAttendances.attendances[0].id ?? DEFAULT_ATTENDANCE_ID_FOR_TESTS,
            message: "Teste de mensagem"
        };
        const request: Partial<Request> = {
            params: {
                id: mockedAttendances.attendances[0].id ?? DEFAULT_ATTENDANCE_ID_FOR_TESTS
            },
            body: messageData
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:MessagesList() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:MessagesList() ->  Mock response json function')
        }

        // act
        const result: any = await sut.writeMessage(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<AttendanceType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(201);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('message');
        expect(json.data).toHaveProperty('attendanceId');
        expect(json.data).toHaveProperty('authorName');
    });

    it("List Attendance Messages ==> Should return Attendance Messages list", async () => {
        // arrange
        const DEFAULT_ATTENDANCE_ID_FOR_TESTS: string = "625cc239a814e93465aaa470";
        const request: Partial<Request> = {
            params: {
                id: mockedAttendances.attendances[0].id ?? DEFAULT_ATTENDANCE_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:MessagesList() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:MessagesList() ->  Mock response json function')
        }

        // act
        const result: any = await sut.listMessages(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseListType<AttendanceType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data[0]).toHaveProperty('id');
        expect(json.data[0]).toHaveProperty('message');
        expect(json.data[0]).toHaveProperty('attendanceId');
        expect(json.data[0]).toHaveProperty('authorName');
    });
});

describe("Attendance controller EXPECTED ERRORS", () => {
    const sut: AttendanceController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("Close Attendance ==> Should return error attendance not found", async () => {
        // arrange
        const INVALID_ATTENDANCE_ID_FOR_TESTS: string = "invalidId";
        const request: Partial<Request> = {
            params: {
                id: INVALID_ATTENDANCE_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:close() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:close() ->  Mock response json function')
        }

        // act
        const result: any = await sut.close(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonErrorType = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(404);
        expect(json).toHaveProperty('error');
        expect(json.error).toHaveProperty('message');
        expect(json.error.message).toBe(`No attendances found with param ${INVALID_ATTENDANCE_ID_FOR_TESTS}.`);
    });

    it("Retrieve Attendance ==> Should return error attendance not found", async () => {
        // arrange
        const INVALID_ATTENDANCE_ID_FOR_TESTS: string = 'invalid';
        const request: Partial<Request> = {
            params: {
                id: INVALID_ATTENDANCE_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:retrieve() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:retrieve() ->  Mock response json function')
        }

        // act
        const result: any = await sut.retrieve(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonErrorType = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(404);
        expect(json).toHaveProperty('error');
        expect(json.error).toHaveProperty('message');
        expect(json.error.message).toBe(`No attendances found with param ${INVALID_ATTENDANCE_ID_FOR_TESTS}.`);
    });

    it("Update Attendance ==> Should return an error attendance not found", async () => {
        // arrange
        const INVALID_ATTENDANCE_ID_FOR_TESTS: string = "invalidID";
        const ATTENDANT_ID_FOR_TESTS = mockedUsers.attendants[0].id ?? "625cc239a814e93465aaa470";
        const NEW_PROPERTY_VALUES: Partial<AttendanceType> = {
            attendantId: ATTENDANT_ID_FOR_TESTS
        };

        const request: Partial<Request> = {
            params: {
                id: INVALID_ATTENDANCE_ID_FOR_TESTS
            },
            body: NEW_PROPERTY_VALUES
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:update() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:update() ->  Mock response json function')
        }

        // act
        const result: any = await sut.update(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonErrorType = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(404);
        expect(json).toHaveProperty('error');
        expect(json.error).toHaveProperty('message');
        expect(json.error.message).toBe(`No attendances found with id ${INVALID_ATTENDANCE_ID_FOR_TESTS}.`)
    });

    it("Update Attendant of Attendance ==> Should return an error when user (Attendant) not found", async () => {
        // arrange
        const DEFAULT_ATTENDANCE_ID_FOR_TESTS: string = "625cc239a814e93465aaa470";
        const ATTENDANT_ID_FOR_TESTS = "123456";
        const NEW_PROPERTY_VALUES: Partial<AttendanceType> = {
            attendantId: ATTENDANT_ID_FOR_TESTS
        };

        const request: Partial<Request> = {
            params: {
                id: DEFAULT_ATTENDANCE_ID_FOR_TESTS
            },
            body: NEW_PROPERTY_VALUES
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendanceController:update() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendanceController:update() ->  Mock response json function')
        }

        // act
        const result: any = await sut.update(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonErrorType = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(404);
        expect(json).toHaveProperty('error');
        expect(json.error).toHaveProperty('message');
        expect(json.error.message).toBe(`No attendants found with param ${ATTENDANT_ID_FOR_TESTS}.`)
    });
});