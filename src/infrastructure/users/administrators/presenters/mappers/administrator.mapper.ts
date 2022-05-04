import { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";

export type AdministratorDtoType = {
    id?: string | undefined;
    name: string;
    email: string;
    city: string;
    state: string;
    roleId: string;
}

const AdministratorMapper = {
    domainToDto: (data: AdministratorType): AdministratorDtoType => {
        const result: AdministratorDtoType = {
            id: data.id,
            name: data.name,
            email: data.email,
            city: data.city,
            state: data.state,
            roleId: data.roleId,
        };

        return result;
    }
}

export default AdministratorMapper;