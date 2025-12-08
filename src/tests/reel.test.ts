import request from 'supertest';
import { app } from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { tokenService } from '../services/token.service';
import { UserModel } from '../models/UserModel';
import fs from 'fs';
import path from 'path';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let customerToken: string;
let userId: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads/reels/videos');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

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

describe('Reel API Tests', () => {
    let reelId: string;

    it('should create reel (Admin)', async () => {
        const res = await request(app)
            .post('/v1/admin/reels')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('title', 'Amazing Reel')
            .field('description', 'Check this out')
            .field('isActive', 'true')
            .attach('video', Buffer.from('dummy video content'), { filename: 'video.mp4', contentType: 'video/mp4' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.result.title).toBe('Amazing Reel');

        reelId = res.body.result._id;
    });

    it('should get reels feed (Customer)', async () => {
        const res = await request(app)
            .get('/v1/customer/reels/feed')
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.result.docs)).toBe(true);
        expect(res.body.result.docs.length).toBeGreaterThan(0);
        expect(res.body.result.docs[0].title).toBe('Amazing Reel');
    });

    it('should like reel (Customer)', async () => {
        const res = await request(app)
            .post(`/v1/customer/reels/${reelId}/like`)
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.liked).toBe(true);
        expect(res.body.result.likes).toBe(1);
    });

    it('should add comment (Customer)', async () => {
        const res = await request(app)
            .post(`/v1/customer/reels/${reelId}/comments`)
            .set('Authorization', `Bearer ${customerToken}`)
            .send({ content: 'Nice video!' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.result.content).toBe('Nice video!');
    });
});
