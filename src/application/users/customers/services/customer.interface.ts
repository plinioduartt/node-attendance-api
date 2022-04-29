import { CustomerDtoType } from "@/src/infrastructure/users/customers/presenters/mappers/customer.mapper";
import { CustomerType } from "../../../../domain/users/customers/entities/customer.entity";

interface ICustomerService {
    create(data: CustomerType): Promise<CustomerDtoType>;
    retrieve(id: string): Promise<CustomerDtoType>;
}

export default ICustomerService;