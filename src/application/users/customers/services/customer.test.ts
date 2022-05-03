import Customer, { CustomerType } from "@/src/domain/users/customers/entities/customer.entity";
import roles from "@/src/domain/users/enums/roles.enum";
import CustomerRepository from "@/src/infrastructure/users/customers/database/in-memory/repositories/customer.repository";
import customerMapper, { CustomerDtoType } from "@/src/infrastructure/users/customers/presenters/mappers/customer.mapper";
import mockedUsers from "@/src/mock/users/users-list.mock";
import { omit } from "lodash";
import CustomerService from "./customer.service";

function sutFactory() {
    const repository: CustomerRepository = new CustomerRepository();
    const service: CustomerService = new CustomerService(repository);
    return service;
}

describe('Customer services', () => {
    const sut: CustomerService = sutFactory();
    const DEFAULT_ENTERED_PASSWORD: string = "123456";
    const customerData: CustomerType = {
        name: "Test Customer",
        nickname: "Test",
        password: DEFAULT_ENTERED_PASSWORD,
        email: "test@gmail.com",
        city: "Paulínia",
        state: "SP",
        roleId: roles.CUSTOMER
    };

    it('Create customer: Should create a valid user', async () => {
        // arrange

        // act
        const newCustomer: CustomerDtoType = await sut.create(customerData);

        // assert
        expect(newCustomer).toBeTruthy();
        expect(newCustomer).toHaveProperty('name');
        expect(newCustomer).toHaveProperty('nickname');
        expect(newCustomer).toHaveProperty('email');
        expect(newCustomer).not.toHaveProperty('_password');
    });

    it('Retrieve customer: Should return a specific customer by id', async () => {
        // arrange
        const DEFAULT_CUSTOMER_ID_FOR_TESTS: string = '625cc239a814e93465aaa470';
        const VALID_ID: string = mockedUsers.customers[0].id || DEFAULT_CUSTOMER_ID_FOR_TESTS;

        // act
        const customer: CustomerDtoType = await sut.retrieve(VALID_ID);

        // assert
        expect(customer).toBeTruthy();
        expect(customer).toHaveProperty('name');
        expect(customer).toHaveProperty('nickname');
        expect(customer).toHaveProperty('email');
        expect(customer).not.toHaveProperty('_password');
    });

    it('List customers: Should return customers list', async () => {
        // arrange

        // act
        const customers: CustomerDtoType[] = await sut.list();

        // assert
        expect(customers).toBeTruthy();
        expect(customers[0]).toHaveProperty('name');
        expect(customers[0]).toHaveProperty('nickname');
        expect(customers[0]).toHaveProperty('email');
        expect(customers[0]).not.toHaveProperty('_password');
    });

    it('Update customer: Should return an updated user', async () => {
        // arrange
        const DEFAULT_CUSTOMER_ID_FOR_TESTS: string = mockedUsers.customers[0].id ?? '625cc239a814e93465aaa470';
        const NEW_PROPERTY_VALUES: Partial<CustomerType> = {
            name: 'Usuário editado',
            nickname: 'Editado'
        };

        // act
        const response: CustomerDtoType = await sut.update(DEFAULT_CUSTOMER_ID_FOR_TESTS, NEW_PROPERTY_VALUES as CustomerType);

        // assert
        expect(response).toBeTruthy();
        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('name');
        expect(response).toHaveProperty('nickname');
        expect(response).toHaveProperty('email');
        expect(response).not.toHaveProperty('_password');
        expect(response).toHaveProperty('roleId');
        expect(response).toHaveProperty('city');
        expect(response).toHaveProperty('state');
        expect(response.name).toBe(NEW_PROPERTY_VALUES.name);
        expect(response.nickname).toBe(NEW_PROPERTY_VALUES.nickname);
    });

    it("Customer entity - Map return: Should return a mapped customer", async () => {
        // arrange
        const newCustomer: Customer = await Customer.create(customerData);

        // act
        const mappedCustomer: CustomerDtoType = await customerMapper.domainToDto(newCustomer);

        // asserts
        expect(newCustomer).toBeTruthy();
        expect(newCustomer).toBeInstanceOf(Customer);
        expect(mappedCustomer).not.toHaveProperty('_password');
    });
});

describe('Customer services EXPECTED ERRORS', () => {
    const sut: CustomerService = sutFactory();
    const DEFAULT_ENTERED_PASSWORD: string = "123456";
    const customerData: CustomerType = {
        name: "Test Customer",
        nickname: "Test",
        password: DEFAULT_ENTERED_PASSWORD,
        email: "test@gmail.com",
        city: "Paulínia",
        state: "SP",
        roleId: roles.CUSTOMER
    };

    it('Create customer: Should return an error of missed properties', async () => {
        // arrange
        const MISSED_PROPERTY: string = 'nickname';
        const MISSED_PROPERTY_EXPECTED: string = 'nickname';

        // act
        const request = async () => await sut.create(omit(customerData, [MISSED_PROPERTY]) as CustomerType);

        // assert
        expect(request).rejects.toThrowError(`property ${MISSED_PROPERTY_EXPECTED} is missing.`)
    });

    it('Retrieve customer: Should return an error of not found customer', async () => {
        // arrange
        const INVALID_ID: string = 'invalid';

        // act
        const request = async () => await sut.retrieve(INVALID_ID);

        // assert
        expect(request).rejects.toThrowError(`No customers found with param ${INVALID_ID}.`)
    });

    it('Update customer: Should return a error customer not found', async () => {
        // arrange
        const INVALID_CUSTOMER_ID_FOR_TESTS: string = 'invalidID';
        const NEW_PROPERTY_VALUES: Partial<CustomerType> = {
            name: 'Usuário editado',
            nickname: 'Editado'
        };

        // act
        const request = async () => await sut.update(INVALID_CUSTOMER_ID_FOR_TESTS, NEW_PROPERTY_VALUES as CustomerType);

        // assert
        expect(request).rejects.toThrowError(`No customers found with id ${INVALID_CUSTOMER_ID_FOR_TESTS}.`);
    });
});