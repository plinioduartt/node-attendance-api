import AbstractUserService from "@/src/application/users/abstract-users/services/abstract-user.service";
import JwtRepository from "@/src/infrastructure/authentication/jwt/database/in-memory/repositories/jwt.repository";
import AbstractUserRepository from "@/src/infrastructure/users/abstract-users/database/in-memory/repositories/abstract-user.repository";
import { CredentialsType } from "./jwt.interface";
import JwtService from "./jwt.service";

jest.setTimeout(50000);

function sutFactory() {
    const tokenRepository: JwtRepository = new JwtRepository();
    const abstractUserRepository = new AbstractUserRepository();
    const abstractUserService: AbstractUserService = new AbstractUserService(abstractUserRepository);
    const service: JwtService = new JwtService({
        repository: tokenRepository,
        service: abstractUserService
    });
    return service;
}

describe('JWT Services', () => {
    const sut: JwtService = sutFactory();
    const credentials: CredentialsType = {
        email: 'teste@gmail.com',
        password: '123456'
    };

    it('SignIn ==> Should authenticate an user when valid credentials', async () => {
        // arrange

        // act
        const response = await sut.signIn(credentials);

        // assertions
        expect(response).toBeTruthy();
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('userId');
        expect(response).toHaveProperty('accessToken');
        expect(response).toHaveProperty('expiresIn');
        expect(response).toHaveProperty('revoked');
    });
});

describe('JWT Services EXPECTED ERRORS', () => {
    const sut: JwtService = sutFactory();
    const credentials: CredentialsType = {
        email: 'teste@gmail.com',
        password: 'invalidCredentials' // where valids corresponds to "123456" in this tests case
    };

    it('SignIn ==> Should return an error when invalid credentials', async () => {
        // arrange

        // act
        const request = async () => await sut.signIn(credentials);

        // assertions
        expect(request).rejects.toThrowError(`Invalid credentials.`);
    });
});