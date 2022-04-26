import Administrator, { AdministratorType } from './administrator.entity';
import { omit } from 'lodash';
import roles from '../../enums/roles.enum';

describe("Administrator Entity", () => {
    const administratorData: AdministratorType = {
        name: "Test Administrator",
        password: "123456",
        email: 'test@gmail.com',
        city: 'Paulínia',
        state: 'SP',
        roleId: roles.ADMINISTRATOR
    };

    it("should create a valid Administrator instance", async () => {
        // arrange
        const newAdministrator = await Administrator.create(administratorData);

        // act
        const { isValid } = newAdministrator.isValidInstance();

        // asserts
        expect(isValid).toBeTruthy();
        expect(newAdministrator).toBeInstanceOf(Administrator);
        expect(newAdministrator).toHaveProperty('name');
        expect(newAdministrator).toHaveProperty('email');
        expect(newAdministrator).toHaveProperty('_password');
        expect(newAdministrator).toHaveProperty('city');
        expect(newAdministrator).toHaveProperty('state');
        expect(newAdministrator).toHaveProperty('roleId');
    });

    it("should return an error when missing a property", async () => {
        // arrange
        const MISSED_PROPERTY_SENDED = 'city';
        const MISSED_PROPERTY_EXPECTED = 'city';
        const newAdministrator = await Administrator.create(omit(administratorData, [MISSED_PROPERTY_SENDED]) as AdministratorType);

        // act
        const { isValid, errors } = newAdministrator.isValidInstance();

        // asserts
        expect(isValid).toBeFalsy();
        expect(errors).toEqual(expect.arrayContaining([`property ${MISSED_PROPERTY_EXPECTED} is missing.`]));
    });
});