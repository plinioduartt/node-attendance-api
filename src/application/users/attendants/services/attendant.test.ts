import Attendant, { AttendantType } from "@/src/domain/users/attendants/entities/attendant.entity";
import roles from "@/src/domain/users/enums/roles.enum";
import AttendantRepository from "@/src/infrastructure/users/attendants/database/in-memory/repositories/attendant.repository";
import attendantMapper, { AttendantDtoType } from "@/src/infrastructure/users/attendants/presenters/mappers/attendant.mapper";
import mockedUsers from "@/src/mock/users/users-list.mock";
import AttendantService from "./attendant.service";
import { omit } from "lodash";

function sutFactory() {
    const repository: AttendantRepository = new AttendantRepository();
    const service: AttendantService = new AttendantService(repository);
    return service;
}

describe('Attendant services', () => {
    const sut: AttendantService = sutFactory();
    const DEFAULT_ENTERED_PASSWORD: string = "123456";
    const attendantData: AttendantType = {
        name: "Test attendant",
        cpf: "12345678900",
        password: DEFAULT_ENTERED_PASSWORD,
        email: "test@gmail.com",
        city: "Paulínia",
        state: "SP",
        roleId: roles.ATTENDANT
    };

    it('Create attendant: Should create a valid user', async () => {
        // arrange

        // act
        const newattendant: AttendantDtoType = await sut.create(attendantData);

        // assert
        expect(newattendant).toBeTruthy();
        expect(newattendant).toHaveProperty('name');
        expect(newattendant).toHaveProperty('cpf');
        expect(newattendant).toHaveProperty('email');
        expect(newattendant).not.toHaveProperty('_password');
    });

    it('Retrieve attendant: Should return a specific attendant by id', async () => {
        // arrange
        const DEFAULT_ATTENDANT_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const VALID_ID: string = mockedUsers.attendants[0].id || DEFAULT_ATTENDANT_ID_FOR_TESTS;

        // act
        const attendant: AttendantDtoType = await sut.retrieve(VALID_ID);

        // assert
        expect(attendant).toBeTruthy();
        expect(attendant).toHaveProperty('name');
        expect(attendant).toHaveProperty('cpf');
        expect(attendant).toHaveProperty('email');
        expect(attendant).not.toHaveProperty('_password');
    });

    it('List attendants: Should return attendants list', async () => {
        // arrange

        // act
        const attendants: AttendantDtoType[] = await sut.list();

        // assert
        expect(attendants).toBeTruthy();
        expect(attendants[0]).toHaveProperty('name');
        expect(attendants[0]).toHaveProperty('cpf');
        expect(attendants[0]).toHaveProperty('email');
        expect(attendants[0]).not.toHaveProperty('_password');
    });

    it('Update attendant: Should return an updated user', async () => {
        // arrange
        const DEFAULT_ATTENDANT_ID_FOR_TESTS: string = mockedUsers.attendants[0].id ?? '625cc239a814e93465aaa470';
        const NEW_PROPERTY_VALUES: Partial<AttendantType> = {
            name: 'Usuário editado',
            cpf: '98765432100'
        };

        // act
        const response: AttendantDtoType = await sut.update(DEFAULT_ATTENDANT_ID_FOR_TESTS, NEW_PROPERTY_VALUES as AttendantType);

        // assert
        expect(response).toBeTruthy();
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('name');
        expect(response).toHaveProperty('cpf');
        expect(response).toHaveProperty('email');
        expect(response).not.toHaveProperty('_password');
        expect(response).toHaveProperty('roleId');
        expect(response).toHaveProperty('city');
        expect(response).toHaveProperty('state');
        expect(response.name).toBe(NEW_PROPERTY_VALUES.name);
        expect(response.cpf).toBe(NEW_PROPERTY_VALUES.cpf);
    });

    it("Attendant entity - Map return: Should return a mapped attendant", async () => {
        // arrange
        const newAttendant: Attendant = await Attendant.create(attendantData);

        // act
        const mappedAttendant: AttendantDtoType = await attendantMapper.domainToDto(newAttendant);

        // asserts
        expect(newAttendant).toBeTruthy();
        expect(newAttendant).toBeInstanceOf(Attendant);
        expect(mappedAttendant).toHaveProperty('cpf');
        expect(mappedAttendant).not.toHaveProperty('_password');
    });
});

describe('Attendant services EXPECTED ERRORS', () => {
    const sut: AttendantService = sutFactory();
    const DEFAULT_ENTERED_PASSWORD: string = "123456";
    const attendantData: AttendantType = {
        name: "Test attendant",
        cpf: "12345678900",
        password: DEFAULT_ENTERED_PASSWORD,
        email: "test@gmail.com",
        city: "Paulínia",
        state: "SP",
        roleId: roles.ATTENDANT
    };

    it('Create attendant: Should return an error of missed properties', async () => {
        // arrange
        const MISSED_PROPERTY: string = 'cpf';
        const MISSED_PROPERTY_EXPECTED: string = 'cpf';

        // act
        const request = async () => await sut.create(omit(attendantData, [MISSED_PROPERTY]) as AttendantType);

        // assert
        expect(request).rejects.toThrowError(`property ${MISSED_PROPERTY_EXPECTED} is missing.`)
    });

    it('Retrieve attendant: Should return an error of not found attendant', async () => {
        // arrange
        const INVALID_ID: string = 'invalid';

        // act
        const request = async () => await sut.retrieve(INVALID_ID);

        // assert
        expect(request).rejects.toThrowError(`No attendants found with param ${INVALID_ID}.`)
    });

    it('Update attendant: Should return a error attendant not found', async () => {
        // arrange
        const INVALID_ATTENDANT_ID_FOR_TESTS: string = 'invalidID';
        const NEW_PROPERTY_VALUES: Partial<AttendantType> = {
            name: 'Usuário editado',
            cpf: '98765432100'
        };

        // act
        const request = async () => await sut.update(INVALID_ATTENDANT_ID_FOR_TESTS, NEW_PROPERTY_VALUES as AttendantType);

        // assert
        expect(request).rejects.toThrowError(`No attendants found with id ${INVALID_ATTENDANT_ID_FOR_TESTS}.`);
    });
});