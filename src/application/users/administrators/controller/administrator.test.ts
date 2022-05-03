import { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";
import roles from "@/src/domain/users/enums/roles.enum";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import ApiJsonResponseListType from "@/src/http/types/api-responses/api-json-response-list.type";
import ApiJsonResponseRetrieveType from "@/src/http/types/api-responses/api-json-response-retrieve.type";
import AdministratorRepository from "@/src/infrastructure/users/administrators/database/in-memory/repositories/administrator.repository";
import mockedUsers from "@/src/mock/users/users-list.mock";
import { Request, Response } from "express";
import AdministratorService from "../services/administrator.service";
import AdministratorController from "./administrator.controller";

jest.setTimeout(50000);

function sutFactory() {
    const repository = new AdministratorRepository();
    const service = new AdministratorService(repository);
    return new AdministratorController(service);
}

describe("Administrator controller", () => {
    const sut: AdministratorController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("Create Administrator ==> Should create a new valid administrator", async () => {
        // arrange
        const request: Partial<Request> = {
            body: {
                name: 'Plinio Duarte',
                email: 'plinio.duartes@hotmail.com',
                password: '123456',
                city: 'Paulínia',
                state: 'SP',
                roleId: roles.ADMINISTRATOR
            } as AdministratorType
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AdministratorController:create() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AdministratorController:create() ->  Mock response json function')
        }

        // act
        const result: any = await sut.create(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<AdministratorType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(201);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('name');
        expect(json.data).toHaveProperty('email');
        expect(json.data).not.toHaveProperty('_password');
        expect(json.data).toHaveProperty('roleId');
        expect(json.data).toHaveProperty('city');
        expect(json.data).toHaveProperty('state');
    });

    it("Retrieve Administrator ==> Should return a administrator by id", async () => {
        // arrange
        const DEFAULT_ADMINISTRATOR_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const request: Partial<Request> = {
            params: {
                id: mockedUsers.administrators[0].id ?? DEFAULT_ADMINISTRATOR_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AdministratorController:retrieve() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AdministratorController:retrieve() ->  Mock response json function')
        }

        // act
        const result: any = await sut.retrieve(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseRetrieveType<AdministratorType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('name');
        expect(json.data).toHaveProperty('email');
        expect(json.data).not.toHaveProperty('_password');
        expect(json.data).toHaveProperty('roleId');
        expect(json.data).toHaveProperty('city');
        expect(json.data).toHaveProperty('state');
    });

    it("List Administrators ==> Should return administrators list", async () => {
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
                .mockName('AdministratorController:list() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AdministratorController:list() ->  Mock response json function')
        }

        // act
        const result: any = await sut.list(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseListType<AdministratorType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data[0]).toHaveProperty('id');
        expect(json.data[0]).toHaveProperty('name');
        expect(json.data[0]).toHaveProperty('email');
        expect(json.data[0]).not.toHaveProperty('_password');
        expect(json.data[0]).toHaveProperty('roleId');
        expect(json.data[0]).toHaveProperty('city');
        expect(json.data[0]).toHaveProperty('state');
    });

    it("Update Administrator ==> Should update a specific administrator by ID", async () => {
        // arrange
        const DEFAULT_ADMINISTRATOR_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const NEW_PROPERTY_VALUES: Partial<AdministratorType> = {
            name: 'Usuário editado'
        };

        const request: Partial<Request> = {
            params: {
                id: mockedUsers.administrators[0].id ?? DEFAULT_ADMINISTRATOR_ID_FOR_TESTS
            },
            body: NEW_PROPERTY_VALUES
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AdministratorController:update() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AdministratorController:update() ->  Mock response json function')
        }

        // act
        const result: any = await sut.update(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<AdministratorType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('name');
        expect(json.data).toHaveProperty('email');
        expect(json.data).not.toHaveProperty('_password');
        expect(json.data).toHaveProperty('roleId');
        expect(json.data).toHaveProperty('city');
        expect(json.data).toHaveProperty('state');
        expect(json.data.name).toBe(NEW_PROPERTY_VALUES.name);
    });
});

describe("Administrator controller EXPECTED ERRORS", () => {
    const sut: AdministratorController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("Retrieve Administrator ==> Should return error administrator not found", async () => {
        // arrange
        const INVALID_ADMINISTRATOR_ID_FOR_TESTS: string = 'invalid';
        const request: Partial<Request> = {
            params: {
                id: INVALID_ADMINISTRATOR_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AdministratorController:retrieve() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AdministratorController:retrieve() ->  Mock response json function')
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
        expect(json.error.message).toBe(`No administrators found with param ${INVALID_ADMINISTRATOR_ID_FOR_TESTS}.`);
    });

    it("Update Administrator ==> Should return an error administrator not found", async () => {
        // arrange
        const INVALID_ADMINISTRATOR_ID_FOR_TESTS: string = 'invalidID';
        const NEW_PROPERTY_VALUES: Partial<AdministratorType> = {
            name: 'Usuário editado'
        };

        const request: Partial<Request> = {
            params: {
                id: INVALID_ADMINISTRATOR_ID_FOR_TESTS
            },
            body: NEW_PROPERTY_VALUES
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('AdministratorController:update() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('AdministratorController:update() ->  Mock response json function')
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
        expect(json.error.message).toBe(`No administrators found with id ${INVALID_ADMINISTRATOR_ID_FOR_TESTS}.`)
    });
});