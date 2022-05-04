import { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";
import IAdministratorRepository from "@/src/domain/users/administrators/repository/repository.interface";
import mockedUsers from "@/src/mock/users/users-list.mock";
import AdministratorMapper, { AdministratorDtoType } from "../../../presenters/mappers/administrator.mapper";

/**
 * Returns mapped data
 */

class AdministratorRepository implements IAdministratorRepository {
    public administrators: AdministratorType[] = mockedUsers.administrators;

    async list(): Promise<AdministratorDtoType[]> {
        let mappedAdministrators: AdministratorDtoType[] = [];

        for await (const administrator of this.administrators) {
            const mappedAdministrator: AdministratorDtoType = AdministratorMapper
                .domainToDto(administrator);
            mappedAdministrators.push(mappedAdministrator);
        }

        return mappedAdministrators;
    }

    async create(data: AdministratorType): Promise<AdministratorDtoType> {
        // insert Administrator into database
        this.administrators.push(data);

        // Adapter:Converting the internal data type to an http external data type that clients expects
        // map the properties of the Administrator as dto
        const mappedAdministrator = AdministratorMapper.domainToDto(data);
        return mappedAdministrator;
    }

    async retrieve(param: string): Promise<AdministratorDtoType | undefined> {
        const administrator: AdministratorType | undefined = this.administrators.find(item => item.id === param || item.email === param);
        if (!!administrator) {
            const mappedAdministrator: AdministratorDtoType = AdministratorMapper.domainToDto(administrator);
            return mappedAdministrator;
        }
        return administrator;
    }

    async update(id: string, data: AdministratorType): Promise<AdministratorDtoType> {
        const index = this.administrators.findIndex(item => item.id === id);
        this.administrators[index] = {
            ...this.administrators[index],
            ...data
        };
        const updatedUser = this.administrators[index];
        const mappedAdministrator = AdministratorMapper.domainToDto(updatedUser);
        return mappedAdministrator;
    }
}

export default AdministratorRepository;