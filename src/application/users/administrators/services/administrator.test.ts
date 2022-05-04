import Administrator, { AdministratorType } from "@/src/domain/users/administrators/entities/administrator.entity";
import roles from "@/src/domain/users/enums/roles.enum";
import AdministratorRepository from "@/src/infrastructure/users/administrators/database/in-memory/repositories/administrator.repository";
import AdministratorMapper, { AdministratorDtoType } from "@/src/infrastructure/users/administrators/presenters/mappers/administrator.mapper";
import mockedUsers from "@/src/mock/users/users-list.mock";
import { omit } from "lodash";
import AdministratorService from "./administrator.service";

function sutFactory() {
    const repository: AdministratorRepository = new AdministratorRepository();
    const service: AdministratorService = new AdministratorService(repository);
    return service;
}

describe('Administrator services', () => {
    const sut: AdministratorService = sutFactory();
    const DEFAULT_ENTERED_PASSWORD: string = "123456";
    const administratorData: AdministratorType = {
        name: "Test Administrator",
        password: DEFAULT_ENTERED_PASSWORD,
        email: "test@gmail.com",
        city: "Paulínia",
        state: "SP",
        roleId: roles.ADMINISTRATOR
    };

    it('Create Administrator: Should create a valid user', async () => {
        // arrange

        // act
        const newAdministrator: AdministratorDtoType = await sut.create(administratorData);

        // assert
        expect(newAdministrator).toBeTruthy();
        expect(newAdministrator).toHaveProperty('name');
        expect(newAdministrator).toHaveProperty('email');
        expect(newAdministrator).not.toHaveProperty('_password');
        expect(newAdministrator).not.toHaveProperty('password');
    });

    it('Retrieve Administrator: Should return a specific Administrator by id', async () => {
        // arrange
        const DEFAULT_ADMINISTRATOR_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const VALID_ID: string = mockedUsers.administrators[0].id || DEFAULT_ADMINISTRATOR_ID_FOR_TESTS;

        // act
        const Administrator: AdministratorDtoType = await sut.retrieve(VALID_ID);

        // assert
        expect(Administrator).toBeTruthy();
        expect(Administrator).toHaveProperty('name');
        expect(Administrator).toHaveProperty('email');
        expect(Administrator).not.toHaveProperty('_password');
        expect(Administrator).not.toHaveProperty('password');
    });

    it('List Administrators: Should return Administrators list', async () => {
        // arrange

        // act
        const administrators: AdministratorDtoType[] = await sut.list();

        // assert
        expect(administrators).toBeTruthy();
        expect(administrators[0]).toHaveProperty('name');
        expect(administrators[0]).toHaveProperty('email');
        expect(administrators[0]).not.toHaveProperty('_password');
        expect(administrators[0]).not.toHaveProperty('password');
    });

    it('Update Administrator: Should return an updated user', async () => {
        // arrange
        const DEFAULT_ADMINISTRATOR_ID_FOR_TESTS: string = mockedUsers.administrators[0].id ?? '625cc239a814e93465aaa470';
        const NEW_PROPERTY_VALUES: Partial<AdministratorType> = {
            name: 'Usuário editado',
        };

        // act
        const response: AdministratorDtoType = await sut.update(DEFAULT_ADMINISTRATOR_ID_FOR_TESTS, NEW_PROPERTY_VALUES as AdministratorType);

        // assert
        expect(response).toBeTruthy();
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('name');
        expect(response).toHaveProperty('email');
        expect(response).not.toHaveProperty('_password');
        expect(response).not.toHaveProperty('password');
        expect(response).toHaveProperty('roleId');
        expect(response).toHaveProperty('city');
        expect(response).toHaveProperty('state');
        expect(response.name).toBe(NEW_PROPERTY_VALUES.name);
    });

    it("Administrator entity - Map return: Should return a mapped Administrator", async () => {
        // arrange
        const newAdministrator: Administrator = await Administrator.create(administratorData);

        // act
        const mappedAdministrator: AdministratorDtoType = AdministratorMapper.domainToDto(newAdministrator);

        // asserts
        expect(newAdministrator).toBeTruthy();
        expect(newAdministrator).toBeInstanceOf(Administrator);
        expect(mappedAdministrator).not.toHaveProperty('_password');
        expect(mappedAdministrator).not.toHaveProperty('password');
    });
});

describe('Administrator services EXPECTED ERRORS', () => {
    const sut: AdministratorService = sutFactory();
    const DEFAULT_ENTERED_PASSWORD: string = "123456";
    const administratorData: AdministratorType = {
        name: "Test Administrator",
        password: DEFAULT_ENTERED_PASSWORD,
        email: "test@gmail.com",
        city: "Paulínia",
        state: "SP",
        roleId: roles.ADMINISTRATOR
    };

    it('Create Administrator: Should return an error of missed properties', async () => {
        // arrange
        const MISSED_PROPERTY: string = 'state';
        const MISSED_PROPERTY_EXPECTED: string = 'state';

        // act
        const request = async () => await sut.create(omit(administratorData, [MISSED_PROPERTY]) as AdministratorType);

        // assert
        expect(request).rejects.toThrowError(`property ${MISSED_PROPERTY_EXPECTED} is missing.`)
    });

    it('Retrieve Administrator: Should return an error of not found Administrator', async () => {
        // arrange
        const INVALID_ID: string = 'invalid';

        // act
        const request = async () => await sut.retrieve(INVALID_ID);

        // assert
        expect(request).rejects.toThrowError(`No administrators found with param ${INVALID_ID}.`)
    });

    it('Update Administrator: Should return a error Administrator not found', async () => {
        // arrange
        const INVALID_ADMINISTRATOR_ID_FOR_TESTS: string = 'invalidID';
        const NEW_PROPERTY_VALUES: Partial<AdministratorType> = {
            name: 'Usuário editado'
        };

        // act
        const request = async () => await sut.update(INVALID_ADMINISTRATOR_ID_FOR_TESTS, NEW_PROPERTY_VALUES as AdministratorType);

        // assert
        expect(request).rejects.toThrowError(`No administrators found with id ${INVALID_ADMINISTRATOR_ID_FOR_TESTS}.`);
    });
});