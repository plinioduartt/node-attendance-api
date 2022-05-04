import { AttendanceType } from "@/src/domain/attendances/entities/attendance.entity";
import { AttendantDtoType } from "@/src/infrastructure/users/attendants/presenters/mappers/attendant.mapper";
import { CustomerDtoType } from "@/src/infrastructure/users/customers/presenters/mappers/customer.mapper";

export type AttendanceDtoType = {
    id?: string | undefined;
    protocol?: string | undefined;
    status?: string | undefined; // OPENED | CLOSED
    customerId: string;
    customer: Partial<CustomerDtoType>;
    attendantId?: string | undefined;
    attendant?: Partial<AttendantDtoType> | undefined;
    createdAt?: Date | undefined;
    closedAt?: Date | undefined;
}

const AttendanceMapper = {
    domainToDto: (data: AttendanceType): AttendanceDtoType => {
        const result: AttendanceDtoType = {
            id: data.id,
            protocol: data.protocol,
            status: data.status,
            customerId: data.customerId,
            customer: {
                name: data.customer?.name,
                nickname: data.customer?.nickname,
                email: data.customer?.email,
                city: data.customer?.city,
                state: data.customer?.state,
            },
            attendantId: data.attendantId,
            attendant: {
                name: data.attendant?.name,
                cpf: data.attendant?.cpf,
                email: data.attendant?.email,
                city: data.attendant?.city,
                state: data.attendant?.state,
            },
            createdAt: data.createdAt,
            closedAt: data.closedAt,
        };

        return result;
    }
}

export default AttendanceMapper;