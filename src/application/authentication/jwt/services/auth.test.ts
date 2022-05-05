import AbstractUserService from "@/src/application/users/abstract-users/services/abstract-user.service";
import AbstractUserRepository from "@/src/infrastructure/users/abstract-users/database/in-memory/repositories/abstract-user.repository";
import { CredentialsType } from "./auth.interface";
import AuthService, { SignInResponseType } from "./auth.service";

jest.setTimeout(50000);

function sutFactory() {
    const abstractUserRepository = new AbstractUserRepository();
    const abstractUserService: AbstractUserService = new AbstractUserService(abstractUserRepository);
    const service: AuthService = new AuthService({
        service: abstractUserService
    });
    return service;
}

describe('Auth Services', () => {
    const sut: AuthService = sutFactory();
    const credentials: CredentialsType = {
        email: 'teste@gmail.com',
        password: '123456'
    };

    it('SignIn ==> Should authenticate an user when valid credentials', async () => {
        // arrange

        // act
        const response: SignInResponseType = await sut.signIn(credentials);

        // assertions
        expect(response).toBeTruthy();
        expect(response).toHaveProperty('accessToken');
    });
});

describe('Auth Services EXPECTED ERRORS', () => {
    const sut: AuthService = sutFactory();
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