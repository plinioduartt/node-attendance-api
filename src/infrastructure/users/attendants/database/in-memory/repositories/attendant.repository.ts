import { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";
import IAttendantRepository from "@/src/domain/users/attendants/repository/repository.interface";
import mockedUsers from "@/src/mock/users/users-list.mock";
import AttendantMapper, { AttendantDtoType } from "../../../presenters/mappers/attendant.mapper";

/**
 * Returns mapped data
 */

class AttendantRepository implements IAttendantRepository {
    public attendants: AttendantType[] = mockedUsers.attendants;

    async list(): Promise<AttendantDtoType[]> {
        let mappedAttendants: AttendantDtoType[] = [];

        for await (const attendant of this.attendants) {
            const mappedAttendant: AttendantDtoType = AttendantMapper
                .domainToDto(attendant);
            mappedAttendants.push(mappedAttendant);
        }

        return mappedAttendants;
    }

    async create(data: AttendantType): Promise<AttendantDtoType> {
        // insert Attendant into database
        this.attendants.push(data);

        // Adapter:Converting the internal data type to an http external data type that clients expects
        // map the properties of the Attendant as dto
        const mappedAttendant = AttendantMapper.domainToDto(data);
        return mappedAttendant;
    }

    async retrieve(param: string): Promise<AttendantDtoType | undefined> {
        const Attendant: AttendantType | undefined = this.attendants.find(item => item.id === param || item.email === param);
        if (!!Attendant) {
            const mappedAttendant: AttendantDtoType = AttendantMapper.domainToDto(Attendant);
            return mappedAttendant;
        }
        return Attendant;
    }

    async update(id: string, data: AttendantType): Promise<AttendantDtoType> {
        const index = this.attendants.findIndex(item => item.id === id);
        this.attendants[index] = {
            ...this.attendants[index],
            ...data
        };
        const updatedUser = this.attendants[index];
        const mappedAttendant = AttendantMapper.domainToDto(updatedUser);
        return mappedAttendant;
    }
}

export default AttendantRepository;