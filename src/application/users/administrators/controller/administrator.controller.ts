import { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import ApiJsonResponseListType from "@/src/http/types/api-responses/api-json-response-list.type";
import ApiJsonResponseRetrieveType from "@/src/http/types/api-responses/api-json-response-retrieve.type";
import IHateoas from "@/src/infrastructure/hateoas/IHateoas";
import { Hyperlink } from "@/src/infrastructure/hateoas/protocols";
import { AdministratorDtoType } from "@/src/infrastructure/users/administrators/presenters/mappers/administrator.mapper";
import { administratorEndpoints } from "@/src/routes/users/administrators.route";
import { Request, Response } from "express";
import IAdministratorService from "../services/administrator.interface";

class AdministratorController {
    private readonly _service: IAdministratorService;
    private hateoas: IHateoas<AdministratorController>;

    constructor(AdministratorService: IAdministratorService, hateoas: IHateoas<AdministratorController>) {
        this._service = AdministratorService;

        const contextName: string = '/administrators'
        this.hateoas = hateoas
        this.hateoas.registerContext(contextName)
        this.hateoas.registerEndpoints(administratorEndpoints)
    }

    async list(request: Request, response: Response) {
        try {
            const administrators: AdministratorDtoType[] = await this._service.list();

            const attendancesWithCollection: AdministratorDtoType[] =
                await this.hateoas
                    .injectEachCollection<AdministratorDtoType>({
                        selfIdentity: 'retrieve',
                        items: administrators,
                        involvedEndpoints: [
                            'retrieve',
                            'create',
                            'update',
                        ]
                    })

            const fakeLastPage = 10
            const fakeCurrentPage = 1
            const rootCollection: Hyperlink =
                await this.hateoas.getRootCollection({
                    selfIdentity: 'list',
                    // param: 'id',
                    // paramValue: '123',
                    withPagination: true,
                    lastPage: fakeLastPage,
                    currentPage: fakeCurrentPage,
                    involvedEndpoints: [
                        'list',
                        // 'retrieve'
                    ]
                })

            const responseJson: ApiJsonResponseListType<AdministratorDtoType> = {
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

    async create(request: Request, response: Response) {
        const data: AdministratorType = request.body;

        try {
            const newAdministrator: AdministratorDtoType = await this._service.create(data);
            const responseJson: ApiJsonResponseCreateType<AdministratorDtoType> = {
                message: `Conta criada com sucesso.`,
                data: newAdministrator
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
            const Administrator: AdministratorDtoType = await this._service.retrieve(id);
            const responseJson: ApiJsonResponseRetrieveType<AdministratorDtoType> = {
                data: Administrator
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
        const data: AdministratorType = request.body;

        try {
            const Administrator: AdministratorDtoType = await this._service.update(id, data);
            const responseJson: ApiJsonResponseCreateType<AdministratorDtoType> = {
                message: `Dados atualizados com sucesso.`,
                data: Administrator
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

export default AdministratorController;