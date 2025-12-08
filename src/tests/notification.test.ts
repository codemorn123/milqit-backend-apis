import request from 'supertest';
import { app } from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { tokenService } from '../services/token.service';
import { UserModel } from '../models/UserModel';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let customerToken: string;
let userId: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create Test User
    const user = await UserModel.create({
        name: 'Test User',
        phone: '+919999999999',
        passwordHash: 'hashedpassword',
        isActive: true,
        isPhoneVerified: true
    });
    userId = (user as any)._id.toString();

    // Generate Admin Token
    const adminAuth = tokenService.generateAuthTokens(
        new mongoose.Types.ObjectId().toString(),
        ['admin']
    );
    adminToken = adminAuth.accessToken;

    // Generate Customer Token
    const customerAuth = tokenService.generateAuthTokens(
        userId,
        ['customer']
    );
    customerToken = customerAuth.accessToken;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Notification API Tests', () => {
    it('should create notification (Admin)', async () => {
        const res = await request(app)
            .post('/v1/admin/cms/notifications')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'New Feature Alert',
                message: 'Check out our new reels feature!',
                targetAudience: 'all'
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.result.title).toBe('New Feature Alert');
    });

    it('should get notifications (Customer)', async () => {
        const res = await request(app)
            .get('/v1/customer/notifications')
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.result.docs)).toBe(true);
        expect(res.body.result.docs.length).toBeGreaterThan(0);
        expect(res.body.result.docs[0].title).toBe('New Feature Alert');
    });

    it('should register device (Customer)', async () => {
        const res = await request(app)
            .post('/v1/customer/notifications/register-device')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                deviceToken: 'dummy_device_token',
                platform: 'android'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
