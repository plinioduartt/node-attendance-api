import { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";
import roles from "@/src/domain/users/enums/roles.enum";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import ApiJsonResponseListType from "@/src/http/types/api-responses/api-json-response-list.type";
import ApiJsonResponseRetrieveType from "@/src/http/types/api-responses/api-json-response-retrieve.type";
import AttendantRepository from "@/src/infrastructure/users/attendants/database/in-memory/repositories/attendant.repository";
import mockedUsers from "@/src/mock/users/users-list.mock";
import { Request, Response } from "express";
import AttendantService from "../services/attendant.service";
import AttendantController from "./attendant.controller";

jest.setTimeout(50000);

function sutFactory() {
    const repository = new AttendantRepository();
    const service = new AttendantService(repository);
    return new AttendantController(service);
}

describe("Attendant controller", () => {
    const sut: AttendantController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("Create Attendant ==> Should create a new valid Attendant", async () => {
        // arrange
        const request: Partial<Request> = {
            body: {
                name: 'Plinio Duarte',
                cpf: 'J12345678900',
                email: 'plinio.duartes@hotmail.com',
                password: '123456',
                city: 'Paulínia',
                state: 'SP',
                roleId: roles.ATTENDANT
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendantController:create() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendantController:create() ->  Mock response json function')
        }

        // act
        const result: any = await sut.create(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<AttendantType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(201);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('name');
        expect(json.data).toHaveProperty('cpf');
        expect(json.data).toHaveProperty('email');
        expect(json.data).not.toHaveProperty('_password');
        expect(json.data).not.toHaveProperty('password');
        expect(json.data).toHaveProperty('roleId');
        expect(json.data).toHaveProperty('city');
        expect(json.data).toHaveProperty('state');
    });

    it("Retrieve Attendant ==> Should return a Attendant by id", async () => {
        // arrange
        const DEFAULT_ATTENDANT_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const request: Partial<Request> = {
            params: {
                id: mockedUsers.attendants[0].id ?? DEFAULT_ATTENDANT_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendantController:retrieve() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendantController:retrieve() ->  Mock response json function')
        }

        // act
        const result: any = await sut.retrieve(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseRetrieveType<AttendantType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('name');
        expect(json.data).toHaveProperty('cpf');
        expect(json.data).toHaveProperty('email');
        expect(json.data).not.toHaveProperty('_password');
        expect(json.data).not.toHaveProperty('password');
        expect(json.data).toHaveProperty('roleId');
        expect(json.data).toHaveProperty('city');
        expect(json.data).toHaveProperty('state');
    });

    it("List Attendants ==> Should return Attendants list", async () => {
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
                .mockName('AttendantController:list() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendantController:list() ->  Mock response json function')
        }

        // act
        const result: any = await sut.list(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseListType<AttendantType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data[0]).toHaveProperty('id');
        expect(json.data[0]).toHaveProperty('name');
        expect(json.data[0]).toHaveProperty('cpf');
        expect(json.data[0]).toHaveProperty('email');
        expect(json.data[0]).not.toHaveProperty('_password');
        expect(json.data[0]).not.toHaveProperty('password');
        expect(json.data[0]).toHaveProperty('roleId');
        expect(json.data[0]).toHaveProperty('city');
        expect(json.data[0]).toHaveProperty('state');
    });

    it("Update Attendant ==> Should update a specific Attendant by ID", async () => {
        // arrange
        const DEFAULT_ATTENDANT_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const NEW_PROPERTY_VALUES: Partial<AttendantType> = {
            name: 'Usuário editado',
            cpf: '78945612300'
        };

        const request: Partial<Request> = {
            params: {
                id: mockedUsers.attendants[0].id ?? DEFAULT_ATTENDANT_ID_FOR_TESTS
            },
            body: NEW_PROPERTY_VALUES
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendantController:update() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendantController:update() ->  Mock response json function')
        }

        // act
        const result: any = await sut.update(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<AttendantType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('name');
        expect(json.data).toHaveProperty('cpf');
        expect(json.data).toHaveProperty('email');
        expect(json.data).not.toHaveProperty('_password');
        expect(json.data).not.toHaveProperty('password');
        expect(json.data).toHaveProperty('roleId');
        expect(json.data).toHaveProperty('city');
        expect(json.data).toHaveProperty('state');
        expect(json.data.name).toBe(NEW_PROPERTY_VALUES.name);
        expect(json.data.cpf).toBe(NEW_PROPERTY_VALUES.cpf);
    });
});

describe("Attendant controller EXPECTED ERRORS", () => {
    const sut: AttendantController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("Retrieve Attendant ==> Should return error Attendant not found", async () => {
        // arrange
        const INVALID_ATTENDANT_ID_FOR_TESTS: string = 'invalid';
        const request: Partial<Request> = {
            params: {
                id: INVALID_ATTENDANT_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendantController:retrieve() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendantController:retrieve() ->  Mock response json function')
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
        expect(json.error.message).toBe(`No attendants found with param ${INVALID_ATTENDANT_ID_FOR_TESTS}.`);
    });

    it("Update Attendant ==> Should return an error Attendant not found", async () => {
        // arrange
        const INVALID_ATTENDANT_ID_FOR_TESTS: string = 'invalidID';
        const NEW_PROPERTY_VALUES: Partial<AttendantType> = {
            name: 'Usuário editado',
            cpf: '78945612300'
        };

        const request: Partial<Request> = {
            params: {
                id: INVALID_ATTENDANT_ID_FOR_TESTS
            },
            body: NEW_PROPERTY_VALUES
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AttendantController:update() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AttendantController:update() ->  Mock response json function')
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
        expect(json.error.message).toBe(`No attendants found with id ${INVALID_ATTENDANT_ID_FOR_TESTS}.`)
    });
});