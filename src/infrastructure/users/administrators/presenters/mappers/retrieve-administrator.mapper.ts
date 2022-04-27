import { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";

export type MappedAdministrator = {
    id?: string | undefined;
    name: string;
    email: string;
    city: string;
    state: string;
    roleId: string;
}

const retrieveAdministratorMapper = (data: AdministratorType) => {
    const mappedAdministrator: MappedAdministrator = {
        id: data.id,
        name: data.name,
        email: data.email,
        city: data.city,
        state: data.state,
        roleId: data.roleId
    };

    return mappedAdministrator;
}

export default retrieveAdministratorMapper;