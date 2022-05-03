import { TokenType } from "@/src/domain/authentication/jwt/tokens/entities/token.entity";

export type TokenDtoType = {
    id?: string | undefined;
    userId: string;
    accessToken: string;
    expiresIn: number;
    revoked: boolean;
}

const JwtMapper = {
    domainToDto: async (data: TokenType): Promise<TokenDtoType> => {
        const result: TokenDtoType = {
            id: data.id,
            userId: data.userId,
            accessToken: data.accessToken,
            expiresIn: data.expiresIn,
            revoked: data.revoked
        };

        return result;
    }
}

export default JwtMapper;