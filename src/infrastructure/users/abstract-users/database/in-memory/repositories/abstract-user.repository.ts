import IAbstractUserRepository from "@/src/domain/users/abstract-users/repository/abstract-user.repository";
import { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";
import { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";
import { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import mockedUsers from "@/src/mock/users/users-list.mock";
import AbstractUserMapper, { AbstractUserDtoType } from "../../../presenters/mappers/abstract-user.mapper";

/**
 * Returns mapped data
 */

class AbstractUserRepository implements IAbstractUserRepository {
    public administrators: AdministratorType[] = mockedUsers.administrators;
    public attendants: AttendantType[] = mockedUsers.attendants;
    public customers: CustomerType[] = mockedUsers.customers;

    async retrieve(param: string): Promise<AbstractUserDtoType | undefined> {
        const abstractUser: AdministratorType | AttendantType | CustomerType | undefined = this.administrators
            .find(item => item.id === param || item.email === param) ??
            this.attendants
                .find(item => item.id === param || item.email === param) ??
            this.customers
                .find(item => item.id === param || item.email === param);

        if (!!abstractUser) {
            const mappedAbstractUser: AbstractUserDtoType = AbstractUserMapper
                .domainToDto(abstractUser);
            return mappedAbstractUser;
        }

        return abstractUser;
    }
}

export default AbstractUserRepository;