import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import roles from "@/src/domain/users/enums/roles.enum";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import ApiJsonResponseListType from "@/src/http/types/api-responses/api-json-response-list.type";
import ApiJsonResponseRetrieveType from "@/src/http/types/api-responses/api-json-response-retrieve.type";
import CustomerRepository from "@/src/infrastructure/users/customers/database/in-memory/repositories/customer.repository";
import mockedUsers from "@/src/mock/users/users-list.mock";
import { Request, Response } from "express";
import CustomerService from "../services/customer.service";
import CustomerController from "./customer.controller";

jest.setTimeout(50000);

function sutFactory() {
    const repository = new CustomerRepository();
    const service = new CustomerService(repository);
    return new CustomerController(service);
}

describe("Customer controller", () => {
    const sut: CustomerController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("Create customer ==> Should create a new valid customer", async () => {
        // arrange
        const request: Partial<Request> = {
            body: {
                name: 'Plinio Duarte',
                nickname: 'JR',
                email: 'plinio.duartes@hotmail.com',
                password: '123456',
                city: 'Paulínia',
                state: 'SP',
                roleId: roles.CUSTOMER
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('CustomerController:create() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('CustomerController:create() ->  Mock response json function')
        }

        // act
        const result: any = await sut.create(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<CustomerType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(201);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('name');
        expect(json.data).toHaveProperty('nickname');
        expect(json.data).toHaveProperty('email');
        expect(json.data).not.toHaveProperty('_password');
        expect(json.data).toHaveProperty('roleId');
        expect(json.data).toHaveProperty('city');
        expect(json.data).toHaveProperty('state');
    });

    it("Retrieve customer ==> Should return a customer by id", async () => {
        // arrange
        const DEFAULT_CUSTOMER_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const request: Partial<Request> = {
            params: {
                id: mockedUsers.customers[0].id ?? DEFAULT_CUSTOMER_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('CustomerController:retrieve() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('CustomerController:retrieve() ->  Mock response json function')
        }

        // act
        const result: any = await sut.retrieve(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseRetrieveType<CustomerType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('name');
        expect(json.data).toHaveProperty('nickname');
        expect(json.data).toHaveProperty('email');
        expect(json.data).not.toHaveProperty('_password');
        expect(json.data).toHaveProperty('roleId');
        expect(json.data).toHaveProperty('city');
        expect(json.data).toHaveProperty('state');
    });

    it("List customers ==> Should return customers list", async () => {
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
                .mockName('CustomerController:list() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('CustomerController:list() ->  Mock response json function')
        }

        // act
        const result: any = await sut.list(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseListType<CustomerType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data[0]).toHaveProperty('id');
        expect(json.data[0]).toHaveProperty('name');
        expect(json.data[0]).toHaveProperty('nickname');
        expect(json.data[0]).toHaveProperty('email');
        expect(json.data[0]).not.toHaveProperty('_password');
        expect(json.data[0]).toHaveProperty('roleId');
        expect(json.data[0]).toHaveProperty('city');
        expect(json.data[0]).toHaveProperty('state');
    });

    it("Update customer ==> Should update a specific customer by ID", async () => {
        // arrange
        const DEFAULT_CUSTOMER_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const NEW_PROPERTY_VALUES: Partial<CustomerType> = {
            name: 'Usuário editado',
            nickname: 'Editado'
        };

        const request: Partial<Request> = {
            params: {
                id: mockedUsers.customers[0].id ?? DEFAULT_CUSTOMER_ID_FOR_TESTS
            },
            body: NEW_PROPERTY_VALUES
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('CustomerController:update() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('CustomerController:update() ->  Mock response json function')
        }

        // act
        const result: any = await sut.update(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<CustomerType> = result.json.mock.calls[0][0];

        // asserts
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('name');
        expect(json.data).toHaveProperty('nickname');
        expect(json.data).toHaveProperty('email');
        expect(json.data).not.toHaveProperty('_password');
        expect(json.data).toHaveProperty('roleId');
        expect(json.data).toHaveProperty('city');
        expect(json.data).toHaveProperty('state');
        expect(json.data.name).toBe(NEW_PROPERTY_VALUES.name);
        expect(json.data.nickname).toBe(NEW_PROPERTY_VALUES.nickname);
    });
});

describe("Customer controller EXPECTED ERRORS", () => {
    const sut: CustomerController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("Retrieve customer ==> Should return error customer not found", async () => {
        // arrange
        const INVALID_CUSTOMER_ID_FOR_TESTS: string = 'invalid';
        const request: Partial<Request> = {
            params: {
                id: INVALID_CUSTOMER_ID_FOR_TESTS
            }
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('CustomerController:retrieve() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('CustomerController:retrieve() ->  Mock response json function')
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
        expect(json.error.message).toBe(`No customers found with param ${INVALID_CUSTOMER_ID_FOR_TESTS}.`);
    });

    it("Update customer ==> Should return an error customer not found", async () => {
        // arrange
        const INVALID_CUSTOMER_ID_FOR_TESTS: string = 'invalidID';
        const NEW_PROPERTY_VALUES: Partial<CustomerType> = {
            name: 'Usuário editado',
            nickname: 'Editado'
        };

        const request: Partial<Request> = {
            params: {
                id: INVALID_CUSTOMER_ID_FOR_TESTS
            },
            body: NEW_PROPERTY_VALUES
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('CustomerController:update() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('CustomerController:update() ->  Mock response json function')
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
        expect(json.error.message).toBe(`No customers found with id ${INVALID_CUSTOMER_ID_FOR_TESTS}.`)
    });
});