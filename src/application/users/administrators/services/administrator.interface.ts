import { AdministratorDtoType } from "@/src/infrastructure/users/administrators/presenters/mappers/administrator.mapper";
import { AdministratorType } from "../../../../domain/users/administrators/entities/administrator.entity";

interface IAdministratorService {
    list(): Promise<AdministratorDtoType[]>;
    create(data: AdministratorType): Promise<AdministratorDtoType>;
    retrieve(param: string): Promise<AdministratorDtoType>;
    update(id: string, data: AdministratorType): Promise<AdministratorDtoType>;
}

export default IAdministratorService;