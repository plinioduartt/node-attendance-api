import Token from "@/src/domain/authentication/jwt/tokens/entities/token.entity";
import roles from "@/src/domain/users/enums/roles.enum";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import CustomError from "../errors/customError";
import ApiJsonErrorType from "../types/api-errors/api-error-response.type";

/**
 * Administrators only access
 */

const OnlyEmployeesMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const { authorization } = request.headers;
    const TOKEN_TO_VERIFY: string = authorization?.replace('Bearer ', '') ?? "";

    try {
        const tokenPayload: JwtPayload | undefined = Token.verify(TOKEN_TO_VERIFY);

        if (tokenPayload?.data.roleId !== roles.ADMINISTRATOR && tokenPayload?.data.roleId !== roles.ATTENDANT) {
            throw new CustomError(401, 'Unauthorized action.');
        }

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

export default OnlyEmployeesMiddleware;