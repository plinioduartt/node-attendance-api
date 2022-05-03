import { AbstractUserDtoType } from "@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper";

interface IAbstractUserService {
    retrieve(param: string): Promise<AbstractUserDtoType>;
}

export default IAbstractUserService;