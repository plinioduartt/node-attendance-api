import Customer, { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import ICustomerRepository from "@/src/domain/users/customers/repository/repository.interface";
import CustomError from "@/src/http/errors/customError";
import { CustomerDtoType } from "@/src/infrastructure/users/customers/presenters/mappers/customer.mapper";
import ICustomerService from "./customer.interface";

class CustomerService implements ICustomerService {
    private readonly _repository: ICustomerRepository;
    constructor(repository: ICustomerRepository) {
        this._repository = repository;
    }

    async create(data: CustomerType): Promise<CustomerDtoType> {
        const newCustomerInstance = await Customer.create(data);
        const newCustomer = await this._repository.create(newCustomerInstance);
        return newCustomer;
    }

    async retrieve(id: string): Promise<CustomerDtoType> {
        const customerFound = await this._repository.retrieve(id);

        if (!customerFound) {
            throw new CustomError(404, `No customers found with id ${id}.`);
        }
        return customerFound
    }
}

export default CustomerService;