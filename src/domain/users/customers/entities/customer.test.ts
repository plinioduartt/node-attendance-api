import Customer, { CustomerType } from './customer.entity';
import { omit } from 'lodash';
import roles from '../../enums/roles.enum';

describe("Customer Entity", () => {
  const customerData: CustomerType = {
    name: "Test Customer",
    nickname: "test",
    password: "123456",
    email: 'test@gmail.com',
    city: 'Paulínia',
    state: 'SP',
    roleId: roles.CUSTOMER
  };

  it("should create a valid Customer instance", async () => {
    // arrange
    const newCustomer = await Customer.create(customerData);

    // act
    const { isValid } = newCustomer.isValidInstance();

    // asserts
    expect(isValid).toBeTruthy();
    expect(newCustomer).toBeInstanceOf(Customer);
    expect(newCustomer).toHaveProperty('name');
    expect(newCustomer).toHaveProperty('nickname');
    expect(newCustomer).toHaveProperty('email');
    expect(newCustomer).toHaveProperty('_password');
    expect(newCustomer).toHaveProperty('city');
    expect(newCustomer).toHaveProperty('state');
    expect(newCustomer).toHaveProperty('roleId');
  });

  it("should return an error when missing a property", async () => {
    // arrange
    const MISSED_PROPERTY_SENDED = 'nickname';
    const MISSED_PROPERTY_EXPECTED = 'nickname';
    const newCustomer = await Customer.create(omit(customerData, [MISSED_PROPERTY_SENDED]) as CustomerType);

    // act
    const { isValid, errors } = newCustomer.isValidInstance();

    // asserts
    expect(isValid).toBeFalsy();
    expect(errors).toEqual(expect.arrayContaining([`property ${MISSED_PROPERTY_EXPECTED} is missing.`]));
  });
});