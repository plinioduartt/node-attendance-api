import Attendant, { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";
import IAttendantRepository from "@/src/domain/users/attendants/repository/repository.interface";
import CustomError from "@/src/http/errors/customError";
import { AttendantDtoType } from "@/src/infrastructure/users/attendants/presenters/mappers/attendant.mapper";
import IAttendantService from "./attendant.interface";

class AttendantService implements IAttendantService {
    private readonly _repository: IAttendantRepository;
    constructor(repository: IAttendantRepository) {
        this._repository = repository;
    }

    async list(): Promise<AttendantDtoType[]> {
        const attendants: AttendantDtoType[] = await this._repository.list();
        return attendants;
    }

    async create(data: AttendantType): Promise<AttendantDtoType> {
        const newAttendantInstance: Attendant = await Attendant.create(data);
        const newAttendant: AttendantDtoType = await this._repository.create(newAttendantInstance);
        return newAttendant;
    }

    async retrieve(param: string): Promise<AttendantDtoType> {
        const attendantFound: AttendantDtoType | undefined = await this._repository.retrieve(param);

        if (!attendantFound) {
            throw new CustomError(404, `No attendants found with param ${param}.`);
        }

        return attendantFound;
    }

    async update(id: string, data: AttendantType): Promise<AttendantDtoType> {
        const attendantFound: AttendantDtoType | undefined = await this._repository.retrieve(id);

        if (!attendantFound) {
            throw new CustomError(404, `No attendants found with id ${id}.`);
        }

        const updatedAttendant: AttendantType = await Attendant.update(data);
        const attendant: AttendantDtoType = await this._repository.update(id, updatedAttendant);
        return attendant;
    }
}

export default AttendantService;