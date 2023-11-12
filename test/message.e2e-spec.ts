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
import { MessageModule } from '../src/modules/messages/message.module';
import { MessageService } from '../src/modules/messages/message.service';
//import { SendMessageDto } from '../src/modules/messages/dto/send-message.dto';

const VIEW_MESSAGE_ROUTE = `${AUTH_ROUTE_PREFIX}/viewMessages`;
const SEND_MESSAGE_ROUTE = `${AUTH_ROUTE_PREFIX}/sendMessage`;

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let authService: AuthService;
    let token: any;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await createBaseTestingModule({
            imports: [AuthModule, MessageModule]
        })
            .compile();

        authService = moduleFixture.get(AuthService);

        token = await authService.getTokens(mockUser);

        app = await createBaseNestApplication(moduleFixture);

        await app.init();
    });

    describe('viewMessages (GET)', () => {

        it('should return no Messages', async () => {
            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .get(VIEW_MESSAGE_ROUTE)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toEqual([]);
                });
        });

    });

    describe('sendMessage (POST)', () => {

        it('should return valid message', async () => {
            const sendMessageDto = {
                username: 'Karlie.Cormier7',
                message: 'Hello, how are you?',
            };

            const messageService = app.get<MessageService>(MessageService);
            const mockPublisher = jest.spyOn(messageService['publisher'], 'publishMessage');

            mockPublisher.mockImplementation((message) => {
                console.log(`Mocked publishMessage called with message: ${JSON.stringify(message)}`);
            });

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .post(SEND_MESSAGE_ROUTE)
                .send(sendMessageDto)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body.message).toEqual('Succesfull sent message');
                });
        });

        it('should return validation username error', async () => {
            const invalidSendMessageDto = {
                username: '', // Empty username, which should result in validation error
                message: 'Hello, how are you?',
            };

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .post(SEND_MESSAGE_ROUTE)
                .send(invalidSendMessageDto)
                .expect(HttpStatus.BAD_REQUEST)
                .then((response) => {
                    expect(response.body.message).toContain("username should not be empty");
                });
        });

        it('should return validation message error', async () => {
            const invalidSendMessageDto = {
                username: 'Karlie.Cormier7',
                message: '', // Empty message, which should result in validation error
            };

            return authenticatedRequest(app.getHttpServer(), token.access_token)
                .post(SEND_MESSAGE_ROUTE)
                .send(invalidSendMessageDto)
                .expect(HttpStatus.BAD_REQUEST)
                .then((response) => {
                    expect(response.body.message).toContain("message should not be empty");
                });
        });
    });

    afterEach(async () => {
        await closeAllConnections({
            module: app,
        });
    });
});