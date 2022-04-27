import { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";

export type MappedAttendant = {
    id?: string | undefined;
    name: string;
    email: string;
    cpf: string;
    city: string;
    state: string;
    roleId: string;
    rating?: number | undefined;
}

const retrieveAttendantMapper = (data: AttendantType) => {
    const mappedAttendant: MappedAttendant = {
        id: data.id,
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        city: data.city,
        state: data.state,
        roleId: data.roleId,
        rating: data.rating
    };

    return mappedAttendant;
}

export default retrieveAttendantMapper;