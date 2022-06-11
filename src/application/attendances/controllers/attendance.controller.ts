import { AttendanceType } from "@/src/domain/attendances/entities/attendance.entity";
import { MessageType } from "@/src/domain/attendances/messages/entities/message.entity";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import ApiJsonResponseListType from "@/src/http/types/api-responses/api-json-response-list.type";
import ApiJsonResponseRetrieveType from "@/src/http/types/api-responses/api-json-response-retrieve.type";
import { MessageDtoType } from "@/src/infrastructure/attendances/messages/presenters/mappers/message.mapper";
import { AttendanceDtoType } from "@/src/infrastructure/attendances/presenters/mappers/attendance.mapper";
import Hateoas from "@/src/infrastructure/framework/express/Hateoas";
import attendancesRouter from "@/src/routes/attendances/attendances.route";
import { Request, Response } from "express";
import IAttendanceService from "../services/attendance.interface";

class AttendanceController {
    private readonly _service: IAttendanceService;

    constructor(AttendanceService: IAttendanceService) {
        this._service = AttendanceService;
    }

    async list(request: Request, response: Response) {
        try {
            const attendances: AttendanceDtoType[] = await this._service.list();
            
            const involvedEachEndpoints: string[] = [
                'retrieve',
                'close',
                'update',
                'writeMessage',
                'listMessages',
            ]
            const attendancesWithCollection: AttendanceDtoType[] = await Hateoas.injectEachCollection<AttendanceDtoType>({
                basePath: '/attendances',
                router: attendancesRouter,
                param: 'id',
                selfIdentity: 'retrieve',
                items: attendances,
                involvedEndpoints: involvedEachEndpoints
            })

            const fakeLastPage = 10
            const fakeCurrentPage = 1
            const involvedRootEndpoints: string[] = [
                'list',
            ]
            const rootCollection: any = await Hateoas.getRootCollection({
                involvedEndpoints: involvedRootEndpoints,
                basePath: '/attendances',
                router: attendancesRouter,
                selfIdentity: 'list',
                // param: 'id',
                // paramValue: '123',
                withPagination: true,
                lastPage: fakeLastPage,
                currentPage: fakeCurrentPage
            })

            const responseJson: ApiJsonResponseListType<AttendanceDtoType> = {
                data: attendancesWithCollection,
                ...rootCollection
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

    async open(request: Request, response: Response) {
        const data: AttendanceType = request.body;

        try {
            const newAttendance: AttendanceDtoType = await this._service.open(data);
            const responseJson: ApiJsonResponseCreateType<AttendanceDtoType> = {
                message: `Atendimento iniciado com sucesso.`,
                data: newAttendance
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

    async close(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const newAttendance: AttendanceDtoType = await this._service.close(id);
            const responseJson: ApiJsonResponseCreateType<AttendanceDtoType> = {
                message: `Atendimento encerrado com sucesso.`,
                data: newAttendance
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

    async retrieve(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const Attendance: AttendanceDtoType = await this._service.retrieve(id);
            const responseJson: ApiJsonResponseRetrieveType<AttendanceDtoType> = {
                data: Attendance
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
        const data: AttendanceType = request.body;

        try {
            const Attendance: AttendanceDtoType = await this._service.update(id, data);
            const responseJson: ApiJsonResponseCreateType<AttendanceDtoType> = {
                message: `Dados atualizados com sucesso.`,
                data: Attendance
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

    async writeMessage(request: Request, response: Response) {
        const { id } = request.params;
        const data: MessageType = request.body;

        try {
            const message: MessageDtoType = await this._service.writeMessage(id, data);
            const responseJson: ApiJsonResponseCreateType<MessageDtoType> = {
                message: `Mensagem salva com sucesso.`,
                data: message
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

    async listMessages(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const messages: MessageDtoType[] = await this._service.listMessages(id);
            const responseJson: ApiJsonResponseListType<MessageDtoType> = {
                data: messages
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

export default AttendanceController;