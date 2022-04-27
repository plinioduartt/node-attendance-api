import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import roles from "@/src/domain/users/enums/roles.enum";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import CustomerRepository from "@/src/infrastructure/users/customers/database/in-memory/repositories/customer.repository";
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
    const sut = sutFactory();

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
        const statusCode = result.status.mock.calls[0][0];
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
});