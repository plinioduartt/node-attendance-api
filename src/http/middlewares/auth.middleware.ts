import Token from "@/src/domain/authentication/jwt/tokens/entities/token.entity";
import roles from "@/src/domain/users/enums/roles.enum";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import CustomError from "../errors/customError";
import ApiJsonErrorType from "../types/api-errors/api-error-response.type";

/**
 * Requires authentication header
 */

const RequireAuthenticationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const { authorization } = request.headers;

    try {
        if (!authorization) {
            throw new CustomError(401, 'Authorization header is missing.');
        }

        const TOKEN_TO_VERIFY: string = authorization?.replace('Bearer ', '') ?? "";

        Token.verify(TOKEN_TO_VERIFY);
        return next();
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
};

export default RequireAuthenticationMiddleware;