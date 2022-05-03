import { TokenType } from "@/src/domain/authentication/jwt/tokens/entities/token.entity";

const items: TokenType[] = [
    {
        id: '625cc239a816t93465aaa470',
        userId: '625cc239a814e93465aaa470',
        accessToken: 'asdasdasdaswegg3j3',
        expiresIn: 3600,
        revoked: false
    }
];


const mockedTokens = {
    items
};

export default mockedTokens;