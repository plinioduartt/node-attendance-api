import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";

export type CustomerDtoType = {
    id?: string | undefined;
    name: string;
    nickname: string;
    email: string;
    city: string;
    state: string;
    roleId: string;
    createdAt?: Date | undefined;
}

const customerMapper = {
    domainToDto: async (data: CustomerType): Promise<CustomerDtoType> => {
        const result: CustomerDtoType = {
            id: data.id,
            name: data.name,
            nickname: data.nickname,
            email: data.email,
            city: data.city,
            state: data.state,
            roleId: data.roleId,
            createdAt: data.createdAt,
        };

        return result;
    }
}

export default customerMapper;