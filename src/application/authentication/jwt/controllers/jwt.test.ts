import AbstractUserService from "@/src/application/users/abstract-users/services/abstract-user.service";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import JwtRepository from "@/src/infrastructure/authentication/jwt/database/in-memory/repositories/jwt.repository";
import { TokenDtoType } from "@/src/infrastructure/authentication/jwt/presenters/mappers/jwt.mapper";
import AbstractUserRepository from "@/src/infrastructure/users/abstract-users/database/in-memory/repositories/abstract-user.repository";
import { Request, Response } from "express";
import { CredentialsType } from "../services/jwt.interface";
import JwtService from "../services/jwt.service";
import JwtController from "./jwt.controller";

jest.setTimeout(50000);

function sutFactory() {
    const abstractUserRepository = new AbstractUserRepository();
    const abstractUserService = new AbstractUserService(abstractUserRepository);
    const tokenRepository = new JwtRepository();
    const service = new JwtService({
        repository: tokenRepository,
        service: abstractUserService
    });
    return new JwtController(service);
}
describe("JWT Controller", () => {
    const sut: JwtController = sutFactory();

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.resetAllMocks();
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
                .mockName('JwtController:SignIn() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('JwtController:SignIn() ->  Mock response json function')
        }

        // act
        const result: any = await sut.signIn(request as Request, response as Response);
        const statusCode: number = result.status.mock.calls[0][0];
        const json: ApiJsonResponseCreateType<TokenDtoType> = result.json.mock.calls[0][0];

        // assertions
        expect(response.status).toBeCalledTimes(1);
        expect(response.json).toBeCalledTimes(1);
        expect(statusCode).toBe(201);
        expect(json).toHaveProperty('data');
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('userId');
        expect(json.data).toHaveProperty('accessToken');
        expect(json.data).toHaveProperty('expiresIn');
        expect(json.data).toHaveProperty('revoked');
    });
});

describe("JWT Controller EXPECTED ERRORS", () => {
    const sut: JwtController = sutFactory();

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
                .mockName('JwtController:SignIn() ->  Mock response status function'),
            json: jest.fn()
                .mockReturnValue((data: unknown) => data)
                .mockReturnThis()
                .mockName('JwtController:SignIn() ->  Mock response json function')
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