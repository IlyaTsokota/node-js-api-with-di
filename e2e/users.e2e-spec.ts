import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

export let application: App;

beforeAll(async () => {
    const { app } = await boot;
    application = app;
});

describe('Users e2e', () => {
    it('Register - error', async () => {
        const response = await request(application.app).post('/users/register').send({
            email: 'invalid-email',
            name: 'User',
            password: 'qwerty123',
        });

        expect(response.statusCode).toBe(422);
    });

    it('Login - success', async () => {
        const response = await request(application.app).post('/users/login').send({
            password: '67Gorobec_',
            email: 'iluh12@gmail.com',
        });

        expect(response.body.jwt).not.toBeUndefined();
    });

    it('Login - error', async () => {
        const response = await request(application.app).post('/users/login').send({
            password: '67Gorobec_',
            email: 'iluh122@gmail.com',
        });

        expect(response.statusCode).toBe(401);
    });

    it('Info - success', async () => {
        const loginResponse = await request(application.app).post('/users/login').send({
            password: '67Gorobec_',
            email: 'iluh12@gmail.com',
        });

        const infoResponse = await request(application.app)
            .get('/users/info')
            .set('Authorization', `Bearer ${loginResponse.body.jwt}`);

        expect(infoResponse.body.email).toBe('iluh12@gmail.com');
    });

    it('Info - error', async () => {
        const response = await request(application.app)
            .get('/users/info')
            .set('Authorization', `Bearer ${1}`);

        expect(response.statusCode).toBe(401);
    });
});

afterAll(() => {
    application.close();
});
