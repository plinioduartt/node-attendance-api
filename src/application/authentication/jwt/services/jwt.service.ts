import IAbstractUserService from "@/src/application/users/abstract-users/services/abstract-user.interface";
import Token from "@/src/domain/authentication/jwt/tokens/entities/token.entity";
import User from "@/src/domain/users/abstract-users/entities/abstract-user";
import CustomError from "@/src/http/errors/customError";
import { AbstractUserDtoType } from "@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper";
import IJwtService, { CredentialsType } from "./jwt.interface";

type InjectTypes = {
    service: IAbstractUserService;
}

export type SignInResponseType = {
    accessToken: string;
}

class JwtService implements IJwtService {
    private _abstractUserService: IAbstractUserService;
    constructor({ service }: InjectTypes) {
        this._abstractUserService = service;
    }

    async signIn(credentials: CredentialsType): Promise<SignInResponseType> {
        const userFound: AbstractUserDtoType = await this._abstractUserService
            .retrieve(credentials.email);

        if (!userFound) {
            throw new CustomError(404, `No user found with the given param ${credentials.email}.`);
        }

        const isCredentialsValid: boolean = await User.checkPassword({
            enteredPassword: credentials.password,
            hashedPassword: userFound.password
        });

        if (!isCredentialsValid) {
            throw new CustomError(401, `Invalid credentials.`);
        }

        const accessToken: string = Token.generate(userFound);
        return { accessToken };
    }

    async signOut(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default JwtService;