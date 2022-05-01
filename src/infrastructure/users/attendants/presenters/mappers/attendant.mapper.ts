import { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";

export type AttendantDtoType = {
    id?: string | undefined;
    name: string;
    email: string;
    cpf: string;
    city: string;
    state: string;
    roleId: string;
    rating?: number | undefined;
}

const attendantMapper = {
    domainToDto: async (data: AttendantType): Promise<AttendantDtoType> => {
        const result: AttendantDtoType = {
            id: data.id,
            name: data.name,
            email: data.email,
            cpf: data.cpf,
            city: data.city,
            state: data.state,
            roleId: data.roleId,
            rating: data.rating
        };

        return result;
    }
}

export default attendantMapper;