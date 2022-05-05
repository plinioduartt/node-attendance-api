import Token from './token.entity';
import { omit } from 'lodash';
import { JwtPayload } from 'jsonwebtoken';
import { AbstractUserDtoType } from '@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper';

jest.setTimeout(50000);

describe('Token Entity', () => {
    it("should generate an valid access token", () => {
        // arr
        const userData = {
            name: 'teste',
            email: 'teste',
            cpf: 'teste',
            city: 'teste',
            state: 'teste',
        };

        // act
        const token = Token.generate(omit(userData, ['password', 'roleId']) as AbstractUserDtoType);

        // asserts
        expect(token).toBeTruthy();
        expect(token).not.toBeNull();
    });

    it("should verify a valid token", async () => {
        // arr
        const userData = {
            name: 'teste',
            email: 'teste',
            cpf: 'teste',
            city: 'teste',
            state: 'teste',
        };

        // act
        const token: string = Token.generate(omit(userData, ['password', 'roleId']) as AbstractUserDtoType);
        const payload: JwtPayload = Token.verify(token) as JwtPayload;

        // asserts
        expect(token).toBeTruthy();
        expect(token).not.toBeNull();
        expect(payload).toBeTruthy();
        expect(payload).toHaveProperty('data');
        expect(payload).toHaveProperty('exp');
        expect(payload.data).toHaveProperty('name');
        expect(payload.data).toHaveProperty('email');
    });
});

describe('Token Entity EXPECTED ERRORS', () => {
    it("should return a error when verify a expired token", async () => {
        // arr
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJ0ZXN0ZSIsImVtYWlsIjoidGVzdGUiLCJjcGYiOiJ0ZXN0ZSIsImNpdHkiOiJ0ZXN0ZSIsInN0YXRlIjoidGVzdGUifSwiaWF0IjoxNjUwOTM1MzgzLCJleHAiOjE2NTA5MzUzODR9.XyxzbqdIJ5VkiURIh05jyq8HXPlrUqgSaogoffcwCl0';

        // act
        const request = () => Token.verify(expiredToken);

        // asserts
        expect(request).toThrowError('Expired token.');
    });
});