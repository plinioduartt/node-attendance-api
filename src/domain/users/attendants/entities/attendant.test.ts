import Attendant, { AttendantType } from './attendant.entity';
import { omit } from 'lodash';
import roles from '../../enums/roles.enum';

describe("Attendant Entity", () => {
    const attendantData: AttendantType = {
        name: "Test Attendant",
        cpf: "test",
        password: "123456",
        email: 'test@gmail.com',
        city: 'Paulínia',
        state: 'SP',
        roleId: roles.ATTENDANT
    };

    it("should create a valid Attendant instance", async () => {
        // arrange
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

    it("should return an error when missing a property", async () => {
        // arrange
        const MISSED_PROPERTY_SENDED = 'cpf';
        const MISSED_PROPERTY_EXPECTED = 'cpf';
        const newAttendant = await Attendant.create(omit(attendantData, [MISSED_PROPERTY_SENDED]) as AttendantType);

        // act
        const { isValid, errors } = newAttendant.isValidInstance();

        // asserts
        expect(isValid).toBeFalsy();
        expect(errors).toEqual(expect.arrayContaining([`property ${MISSED_PROPERTY_EXPECTED} is missing.`]));
    });
});