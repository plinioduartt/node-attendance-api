import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import ICustomerRepository from "@/src/domain/users/customers/repository/repository.interface";
import mockedUsers from "@/src/mock/users/users-list.mock";
import customerMapper, { CustomerDtoType } from "../../../presenters/mappers/customer.mapper";

/**
 * Returns mapped data
 */

class CustomerRepository implements ICustomerRepository {
    public customers: CustomerType[] = mockedUsers.customers;

    async list(): Promise<CustomerDtoType[]> {
        return this.customers;
    }

    async create(data: CustomerType): Promise<CustomerDtoType> {
        // insert customer into database
        this.customers.push(data);

        // Adapter:Converting the internal data type to an http external data type that clients expects
        // map the properties of the customer as dto
        const mappedCustomer = await customerMapper.domainToDto(data);
        return mappedCustomer;
    }

    async retrieve(param: string): Promise<CustomerDtoType | undefined> {
        const customer: CustomerDtoType & CustomerType | undefined = this.customers.find(item => item.id === param || item.email === param);
        if (!!customer) {
            const mappedCustomer = await customerMapper.domainToDto(customer);
            return mappedCustomer;
        }
        return customer;
    }

    async update(id: string, data: CustomerType): Promise<CustomerDtoType> {
        const index = this.customers.findIndex(item => item.id === id);
        this.customers[index] = {
            ...this.customers[index],
            ...data
        };
        const updatedUser = this.customers[index];
        const mappedCustomer = await customerMapper.domainToDto(updatedUser);
        return mappedCustomer;
    }
}

export default CustomerRepository;