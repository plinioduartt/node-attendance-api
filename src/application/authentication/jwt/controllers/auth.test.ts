import AbstractUserService from "@/src/application/users/abstract-users/services/abstract-user.service";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import AbstractUserRepository from "@/src/infrastructure/users/abstract-users/database/in-memory/repositories/abstract-user.repository";
import ClientSocket from "@/src/tcp/socket/socket.io/client";
import { Request, Response } from "express";
import { CredentialsType } from "../services/auth.interface";
import AuthService, { SignInResponseType } from "../services/auth.service";
import AuthController from "./auth.controller";

jest.setTimeout(50000);

function sutFactory() {
    const abstractUserRepository = new AbstractUserRepository();
    const abstractUserService = new AbstractUserService(abstractUserRepository);
    const service = new AuthService({
        service: abstractUserService
    });
    return new AuthController(service);
}
describe("Auth Controller", () => {
    const sut: AuthController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        ClientSocket.closeSocket();
    });

    it("SignIn ==> Should authenticate a user when valid credentials", async () => {
        // arrange
        const request: Partial<Request> = {
            body: {
                email: 'teste@gmail.com',
                password: '123456',
            } as CredentialsType
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('TokenController:SignIn() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('TokenController:SignIn() ->  Mock response json function')
        }

        // act
        const result: any = await sut.signIn(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<SignInResponseType> = result.json.mock.calls[0][0];

        // assertions
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(200);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('accessToken');
    });
});

describe("Auth Controller EXPECTED ERRORS", () => {
    const sut: AuthController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it("SignIn ==> Should return a error when invalid credentials", async () => {
        // arrange
        const request: Partial<Request> = {
            body: {
                email: 'teste@gmail.com',
                password: 'invalidCredentials', // where valids corresponds to "123456" in this tests case
            } as CredentialsType
        };

        const response: Partial<Response> = {
            status: jest.fn()
                .mockReturnValue((code: number) => code)
                .mockReturnThis()
                .mockName('TokenController:SignIn() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('TokenController:SignIn() ->  Mock response json function')
        }

        // act
        const result: any = await sut.signIn(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonErrorType = result.json.mock.calls[0][0];

        // assertions
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(401);
        expect(json).toHaveProperty('error');
        expect(json.error).toHaveProperty('message');
        expect(json.error.message).toBe(`Invalid credentials.`);

    });
});