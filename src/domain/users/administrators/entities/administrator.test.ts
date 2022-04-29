import Administrator, { AdministratorType } from './administrator.entity';
import { omit } from 'lodash';
import roles from '../../enums/roles.enum';
import { CheckPasswordType } from '../../abstract-user';
import retrieveAdministratorMapper from '@/src/infrastructure/users/administrators/presenters/mappers/retrieve-administrator.mapper';

jest.setTimeout(50000);

describe("Administrator Entity", () => {
    const DEFAULT_ENTERED_PASSWORD = "123456";
    const administratorData: AdministratorType = {
        name: "Test Administrator",
        password: DEFAULT_ENTERED_PASSWORD,
        email: 'test@gmail.com',
        city: 'Paulínia',
        state: 'SP',
        roleId: roles.ADMINISTRATOR
    };

    it("Administrator entity - New administrator: Should create a valid Administrator instance", async () => {
        // arrange

        // act
        const newAdministrator = await Administrator.create(administratorData);

        // asserts
        expect(newAdministrator).toBeTruthy();
        expect(newAdministrator).toBeInstanceOf(Administrator);
        expect(newAdministrator).toHaveProperty('name');
        expect(newAdministrator).toHaveProperty('email');
        expect(newAdministrator).toHaveProperty('_password');
        expect(newAdministrator).toHaveProperty('city');
        expect(newAdministrator).toHaveProperty('state');
        expect(newAdministrator).toHaveProperty('roleId');
    });

    it("Administrator entity - Validate creation: Should return an error when missing a property", async () => {
        // arrange
        const MISSED_PROPERTY_SENDED = 'city';
        const MISSED_PROPERTY_EXPECTED = 'city';

        // act
        const request = async () => await Administrator.create(omit(administratorData, [MISSED_PROPERTY_SENDED]) as AdministratorType);

        // asserts
        expect(request).rejects.toThrowError(`property ${MISSED_PROPERTY_EXPECTED} is missing.`);
    });

    it("Administrator entity - Check password: Should return true when we pass valid credentials", async () => {
        // arrange
        const enteredPassword = DEFAULT_ENTERED_PASSWORD;

        // act    
        const newAdministrator = await Administrator.create(administratorData);
        const passwordIsValid = await Administrator.checkPassword({
            enteredPassword,
            hashedPassword: newAdministrator.password
        } as CheckPasswordType);

        // asserts
        expect(newAdministrator).toBeTruthy();
        expect(newAdministrator).toBeInstanceOf(Administrator);
        expect(passwordIsValid).toBeTruthy();
    });

    it("Administrator entity - Check password: Should return false when we pass invalid credentials", async () => {
        // arrange
        const enteredPassword = DEFAULT_ENTERED_PASSWORD + "654261";

        // act    
        const newAdministrator = await Administrator.create(administratorData);
        const passwordIsValid = await Administrator.checkPassword({
            enteredPassword,
            hashedPassword: newAdministrator.password
        } as CheckPasswordType);

        // asserts
        expect(newAdministrator).toBeTruthy();
        expect(newAdministrator).toBeInstanceOf(Administrator);
        expect(passwordIsValid).toBeFalsy();
    });

    it("Administrator entity - Map return: Should return a mapped administrator", async () => {
        // arrange
        const newAdministrator = await Administrator.create(administratorData);

        // act
        const mappedAdministrator = retrieveAdministratorMapper(newAdministrator);

        // asserts
        expect(newAdministrator).toBeTruthy();
        expect(newAdministrator).toBeInstanceOf(Administrator);
        expect(mappedAdministrator).not.toHaveProperty('_password');
    });
});