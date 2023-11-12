import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
//import * as request from 'supertest';
import {
    createBaseTestingModule,
    closeAllConnections,
    createBaseNestApplication,
} from '../src/utils/test/helpers/module';
import { AUTH_ROUTE_PREFIX } from '../src/common/constants/route';
import { AuthModule } from '../src/modules/auth/auth.module';
import { authenticatedRequest, mockUser } from '../src/utils/test/helpers/request';
import { AuthService } from '../src/modules/auth/auth.service';
import { Gender } from '../src/modules/users/schemas/user.schema';

const GET_USER_ROUTE = `${AUTH_ROUTE_PREFIX}/getProfile`;
const CREATE_USER_ROUTE = `${AUTH_ROUTE_PREFIX}/createProfile`;
const PUT_USER_ROUTE = `${AUTH_ROUTE_PREFIX}/updateProfile`;


describe('UserController (e2e)', () => {
    let app: INestApplication;
    let authService: AuthService;
    let token: any;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await createBaseTestingModule({
            imports: [AuthModule],
            providers: []
        })
            .compile();

        authService = moduleFixture.get(AuthService);

        token = await authService.getTokens(mockUser);

        app = await createBaseNestApplication(moduleFixture);

        await app.init();
    });

    describe('user (GET)', () => {

        it('should return users', async () => {

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .get(GET_USER_ROUTE)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toHaveProperty('username');
                });
        });

        it('should return authentication error if token is invalid', async () => {

            return authenticatedRequest(app.getHttpServer(), 'invalid')
                .get(GET_USER_ROUTE)
                .expect(HttpStatus.UNAUTHORIZED)
                .then((response) => {
                    expect(response.body.message).toEqual('Unauthorized');
                });
        });
    });

    describe('user (POST)', () => {

        it('should return valid Request', async () => {
            // Test when providing a valid request
            const validCreateUserDto = {
                name: 'Valid Name',
                gender: Gender.MALE, // Assuming Gender is an enum
                birth: '12-12-2020',
                horoscope: 'Cancer',
                zodiac: 'Dog',
                height: '170',
                weight: '100',
                interest: ['Music', 'Singing'],
            };

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .post(CREATE_USER_ROUTE)
                .send(validCreateUserDto)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toHaveProperty('name');
                    expect(response.body).toBeDefined();
                });

        });

        it('should return invalid Gender', async () => {
            const invalidGenderDto = {
                name: 'Valid Name',
                gender: 'InvalidGender', // Assuming 'InvalidGender' is not a valid gender
                birth: '12-12-2020',
                horoscope: 'Cancer',
                zodiac: 'Dog',
                height: '170',
                weight: '100',
                interest: ['Music', 'Singing']
            };

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .post(CREATE_USER_ROUTE)
                .send(invalidGenderDto)
                .expect(HttpStatus.BAD_REQUEST)
                .then((response) => {
                    expect(response.body.message).toEqual(['gender must be one of the following values: Male, Female']);
                });

        });

        it('should return empty Name', async () => {
            const emptyNameDto = {
                name: '', // Empty name
                gender: Gender.MALE,
                birth: '12-12-2020',
                horoscope: 'Cancer',
                zodiac: 'Dog',
                height: '170',
                weight: '100',
                interest: ['Music', 'Singing']
            };

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .post(CREATE_USER_ROUTE)
                .send(emptyNameDto)
                .expect(HttpStatus.BAD_REQUEST)
                .then((response) => {
                    expect(response.body.message).toEqual(['name should not be empty']);
                });

        });
    });

    describe('user (PUT)', () => {

        it('should return invalid Gender', async () => {
            const invalidGenderDto = {
                gender: 'InvalidGender', // Assuming 'InvalidGender' is not a valid gender
            };

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .put(PUT_USER_ROUTE)
                .send(invalidGenderDto)
                .expect(HttpStatus.BAD_REQUEST)
                .then((response) => {
                    expect(response.body.message).toContain('gender must be one of the following values: Male, Female');
                });

        });

        it('should return invalid Interest', async () => {
            const invalidInterestDto = {
                interest: 'InvalidInterest', // Assuming 'InvalidInterest' is not a valid interest
            };

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .put(PUT_USER_ROUTE)
                .send(invalidInterestDto)
                .expect(HttpStatus.BAD_REQUEST)
                .then((response) => {
                    expect(response.body.message).toContain('interest must be an array');
                });

        });


        it('Unauthorized Access', async () => {
            const unauthorizedUserId = 'unauthorizedUserId';
            const updateDto = {
                // Provide valid data for testing
            };

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .put(PUT_USER_ROUTE)
                .set('Authorization', `Bearer ${unauthorizedUserId}`)
                .send(updateDto)
                .expect(HttpStatus.UNAUTHORIZED)
                .then((response) => {
                    expect(response.body.message).toContain('Unauthorized');
                });

        });
    });

    afterEach(async () => {
        await closeAllConnections({
            module: app,
        });
    });
});