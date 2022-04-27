import Attendant, { AttendantType } from './attendant.entity';
import { omit } from 'lodash';
import roles from '../../enums/roles.enum';
import { CheckPasswordType } from '../../abstract-user';
import retrieveAttendantMapper from '@/src/infrastructure/users/attendants/presenters/mappers/retrieve-attendant.mapper';

jest.setTimeout(50000);

describe("Attendant Entity", () => {
    const DEFAULT_ENTERED_PASSWORD = "123456";
    let attendantData: AttendantType = {
        name: "Test Attendant",
        cpf: "test",
        password: DEFAULT_ENTERED_PASSWORD,
        email: 'test@gmail.com',
        city: 'Paulínia',
        state: 'SP',
        roleId: roles.ATTENDANT
    };

    it("Attendant entity - Create new: Should create a valid Attendant instance", async () => {
        // arrange
        attendantData.password = await Attendant.hashPassword(attendantData.password);
        const newAttendant = await Attendant.create(attendantData);

        // act
        const { isValid } = newAttendant.isValidInstance();

        // asserts
        expect(isValid).toBeTruthy();
        expect(newAttendant).toBeInstanceOf(Attendant);
        expect(newAttendant).toHaveProperty('name');
        expect(newAttendant).toHaveProperty('cpf');
        expect(newAttendant).toHaveProperty('email');
        expect(newAttendant).toHaveProperty('_password');
        expect(newAttendant).toHaveProperty('city');
        expect(newAttendant).toHaveProperty('state');
        expect(newAttendant).toHaveProperty('roleId');
    });

    it("Attendant entity - IsvalidInstance: Should return an error when missing a property", async () => {
        // arrange
        const MISSED_PROPERTY_SENDED = 'cpf';
        const MISSED_PROPERTY_EXPECTED = 'cpf';
        const hashedPassword = await Attendant.hashPassword(DEFAULT_ENTERED_PASSWORD);
        const newAttendant = await Attendant.create(
            omit({
                ...attendantData,
                password: hashedPassword
            }, [MISSED_PROPERTY_SENDED]) as AttendantType);

        // act
        const { isValid, errors } = newAttendant.isValidInstance();

        // asserts
        expect(isValid).toBeFalsy();
        expect(errors).toEqual(expect.arrayContaining([`property ${MISSED_PROPERTY_EXPECTED} is missing.`]));
    });

    it("Attendant entity - Check password: Should return true when we pass valid credentials", async () => {
        // arrange
        const enteredPassword = DEFAULT_ENTERED_PASSWORD;
        const hashedPassword = await Attendant.hashPassword(DEFAULT_ENTERED_PASSWORD);

        // act
        const newAttendant = await Attendant.create({
            ...attendantData,
            password: hashedPassword
        });
        const { isValid } = newAttendant.isValidInstance();

        const passwordIsValid = await Attendant.checkPassword({ enteredPassword, hashedPassword } as CheckPasswordType);

        // asserts
        expect(newAttendant).toBeInstanceOf(Attendant);
        expect(isValid).toBeTruthy();
        expect(passwordIsValid).toBeTruthy();
    });

    it("Attendant entity - Check password: Should return false when we pass invalid credentials", async () => {
        // arrange
        const enteredPassword = DEFAULT_ENTERED_PASSWORD + "654261";
        const hashedPassword = await Attendant.hashPassword(DEFAULT_ENTERED_PASSWORD);

        // act    
        const newAttendant = await Attendant.create({
            ...attendantData,
            password: hashedPassword
        });
        const { isValid } = newAttendant.isValidInstance();
        const passwordIsValid = await Attendant.checkPassword({ enteredPassword, hashedPassword } as CheckPasswordType);

        // asserts
        expect(newAttendant).toBeInstanceOf(Attendant);
        expect(isValid).toBeTruthy();
        expect(passwordIsValid).toBeFalsy();
    });

    it("Attendant entity - Map return: Should return a mapped attendant", async () => {
        // arrange
        const hashedPassword = await Attendant.hashPassword(DEFAULT_ENTERED_PASSWORD);
        const newAttendant = await Attendant.create({
            ...attendantData,
            password: hashedPassword
        });

        // act
        const { isValid } = newAttendant.isValidInstance();
        const mappedAttendant = retrieveAttendantMapper(newAttendant);

        // asserts
        expect(isValid).toBeTruthy();
        expect(newAttendant).toBeInstanceOf(Attendant);
        expect(mappedAttendant).toHaveProperty('cpf');
        expect(mappedAttendant).not.toHaveProperty('_password');
    });
});