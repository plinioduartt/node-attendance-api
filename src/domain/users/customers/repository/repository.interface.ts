import { CustomerType } from "../entities/customer.entity";

interface ICustomerRepository {
    create(data: CustomerType): Promise<void>;
}

export default ICustomerRepository;