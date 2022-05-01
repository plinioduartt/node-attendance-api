import { AttendantDtoType } from "@/src/infrastructure/users/attendants/presenters/mappers/attendant.mapper";
import { AttendantType } from "../../../../domain/users/attendants/entities/attendant.entity";

interface IAttendantService {
    list(): Promise<AttendantDtoType[]>;
    create(data: AttendantType): Promise<AttendantDtoType>;
    retrieve(id: string): Promise<AttendantDtoType>;
    update(id: string, data: AttendantType): Promise<AttendantDtoType>;
}

export default IAttendantService;