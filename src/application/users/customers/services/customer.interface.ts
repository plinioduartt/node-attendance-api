import { MappedCustomer } from "@/src/infrastructure/users/customers/presenters/mappers/retrieve-customer.mapper";
import { CustomerType } from "../../../../domain/users/customers/entities/customer.entity";

interface ICustomerService {
    create(data: CustomerType): Promise<MappedCustomer>;
}

export default ICustomerService;