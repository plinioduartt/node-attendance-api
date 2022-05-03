import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import { TokenDtoType } from "@/src/infrastructure/authentication/jwt/presenters/mappers/jwt.mapper";
import { Request, Response } from "express";
import IJwtService, { CredentialsType } from "../services/jwt.interface";

class JwtController {
    private readonly _service: IJwtService;
    constructor(service: IJwtService) {
        this._service = service;
    }

    async signIn(request: Request, response: Response) {
        const data: CredentialsType = request.body;

        try {
            const token: TokenDtoType = await this._service.signIn(data);
            const responseJson: ApiJsonResponseCreateType<TokenDtoType> = {
                message: `Autenticado com sucesso.`,
                data: token
            };

            return response
                .status(201)
                .json(responseJson);
        } catch (error: any) {
            const errorJson: ApiJsonErrorType = {
                error: {
                    message: error.message,
                    stack: error.stack
                }
            };

            return response
                .status(error.status || 500)
                .json(errorJson);
        }
    }
}

export default JwtController;