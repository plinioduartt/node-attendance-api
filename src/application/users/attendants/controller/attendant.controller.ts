import { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import ApiJsonResponseListType from "@/src/http/types/api-responses/api-json-response-list.type";
import ApiJsonResponseRetrieveType from "@/src/http/types/api-responses/api-json-response-retrieve.type";
import { AttendantDtoType } from "@/src/infrastructure/users/attendants/presenters/mappers/attendant.mapper";
import { Request, Response } from "express";
import IAttendantService from "../services/attendant.interface";

class AttendantController {
    private readonly _service: IAttendantService;
    constructor(AttendantService: IAttendantService) {
        this._service = AttendantService;
    }

    async list(request: Request, response: Response) {
        try {
            const Attendants: AttendantDtoType[] = await this._service.list();
            const responseJson: ApiJsonResponseListType<AttendantDtoType> = {
                data: Attendants,
                // Still need to set pagination props like offset, limit, etc...
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

    async create(request: Request, response: Response) {
        const data: AttendantType = request.body;

        try {
            const newAttendant: AttendantDtoType = await this._service.create(data);
            const responseJson: ApiJsonResponseCreateType<AttendantDtoType> = {
                message: `Conta criada com sucesso.`,
                data: newAttendant
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

    async retrieve(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const Attendant: AttendantDtoType = await this._service.retrieve(id);
            const responseJson: ApiJsonResponseRetrieveType<AttendantDtoType> = {
                data: Attendant
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

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const data: AttendantType = request.body;

        try {
            const Attendant: AttendantDtoType = await this._service.update(id, data);
            const responseJson: ApiJsonResponseCreateType<AttendantDtoType> = {
                message: `Dados atualizados com sucesso.`,
                data: Attendant
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

export default AttendantController;