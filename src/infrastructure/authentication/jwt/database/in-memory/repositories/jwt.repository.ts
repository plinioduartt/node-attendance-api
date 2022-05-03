import { TokenType } from "@/src/domain/authentication/jwt/tokens/entities/token.entity";
import IJwtRepository from "@/src/domain/authentication/jwt/tokens/repository/jwt.repository";
import JwtMapper, { TokenDtoType } from "../../../presenters/mappers/jwt.mapper";

class JwtRepository implements IJwtRepository {
    public tokens: TokenType[] = [];

    async list(): Promise<TokenDtoType[]> {
        return this.tokens;
    }

    async create(data: TokenType): Promise<TokenDtoType> {
        // insert Token into database
        this.tokens.push(data);

        // Adapter:Converting the internal data type to an http external data type that clients expects
        // map the properties of the Token as dto
        const mappedToken = await JwtMapper.domainToDto(data);
        return mappedToken;
    }

    async retrieve(param: string): Promise<TokenDtoType | undefined> {
        const Token: TokenDtoType & TokenType | undefined = this.tokens.find(item => item.id === param);
        if (!!Token) {
            const mappedToken = await JwtMapper.domainToDto(Token);
            return mappedToken;
        }
        return Token;
    }

    async update(id: string, data: TokenType): Promise<TokenDtoType> {
        const index = this.tokens.findIndex(item => item.id === id);
        this.tokens[index] = {
            ...this.tokens[index],
            ...data
        };
        const updatedUser = this.tokens[index];
        const mappedToken = await JwtMapper.domainToDto(updatedUser);
        return mappedToken;
    }
}

export default JwtRepository;