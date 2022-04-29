import ApiJsonErrorType from "@/src/http/types/api-errors/api-error-response.type";
import ApiJsonResponseCreateType from "@/src/http/types/api-responses/api-json-response-create.type";
import ApiJsonResponseRetrieveType from "@/src/http/types/api-responses/api-json-response-retrieve.type";
import { CustomerDtoType } from "@/src/infrastructure/users/customers/presenters/mappers/customer.mapper";
import { Request, Response } from "express";
import ICustomerService from "../services/customer.interface";

class CustomerController {
    private readonly _service: ICustomerService;
    constructor(customerService: ICustomerService) {
        this._service = customerService;
    }

    async create(request: Request, response: Response) {
        const data = request.body;

        try {
            const newUser = await this._service.create(data);
            const responseJson: ApiJsonResponseCreateType<CustomerDtoType> = {
                message: `Conta criada com sucesso.`,
                data: newUser
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
                .status(500)
                .json(errorJson);
        }
    }

    async retrieve(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const newUser = await this._service.retrieve(id);
            const responseJson: ApiJsonResponseRetrieveType<CustomerDtoType> = {
                data: newUser
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
                .status(500)
                .json(errorJson);
        }
    }
}

export default CustomerController;