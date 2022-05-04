import { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";
import { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";
import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";

export type AbstractUserDtoType = {
    id?: string | undefined;
    name: string;
    email: string;
    password: string;
    city: string;
    state: string;
    roleId: string;
}

const AbstractUserMapper = {
    domainToDto: (data: AdministratorType | AttendantType | CustomerType): AbstractUserDtoType => {
        const result: AbstractUserDtoType = {
            id: data.id,
            name: data.name,
            email: data.email,
            password: data.password,
            city: data.city,
            state: data.state,
            roleId: data.roleId,
        };

        return result;
    }
}

export default AbstractUserMapper;