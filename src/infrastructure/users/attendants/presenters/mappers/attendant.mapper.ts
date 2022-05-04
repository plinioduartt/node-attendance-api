import { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";

export type AttendantDtoType = {
    id?: string | undefined;
    name: string;
    email: string;
    cpf: string;
    city: string;
    state: string;
    roleId: string;
    rating: number | null;
    attendancesNumber: number | null;
}

const AttendantMapper = {
    domainToDto: (data: AttendantType): AttendantDtoType => {
        const result: AttendantDtoType = {
            id: data.id,
            name: data.name,
            email: data.email,
            cpf: data.cpf,
            city: data.city,
            state: data.state,
            roleId: data.roleId,
            rating: data.rating ?? null,
            attendancesNumber: data.attendancesNumber ?? null
        };

        return result;
    }
}

export default AttendantMapper;