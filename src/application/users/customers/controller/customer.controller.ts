import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import ApiJsonResponseListType from "@/src/http/types/api-responses/api-json-response-list.type";
import ApiJsonResponseRetrieveType from "@/src/http/types/api-responses/api-json-response-retrieve.type";
import { CustomerDtoType } from "@/src/infrastructure/users/customers/presenters/mappers/customer.mapper";
import { Request, Response } from "express";
import ICustomerService from "../services/customer.interface";

class CustomerController {
    private readonly _service: ICustomerService;
    constructor(customerService: ICustomerService) {
        this._service = customerService;
    }

    async list(request: Request, response: Response) {
        try {
            const customers: CustomerDtoType[] = await this._service.list();
            const responseJson: ApiJsonResponseListType<CustomerDtoType> = {
                data: customers,
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
        const data: CustomerType = request.body;

        try {
            const newCustomer: CustomerDtoType = await this._service.create(data);
            const responseJson: ApiJsonResponseCreateType<CustomerDtoType> = {
                message: `Conta criada com sucesso.`,
                data: newCustomer
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
            const customer: CustomerDtoType = await this._service.retrieve(id);
            const responseJson: ApiJsonResponseRetrieveType<CustomerDtoType> = {
                data: customer
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
        const data: CustomerType = request.body;

        try {
            const customer: CustomerDtoType = await this._service.update(id, data);
            const responseJson: ApiJsonResponseCreateType<CustomerDtoType> = {
                message: `Dados atualizados com sucesso.`,
                data: customer
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

export default CustomerController;