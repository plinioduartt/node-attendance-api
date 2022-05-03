import { AdministratorDtoType } from "@/src/infrastructure/users/administrators/presenters/mappers/administrator.mapper";
import { AdministratorType } from "../entities/administrator.entity";

interface IAdministratorRepository {
    list(): Promise<AdministratorDtoType[]>;
    create(data: AdministratorType): Promise<AdministratorDtoType>;
    retrieve(param: string): Promise<AdministratorDtoType | undefined>;
    update(id: string, data: AdministratorType): Promise<AdministratorDtoType>;
}

export default IAdministratorRepository;