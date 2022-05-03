import IAbstractUserService from "@/src/application/users/abstract-users/services/abstract-user.interface";
import Token from "@/src/domain/authentication/jwt/tokens/entities/token.entity";
import IJwtRepository from "@/src/domain/authentication/jwt/tokens/repository/jwt.repository";
import User from "@/src/domain/users/abstract-users/entities/abstract-user";
import CustomError from "@/src/http/errors/customError";
import { TokenDtoType } from "@/src/infrastructure/authentication/jwt/presenters/mappers/jwt.mapper";
import { AbstractUserDtoType } from "@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper";
import IJwtService, { CredentialsType } from "./jwt.interface";

type InjectTypes = {
    service: IAbstractUserService;
    repository: IJwtRepository
}

class JwtService implements IJwtService {
    private _abstractUserService: IAbstractUserService;
    private _repository: IJwtRepository;
    constructor({ service, repository }: InjectTypes) {
        this._abstractUserService = service;
        this._repository = repository;
    }

    async signIn(credentials: CredentialsType): Promise<TokenDtoType> {
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
        const newTokenInstance: Token = await Token.create({
            userId: userFound.id ?? 'invalidID',
            accessToken,
            expiresIn: Number(process.env.JWT_EXPIRES_IN) ?? 60 * 60,
            revoked: false
        });
        const newToken: TokenDtoType = await this._repository.create(newTokenInstance);
        return newToken;
    }

    async signOut(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default JwtService;