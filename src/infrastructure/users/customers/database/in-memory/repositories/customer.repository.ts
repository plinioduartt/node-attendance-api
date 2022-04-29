import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import ICustomerRepository from "@/src/domain/users/customers/repository/repository.interface";
import mockedUsers from "@/src/mock/users/users-list.mock";
import customerMapper, { CustomerDtoType } from "../../../presenters/mappers/customer.mapper";

/**
 * Returns mapped data
 */

class CustomerRepository implements ICustomerRepository {
    public customers: CustomerType[] = mockedUsers.customers;

    async create(data: CustomerType): Promise<CustomerDtoType> {
        // insert customer into database
        this.customers.push(data);

        // Adapter:Converting the internal data type to an http external data type that clients expects
        // map the properties of the customer as dto
        const mappedCustomer = customerMapper.domainToDto(data);
        return mappedCustomer;
    }

    async retrieve(id: string): Promise<CustomerDtoType | undefined> {
        const customer = this.customers.find(item => item.id === id);
        return customer;
    }
}

export default CustomerRepository;