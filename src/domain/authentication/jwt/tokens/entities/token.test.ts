import Token, { TokenType } from './token.entity';
import { omit } from 'lodash';
import { JwtPayload } from 'jsonwebtoken';
import { AbstractUser } from '@/src/domain/users/abstract-users/entities/abstract-user';
import { AbstractUserDtoType } from '@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper';

jest.setTimeout(50000);

describe('Token Entity', () => {
    const TokenData: TokenType = {
        userId: 'string',
        accessToken: 'string',
        expiresIn: Number(process.env.JWT_EXPIRES_IN) ?? 60 * 60,
        revoked: false
    };

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

    it("should return a error when verify a expired token", async () => {
        // arr
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJ0ZXN0ZSIsImVtYWlsIjoidGVzdGUiLCJjcGYiOiJ0ZXN0ZSIsImNpdHkiOiJ0ZXN0ZSIsInN0YXRlIjoidGVzdGUifSwiaWF0IjoxNjUwOTM1MzgzLCJleHAiOjE2NTA5MzUzODR9.XyxzbqdIJ5VkiURIh05jyq8HXPlrUqgSaogoffcwCl0';

        // act
        const request = () => Token.verify(expiredToken);

        // asserts
        expect(request).toThrowError('Token expirado.');
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
        const token = Token.generate(omit(userData, ['password', 'roleId']) as AbstractUserDtoType);
        const payload = Token.verify(token) as JwtPayload;

        // asserts
        expect(token).toBeTruthy();
        expect(token).not.toBeNull();
        expect(payload).toBeTruthy();
        expect(payload).toHaveProperty('data');
        expect(payload).toHaveProperty('exp');
        expect(payload.data).toHaveProperty('name');
        expect(payload.data).toHaveProperty('email');
    });

    it("should create a valid Token instance", async () => {
        // arrange
        const newToken = await Token.create(TokenData);

        // act
        const { isValid } = newToken.isValidInstance();

        // asserts
        expect(isValid).toBeTruthy();
        expect(newToken).toBeInstanceOf(Token);
        expect(newToken).toHaveProperty('userId');
        expect(newToken).toHaveProperty('accessToken');
        expect(newToken).toHaveProperty('revoked');
        expect(newToken).toHaveProperty('_revoked');
        expect(newToken).toHaveProperty('expiresIn');
    });

    it("should return an error when missing a property", async () => {
        // arrange
        const MISSED_PROPERTY = 'revoked';
        const MISSED_PROPERTY_EXPECTED = '_revoked';
        const newToken = await Token.create(omit(TokenData, [MISSED_PROPERTY]) as TokenType);

        // act
        const { isValid, errors } = newToken.isValidInstance();

        // asserts
        expect(isValid).toBeFalsy();
        expect(errors).toEqual(expect.arrayContaining([`property ${MISSED_PROPERTY_EXPECTED} is missing.`]));
    });
});