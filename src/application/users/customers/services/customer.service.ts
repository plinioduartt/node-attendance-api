import Customer, { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import ICustomerRepository from "@/src/domain/users/customers/repository/repository.interface";
import CustomError from "@/src/http/errors/customError";
import retrieveCustomerMapper, { MappedCustomer } from "@/src/infrastructure/users/customers/presenters/mappers/retrieve-customer.mapper";
import ICustomerService from "./customer.interface";

class CustomerService implements ICustomerService {
    private readonly _repository: ICustomerRepository;
    constructor(repository: ICustomerRepository) {
        this._repository = repository;
    }

    async create(data: CustomerType): Promise<MappedCustomer> {
        const hashedPassword = await Customer.hashPassword(data.password);
        const newCustomer = await Customer.create({
            ...data,
            password: hashedPassword
        });
        const { isValid, errors } = newCustomer.isValidInstance();

        if (!isValid && errors.length > 0) {
            const ERROR_MSG = errors.join(' ');
            throw new CustomError(400, ERROR_MSG);
        }

        await this._repository.create(newCustomer);
        
        // Adapter:Converting the internal data type to an http external data type that clients expects
        const mappedCustomer = retrieveCustomerMapper(newCustomer);
        
        return mappedCustomer;
    }
}

export default CustomerService;