import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";

export type MappedCustomer = {
    id?: string | undefined;
    name: string;
    nickname?: string | undefined;
    email: string;
    city: string;
    state: string;
    roleId: string;
}

const retrieveCustomerMapper = (data: CustomerType) => {
    const mappedCustomer: MappedCustomer = {
        id: data.id,
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        city: data.city,
        state: data.state,
        roleId: data.roleId
    };

    return mappedCustomer;
}

export default retrieveCustomerMapper;