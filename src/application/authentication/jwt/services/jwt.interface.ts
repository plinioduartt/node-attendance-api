import { TokenDtoType } from "@/src/infrastructure/authentication/jwt/presenters/mappers/jwt.mapper";

export type CredentialsType = {
    email: string;
    password: string;
};

interface IJwtService {
    signIn(credentials: CredentialsType): Promise<TokenDtoType>;
    signOut(): Promise<void>;
}

export default IJwtService;