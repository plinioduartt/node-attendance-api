import Token from '@/src/domain/authentication/jwt/tokens/entities/token.entity';
import ApiJsonErrorType from '@/src/http/types/api-errors/api-error-response.type';
import ApiJsonResponseListType from '@/src/http/types/api-responses/api-json-response-list.type';
import ApiJsonResponseRetrieveType from '@/src/http/types/api-responses/api-json-response-retrieve.type';
import { AbstractUserDtoType } from '@/src/infrastructure/users/abstract-users/presenters/mappers/abstract-user.mapper';
import AttendantMapper, { AttendantDtoType } from '@/src/infrastructure/users/attendants/presenters/mappers/attendant.mapper';
import application from '@/src/initializers/application';
import mockedUsers from '@/src/mock/users/users-list.mock';
import ClientSocket from '@/src/tcp/socket/socket.io/client';
import { omit } from 'lodash';
import request from 'supertest';

jest.setTimeout(50000);
describe("Attendant Controller: Integration tests", () => {

    afterAll(() => {
        ClientSocket.closeSocket();
    });
    
    test("GET /attendants => return an paginated array list", async () => {
        // arrange
        const EXPECTED_RESULT: AttendantDtoType = AttendantMapper.domainToDto(mockedUsers.attendants[0]);
        const userDataForAccessToken = omit(mockedUsers.administrators[0], ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .get('/attendants')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonResponseListType<AttendantDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data[0]).toEqual(EXPECTED_RESULT);
    });

    test("GET /attendants/:id => return an specific attendant by ID", async () => {
        // arrange
        const EXPECTED_RESULT: AttendantDtoType = AttendantMapper.domainToDto(mockedUsers.attendants[0]);
        const userDataForAccessToken = omit(mockedUsers.attendants[0], ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .get(`/attendants/${EXPECTED_RESULT.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonResponseRetrieveType<AttendantDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data).toEqual(EXPECTED_RESULT);
    });

    test("GET /attendants/:id => return an specific attendant AS ADMINISTRATOR", async () => {
        // arrange
        const EXPECTED_RESULT: AttendantDtoType = AttendantMapper.domainToDto(mockedUsers.attendants[0]);
        const userDataForAccessToken = omit(mockedUsers.administrators[1], ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .get(`/attendants/${EXPECTED_RESULT.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonResponseRetrieveType<AttendantDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data).toEqual(EXPECTED_RESULT);
    });

    test("PATCH /attendants/:id => update an specific attendant by ID", async () => {
        // arrange
        const formDataSent = { name: "Editado" };
        const selectedUserForPath = mockedUsers.attendants[0];
        const selectedUserForToken = mockedUsers.attendants[0];
        const userDataForAccessToken = omit(selectedUserForToken, ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .patch(`/attendants/${selectedUserForPath.id}`)
            .send(formDataSent)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)


        const parsedResponse: ApiJsonResponseRetrieveType<AttendantDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data.name).toEqual(formDataSent.name);
    });

    test("PATCH /attendants/:id => update an specific attendant by ID AS ADMNINISTRATOR", async () => {
        // arrange
        const formDataSent = { name: "Editado" };
        const selectedUserForPath = mockedUsers.attendants[0];
        const selectedUserForToken = mockedUsers.administrators[1];
        const userDataForAccessToken = omit(selectedUserForToken, ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .patch(`/attendants/${selectedUserForPath.id}`)
            .send(formDataSent)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)


        const parsedResponse: ApiJsonResponseRetrieveType<AttendantDtoType> = response.body;

        // assertions
        expect(response.status).toBe(200);
        expect(parsedResponse).toHaveProperty('data');
        expect(parsedResponse.data.name).toEqual(formDataSent.name);
    });
});

describe("Attendant Controller: Integration tests EXPECTED ERRORS", () => {

    test("GET /attendants => return an paginated array list", async () => {
        // arrange

        //act
        const response = await request(application)
            .get('/attendants')
            .set('Accept', 'application/json');

        const parsedResponse: ApiJsonErrorType = response.body;

        // assertions
        expect(response.status).toBe(401);
        expect(parsedResponse).toHaveProperty('error');
        expect(parsedResponse.error).toHaveProperty('message');
        expect(parsedResponse.error.message).toEqual('Authorization header is missing.');
    });

    test("GET /attendants/:id => return an error when passing invalid Bearer token", async () => {
        // arrange
        const EXPECTED_RESULT: AttendantDtoType = AttendantMapper.domainToDto(mockedUsers.attendants[0]);
        const accessToken = "invalidAccessToken";

        //act
        const response = await request(application)
            .get(`/attendants/${EXPECTED_RESULT.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonErrorType = response.body;

        // assertions
        expect(response.status).toBe(401);
        expect(parsedResponse).toHaveProperty('error');
        expect(parsedResponse.error).toHaveProperty('message');
        expect(parsedResponse.error.message).toEqual('Invalid token.');
    });

    test("GET /attendants/:id => return an error when trying to access resources of other clients", async () => {
        // arrange
        const EXPECTED_RESULT: AttendantDtoType = AttendantMapper.domainToDto(mockedUsers.attendants[0]);
        const userDataForAccessToken = omit(mockedUsers.attendants[1], ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .get(`/attendants/${EXPECTED_RESULT.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        const parsedResponse: ApiJsonErrorType = response.body;

        // assertions
        expect(response.status).toBe(401);
        expect(parsedResponse).toHaveProperty('error');
        expect(parsedResponse.error).toHaveProperty('message');
        expect(parsedResponse.error.message).toEqual('Unauthorized action.');
    });

    test("PATCH /attendants/:id => Error when try to update other user", async () => {
        // arrange
        const formDataSent = { name: "Editado" };
        const selectedUserForPath = mockedUsers.attendants[0];
        const selectedUserForToken = mockedUsers.attendants[1];
        const userDataForAccessToken = omit(selectedUserForToken, ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .patch(`/attendants/${selectedUserForPath.id}`)
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

    test("GET /attendants => Error when try to list attendants AS ATTENDANT", async () => {
        // arrange
        const selectedUserForToken = mockedUsers.attendants[0];
        const userDataForAccessToken = omit(selectedUserForToken, ['password']) as Partial<AbstractUserDtoType>;
        const accessToken = Token.generate(userDataForAccessToken);

        //act
        const response = await request(application)
            .get(`/attendants`)
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