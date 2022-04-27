import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import ICustomerRepository from "@/src/domain/users/customers/repository/repository.interface";

class CustomerRepository implements ICustomerRepository {
    public customers: CustomerType[] = [];

    async create(data: CustomerType): Promise<void> {
        this.customers.push(data);
        return;
    }
}

export default CustomerRepository;