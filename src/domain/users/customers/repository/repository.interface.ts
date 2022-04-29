import { CustomerDtoType } from "@/src/infrastructure/users/customers/presenters/mappers/customer.mapper";
import { CustomerType } from "../entities/customer.entity";

interface ICustomerRepository {
    create(data: CustomerType): Promise<CustomerDtoType>;
    retrieve(id: string): Promise<CustomerDtoType | undefined>;
}

export default ICustomerRepository;