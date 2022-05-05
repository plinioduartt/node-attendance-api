import Token from '@/src/domain/authentication/jwt/tokens/entities/token.entity';
import ApiJsonErrorType from '@/src/http/types/api-errors/api-error-response.type';
import ApiJsonResponseListType from '@/src/http/types/api-responses/api-json-response-list.type';
import ApiJsonResponseRetrieveType from '@/src/http/types/api-responses/api-json-response-retrieve.type';
import { AbstractUserDtoType } from '@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper';
import customerMapper, { CustomerDtoType } from '@/src/infrastructure/users/customers/presenters/mappers/customer.mapper';
import application from '@/src/initializers/application';
import mockedUsers from '@/src/mock/users/users-list.mock';
import { omit } from 'lodash';
import request from 'supertest';

jest.setTimeout(50000);
describe("Customer Controller: Integration tests", () => {

    test("GET /customers => return an paginated array list", async () => {
        // arrange
        const EXPECTED_RESULT: CustomerDtoType = customerMapper.domainToDto(mockedUsers.customers[0]);

        //act
        const response = await request(application)
            .get('/customers')
            .set('Accept', 'application/json');

        const parsedResponse: ApiJsonResponseListType<CustomerDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data[0]).toEqual(EXPECTED_RESULT);
    });

    test("GET /customers/:id => return an specific customer by ID", async () => {
        // arrange
        const EXPECTED_RESULT: CustomerDtoType = customerMapper.domainToDto(mockedUsers.customers[0]);
        const userDataForAccessToken = omit(mockedUsers.customers[0], ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .get(`/customers/${EXPECTED_RESULT.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonResponseRetrieveType<CustomerDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data).toEqual(EXPECTED_RESULT);
    });

    test("GET /customers/:id => return an specific customer AS ADMINISTRATOR", async () => {
        // arrange
        const EXPECTED_RESULT: CustomerDtoType = customerMapper.domainToDto(mockedUsers.customers[0]);
        const userDataForAccessToken = omit(mockedUsers.administrators[1], ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .get(`/customers/${EXPECTED_RESULT.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonResponseRetrieveType<CustomerDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data).toEqual(EXPECTED_RESULT);
    });

    test("PATCH /customers/:id => update an specific customer by ID", async () => {
        // arrange
        const formDataSent = { name: "Editado" };
        const selectedUserForPath = mockedUsers.customers[0];
        const selectedUserForToken = mockedUsers.customers[0];
        const userDataForAccessToken = omit(selectedUserForToken, ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .patch(`/customers/${selectedUserForPath.id}`)
            .send(formDataSent)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)


        const parsedResponse: ApiJsonResponseRetrieveType<CustomerDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data.name).toEqual(formDataSent.name);
    });

    test("PATCH /customers/:id => update an specific customer by ID AS ADMNINISTRATOR", async () => {
        // arrange
        const formDataSent = { name: "Editado" };
        const selectedUserForPath = mockedUsers.customers[0];
        const selectedUserForToken = mockedUsers.administrators[0];
        const userDataForAccessToken = omit(selectedUserForToken, ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .patch(`/customers/${selectedUserForPath.id}`)
            .send(formDataSent)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)


        const parsedResponse: ApiJsonResponseRetrieveType<CustomerDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data.name).toEqual(formDataSent.name);
    });
});

describe("Customer Controller: Integration tests EXPECTED ERRORS", () => {

    test("GET /customers/:id => return an error when passing invalid Bearer token", async () => {
        // arrange
        const EXPECTED_RESULT: CustomerDtoType = customerMapper.domainToDto(mockedUsers.customers[0]);
        const accessToken = "invalidAccessToken";

        //act
        const response = await request(application)
            .get(`/customers/${EXPECTED_RESULT.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonErrorType = response.body;

        // assertions
        expect(response.status).toBe(401);
        expect(parsedResponse).toHaveProperty('error');
        expect(parsedResponse.error).toHaveProperty('message');
        expect(parsedResponse.error.message).toEqual('Invalid token.');
    });

    test("GET /customers/:id => return an error when trying to access resources of other clients", async () => {
        // arrange
        const EXPECTED_RESULT: CustomerDtoType = customerMapper.domainToDto(mockedUsers.customers[0]);
        const userDataForAccessToken = omit(mockedUsers.customers[1], ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .get(`/customers/${EXPECTED_RESULT.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonErrorType = response.body;

        // assertions
        expect(response.status).toBe(401);
        expect(parsedResponse).toHaveProperty('error');
        expect(parsedResponse.error).toHaveProperty('message');
        expect(parsedResponse.error.message).toEqual('Unauthorized action.');
    });

    test("PATCH /customers/:id => Error when try to update other user", async () => {
        // arrange
        const formDataSent = { name: "Editado" };
        const selectedUserForPath = mockedUsers.customers[0];
        const selectedUserForToken = mockedUsers.customers[1];
        const userDataForAccessToken = omit(selectedUserForToken, ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .patch(`/customers/${selectedUserForPath.id}`)
            .send(formDataSent)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonErrorType = response.body;

        // assertions
        expect(response.status).toBe(401);
        expect(parsedResponse).toHaveProperty('error');
        expect(parsedResponse.error).toHaveProperty('message');
        expect(parsedResponse.error.message).toEqual('Unauthorized action.');
    });

    test("PATCH /customers/:id => Error when try to update customer AS ATTENDANT", async () => {
        // arrange
        const formDataSent = { name: "Editado" };
        const selectedUserForPath = mockedUsers.customers[0];
        const selectedUserForToken = mockedUsers.attendants[0];
        const userDataForAccessToken = omit(selectedUserForToken, ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .patch(`/customers/${selectedUserForPath.id}`)
            .send(formDataSent)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonErrorType = response.body;

        // assertions
        expect(response.status).toBe(401);
        expect(parsedResponse).toHaveProperty('error');
        expect(parsedResponse.error).toHaveProperty('message');
        expect(parsedResponse.error.message).toEqual('Unauthorized action.');
    });
});