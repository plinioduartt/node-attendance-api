import crypto from 'node:crypto';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import IsValidInstanceType from "@/src/domain/users/_commons/types/isValidInstance.type";
import { AbstractUser } from '@/src/domain/users/entity';
import CustomError from '@/src/http/errors/customError';
import tokenErrors from '../errors/token.errors';
// import { omit } from 'lodash';

export type TokenType = {
    id?: string;
    userId: string;
    accessToken: string;
    expiresIn: number;
    revoked: boolean;
}

class Token {
    private _id: string;
    public userId: string;
    public accessToken: string;
    private _expiresIn: number;
    private _revoked: boolean;

    private constructor({
        id,
        userId,
        accessToken,
        expiresIn,
        revoked
    }: TokenType) {
        this._id = id ?? crypto.randomUUID();
        this.userId = userId;
        this.accessToken = accessToken;
        this._expiresIn = expiresIn;
        this._revoked = revoked;
    }

    static generate(data: AbstractUser): string {
        const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? 60 * 60;
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
                throw new CustomError(401, tokenErrors[error.message] ?? 'Unexpected error while verifying jwt token.');
            }
        }
    }

    static async create(data: TokenType): Promise<Token> {
        return new Token(data);
    }

    isValidInstance(): IsValidInstanceType {
        const propertyNames = Object.getOwnPropertyNames(this);
        const errors = propertyNames
            .map(property => this[property as keyof Token] != null ? null : `property ${property} is missing.`)
            .filter(item => !!item);

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    get id(): string {
        return this._id;
    }

    get expiresIn(): number {
        return this._expiresIn;
    }

    get isRevoked(): boolean {
        return this._revoked;
    }
}

export default Token;

// (async () => {
//     const data = {
//         name: 'teste',
//         email: 'teste',
//         cpf: 'teste',
//         city: 'teste',
//         state: 'teste',
//     };

//     const token = Token.generate(omit(data, ['password', 'roleId']) as AbstractUser);
//     console.info(`generated jwt token ==> ${token}`);

//     setTimeout(() => {
//         const valid = Token.verify(token);
//         console.info(`valid token ???? ${JSON.stringify(valid)}`);
//     }, 2000);
// })()
