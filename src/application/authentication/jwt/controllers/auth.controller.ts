import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import { Request, Response } from "express";
import IAuthService, { CredentialsType } from "../services/auth.interface";
import { SignInResponseType } from "../services/auth.service";

class AuthController {
    private readonly _service: IAuthService;
    constructor(service: IAuthService) {
        this._service = service;
    }

    async signIn(request: Request, response: Response) {
        const data: CredentialsType = request.body;

        try {
            const accessToken: SignInResponseType = await this._service.signIn(data);
            const responseJson: ApiJsonResponseCreateType<SignInResponseType> = {
                message: `Autenticado com sucesso.`,
                data: accessToken
            };

            return response
                .status(200)
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

export default AuthController;