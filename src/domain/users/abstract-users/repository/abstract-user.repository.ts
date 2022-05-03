import { AbstractUserDtoType } from "@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper";

interface IAbstractUserRepository {
    retrieve(param: string): Promise<AbstractUserDtoType | undefined>;
}

export default IAbstractUserRepository;