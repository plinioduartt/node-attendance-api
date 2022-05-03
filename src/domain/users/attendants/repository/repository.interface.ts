import { AttendantDtoType } from "@/src/infrastructure/users/attendants/presenters/mappers/attendant.mapper";
import { AttendantType } from "../entities/attendant.entity";

interface IAttendantRepository {
    list(): Promise<AttendantDtoType[]>;
    create(data: AttendantType): Promise<AttendantDtoType>;
    retrieve(param: string): Promise<AttendantDtoType | undefined>;
    update(id: string, data: AttendantType): Promise<AttendantDtoType>;
}

export default IAttendantRepository;