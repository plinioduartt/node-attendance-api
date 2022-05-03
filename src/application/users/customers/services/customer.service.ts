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

    async list(): Promise<CustomerDtoType[]> {
        const customers: CustomerDtoType[] = await this._repository.list();
        return customers;
    }

    async create(data: CustomerType): Promise<CustomerDtoType> {
        const newCustomerInstance: Customer = await Customer.create(data);
        const newCustomer: CustomerDtoType = await this._repository.create(newCustomerInstance);
        return newCustomer;
    }

    async retrieve(param: string): Promise<CustomerDtoType> {
        const customerFound: CustomerDtoType | undefined = await this._repository.retrieve(param);

        if (!customerFound) {
            throw new CustomError(404, `No customers found with param ${param}.`);
        }

        return customerFound;
    }

    async update(id: string, data: CustomerType): Promise<CustomerDtoType> {
        const customerFound: CustomerDtoType | undefined = await this._repository.retrieve(id);

        if (!customerFound) {
            throw new CustomError(404, `No customers found with id ${id}.`);
        }

        const updatedCustomer: CustomerType = await Customer.update(data);
        const customer: CustomerDtoType = await this._repository.update(id, updatedCustomer);
        return customer;
    }
}

export default CustomerService;