import Administrator, { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";
import IAdministratorRepository from "@/src/domain/users/administrators/repository/repository.interface";
import CustomError from "@/src/http/errors/customError";
import { AdministratorDtoType } from "@/src/infrastructure/users/administrators/presenters/mappers/administrator.mapper";
import IAdministratorService from "./administrator.interface";

class AdministratorService implements IAdministratorService {
    private readonly _repository: IAdministratorRepository;
    constructor(repository: IAdministratorRepository) {
        this._repository = repository;
    }

    async list(): Promise<AdministratorDtoType[]> {
        const Administrators: AdministratorDtoType[] = await this._repository.list();
        return Administrators;
    }

    async create(data: AdministratorType): Promise<AdministratorDtoType> {
        const newAdministratorInstance: Administrator = await Administrator.create(data);
        const newAdministrator: AdministratorDtoType = await this._repository.create(newAdministratorInstance);
        return newAdministrator;
    }

    async retrieve(param: string): Promise<AdministratorDtoType> {
        const AdministratorFound: AdministratorDtoType | undefined = await this._repository.retrieve(param);

        if (!AdministratorFound) {
            throw new CustomError(404, `No administrators found with param ${param}.`);
        }

        return AdministratorFound;
    }

    async update(id: string, data: AdministratorType): Promise<AdministratorDtoType> {
        const administratorFound: AdministratorDtoType | undefined = await this._repository.retrieve(id);

        if (!administratorFound) {
            throw new CustomError(404, `No administrators found with id ${id}.`);
        }

        const updatedAdministrator: AdministratorType = await Administrator.update(data);
        const administrator: AdministratorDtoType = await this._repository.update(id, updatedAdministrator);
        return administrator;
    }
}

export default AdministratorService;