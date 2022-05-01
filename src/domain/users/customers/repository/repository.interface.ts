import { CustomerDtoType } from "@/src/infrastructure/users/customers/presenters/mappers/customer.mapper";
import { CustomerType } from "../entities/customer.entity";

interface ICustomerRepository {
    list(): Promise<CustomerDtoType[]>;
    create(data: CustomerType): Promise<CustomerDtoType>;
    retrieve(id: string): Promise<CustomerDtoType | undefined>;
    update(id: string, data: CustomerType): Promise<CustomerDtoType>;
}

export default ICustomerRepository;