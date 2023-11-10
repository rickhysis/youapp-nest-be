import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
//import * as request from 'supertest';
import {
    createBaseTestingModule,
    closeAllConnections,
    createBaseNestApplication,
} from '../src/utils/test/helpers/module';
import { AUTH_ROUTE_PREFIX } from '../src/common/constants/route';
import { AuthModule } from '../src/auth/auth.module';
import { authenticatedRequest, mockUser } from '../src/utils/test/helpers/request';
import { AuthService } from '../src/auth/auth.service';

const USER_ROUTE = `${AUTH_ROUTE_PREFIX}/getProfile`;


jest.mock('../src/common/decorators/get-current-user-id.decorator.ts', () => ({
    ...jest.requireActual('../src/common/decorators/get-current-user-id.decorator.ts'),
    GetCurrentUserId: jest.fn(() => mockUser.id),
}));

jest.mock('../src/common/decorators/get-current.decorator.ts', () => ({
    ...jest.requireActual('../src/common/decorators/get-current.decorator.ts'),
    GetCurrentUser: jest.fn(() => mockUser),
}));

// jest.mock('../src/auth/strategies/access-token.strategies.ts', () => ({
//     AccessTokenStrategies: jest.fn().mockImplementation(() => ({
//       validate: jest.fn(),
//     })),
//   }));

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let authService: AuthService;
    let token: any;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await createBaseTestingModule({
            imports: [AuthModule],
        }).compile();

        
        authService = moduleFixture.get(AuthService);
        
        token = await authService.getTokens(mockUser);
        console.log(token)

        app = await createBaseNestApplication(moduleFixture);

        await app.init();
    });

    describe('user (GET)', () => {

        it('should return users', async () => {
            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .get(USER_ROUTE)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toHaveProperty('username');
                });
        });

        it('should return authentication error if token is invalid', async () => {
            return authenticatedRequest(app.getHttpServer(), 'invalid')
                .get(USER_ROUTE)
                .expect(HttpStatus.UNAUTHORIZED)
                .then((response) => {
                    expect(response.body.message).toEqual('Unauthorized');
                });
        });
    });

    afterEach(async () => {
        await closeAllConnections({
            module: app,
        });
    });
});