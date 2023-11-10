import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import {
  createBaseTestingModule,
  closeAllConnections,
  createBaseNestApplication,
} from '../src/utils/test/helpers/module';
import { AUTH_ROUTE_PREFIX } from '../src/common/constants/route';
import { faker } from '@faker-js/faker';
import { AuthModule } from '../src/auth/auth.module';
import { UserModule } from '../src/modules/users/user.module';

const REGISTER_ROUTE = `${AUTH_ROUTE_PREFIX}/register`;
const LOGIN_ROUTE = `${AUTH_ROUTE_PREFIX}/login`;

const userDto = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await createBaseTestingModule({
      imports: [AuthModule, UserModule],
    }).compile();

    app = await createBaseNestApplication(moduleFixture);

    await app.init();
  });

  describe('user (POST)', () => {
    it('it should create a user', async () => {
     
      return request(app.getHttpServer())
        .post(REGISTER_ROUTE)
        .send(userDto)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toHaveProperty('refresh_token');
          expect(response.body).toHaveProperty('access_token');
        });
    });

    it('it should not create a user with an existing email', async () => {
      return request(app.getHttpServer())
        .post(REGISTER_ROUTE)
        .send(userDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual('User already exists');
        });
    });

  });

  describe('login (POST)', () => {
    it('should login a user (tokenCreated status)', async () => {

      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          email: userDto.email,
          password: userDto.password,
        })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toHaveProperty('data');
        });
    });

    it('should return a bad request error if email is missing (notFoundUser status)', async () => {
      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          email: 'email@email.com',
          password: 'myPassword123',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toEqual('User not found');
        });
    });

    it('should return a bad request error if email is invalid', async () => {
      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          email: 'invalid',
          password: 'myPassword123',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toEqual(['email must be an email']);
        });
    });

    it('should return a bad request error if password is incorrect (passwordNotMatched status)', async () => {

      return request(app.getHttpServer())
        .post(LOGIN_ROUTE)
        .send({
          email: userDto.email,
          password: 'wrongPassword',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toEqual('Wrong password');
        });
    });

  });

  afterEach(async () => {
    await closeAllConnections({
      module: app,
    });
  });
});