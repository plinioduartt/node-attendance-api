import { TokenDtoType } from "@/src/infrastructure/authentication/jwt/presenters/mappers/jwt.mapper";
import { TokenType } from "../entities/token.entity";

interface IJwtRepository {
    list(): Promise<TokenDtoType[]>;
    create(data: TokenType): Promise<TokenDtoType>;
    retrieve(param: string): Promise<TokenDtoType | undefined>;
    update(id: string, data: TokenType): Promise<TokenDtoType>;
}

export default IJwtRepository;