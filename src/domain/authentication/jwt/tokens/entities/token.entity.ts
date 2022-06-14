import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import CustomError from '@/src/http/errors/customError';
import tokenErrors from '../errors/token.errors';
import { AbstractUserDtoType } from '@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper';

abstract class Token {
    private constructor() { }

    static generate(data: Partial<AbstractUserDtoType>): string {
        const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? 60 * 60 * 24;
        const JWT_SECRET = process.env.JWT_SECRET ?? '';

        const token = jsonwebtoken.sign(
            { data },
            JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: EXPIRES_IN
            }
        );

        return token;
    }

    static verify(token: string): JwtPayload | undefined {
        const JWT_SECRET = process.env.JWT_SECRET ?? '';

        try {
            return jsonwebtoken.verify(token, JWT_SECRET) as JwtPayload;
        } catch (error) {
            if (error instanceof jsonwebtoken.JsonWebTokenError) {
                throw new CustomError(401, tokenErrors[error.message] ?? 'Invalid token.');
            }
        }
    }
}

export default Token;
