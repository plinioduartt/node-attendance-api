import IAbstractUserRepository from "@/src/domain/users/abstract-users/repository/abstract-user.repository";
import CustomError from "@/src/http/errors/customError";
import { AbstractUserDtoType } from "@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper";
import IAbstractUserService from "./abstract-user.interface";

class AbstractUserService implements IAbstractUserService {
    private readonly _repository: IAbstractUserRepository;
    constructor(repository: IAbstractUserRepository) {
        this._repository = repository;
    }

    async retrieve(param: string) {
        const user: AbstractUserDtoType | undefined = await this._repository
            .retrieve(param);

        if (!user) {
            throw new CustomError(404, `No administrators found with param ${param}.`);
        }

        return user;
    }
}

export default AbstractUserService;