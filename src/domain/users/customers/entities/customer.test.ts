import Customer, { CustomerType } from './customer.entity';
import { omit } from 'lodash';
import roles from '../../enums/roles.enum';
import { CheckPasswordType } from '../../abstract-user';
import customerMapper from '@/src/infrastructure/users/customers/presenters/mappers/customer.mapper';

jest.setTimeout(50000);

describe("Customer Entity", () => {
  const DEFAULT_ENTERED_PASSWORD = "123456";
  const customerData: CustomerType = {
    name: "Test Customer",
    nickname: "Test",
    password: DEFAULT_ENTERED_PASSWORD,
    email: "test@gmail.com",
    city: "Paulínia",
    state: "SP",
    roleId: roles.CUSTOMER
  };

  it("Customer entity - Create new: Should create a valid Customer instance", async () => {
    // arrange

    // act
    const newCustomer = await Customer.create(customerData);

    // asserts
    expect(newCustomer).toBeTruthy();
    expect(newCustomer).toBeInstanceOf(Customer);
    expect(newCustomer).toHaveProperty('name');
    expect(newCustomer).toHaveProperty('nickname');
    expect(newCustomer).toHaveProperty('email');
    expect(newCustomer).toHaveProperty('_password');
    expect(newCustomer).toHaveProperty('city');
    expect(newCustomer).toHaveProperty('state');
    expect(newCustomer).toHaveProperty('roleId');
  });

  it("Customer entity - Create new: Should return an error when missing a property", async () => {
    // arrange
    const MISSED_PROPERTY_SENDED = 'nickname';
    const MISSED_PROPERTY_EXPECTED = 'nickname';

    // act
    const request = async () => await Customer.create(omit(customerData, [MISSED_PROPERTY_SENDED]) as CustomerType);

    // asserts
    expect(request).rejects.toThrowError(`property ${MISSED_PROPERTY_EXPECTED} is missing.`);
  });

  it("Customer entity - Check password: Should return true when we pass valid credentials", async () => {
    // arrange
    const enteredPassword = DEFAULT_ENTERED_PASSWORD;

    // act    
    const newCustomer = await Customer.create(customerData);
    const passwordIsValid = await Customer.checkPassword({
      enteredPassword,
      hashedPassword: newCustomer.password
    } as CheckPasswordType);

    // asserts
    expect(newCustomer).toBeTruthy();
    expect(newCustomer).toBeInstanceOf(Customer);
    expect(passwordIsValid).toBeTruthy();
  });

  it("Customer entity - Check password: Should return false when we pass invalid credentials", async () => {
    // arrange
    const enteredPassword = DEFAULT_ENTERED_PASSWORD + "654261";

    // act    
    const newCustomer = await Customer.create(customerData);
    const passwordIsValid = await Customer.checkPassword({ enteredPassword, hashedPassword: newCustomer.password } as CheckPasswordType);

    // asserts
    expect(newCustomer).toBeTruthy();
    expect(newCustomer).toBeInstanceOf(Customer);
    expect(passwordIsValid).toBeFalsy();
  });

  it("Customer entity - Map return: Should return a mapped customer", async () => {
    // arrange
    const newCustomer = await Customer.create(customerData);

    // act
    const mappedCustomer = customerMapper.domainToDto(newCustomer);

    // asserts
    expect(newCustomer).toBeTruthy();
    expect(newCustomer).toBeInstanceOf(Customer);
    expect(mappedCustomer).not.toHaveProperty('_password');
  });
});