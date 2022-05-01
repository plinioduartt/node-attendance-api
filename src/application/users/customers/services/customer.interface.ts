import { CustomerDtoType } from "@/src/infrastructure/users/customers/presenters/mappers/customer.mapper";
import { CustomerType } from "../../../../domain/users/customers/entities/customer.entity";

interface ICustomerService {
    list(): Promise<CustomerDtoType[]>;
    create(data: CustomerType): Promise<CustomerDtoType>;
    retrieve(id: string): Promise<CustomerDtoType>;
    update(id: string, data: CustomerType): Promise<CustomerDtoType>;
}

export default ICustomerService;