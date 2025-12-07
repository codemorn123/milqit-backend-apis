import request from 'supertest';
import { app } from '../app';

describe('Health Check Endpoint', () => {
    it('should return 200 OK and status "ok"', async () => {
        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('environment');
        expect(response.body).toHaveProperty('version');
    });
});
