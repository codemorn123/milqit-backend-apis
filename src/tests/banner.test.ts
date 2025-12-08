import request from 'supertest';
import { app } from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { tokenService } from '../services/token.service';
import { BannerPlacement, BannerPurpose } from '../types/banner.enums';
import { BannerPlatform } from '../types/banner.types';
import fs from 'fs';
import path from 'path';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let customerToken: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads/banners/images');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate Admin Token
    const adminAuth = tokenService.generateAuthTokens(
        new mongoose.Types.ObjectId().toString(),
        ['admin']
    );
    adminToken = adminAuth.accessToken;

    // Generate Customer Token
    const customerAuth = tokenService.generateAuthTokens(
        new mongoose.Types.ObjectId().toString(),
        ['customer']
    );
    customerToken = customerAuth.accessToken;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Banner API Tests', () => {
    let bannerId: string;

    it('should create banner (Admin)', async () => {
        const res = await request(app)
            .post('/v1/admin/banners')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('title', 'Summer Sale')
            .field('placement', BannerPlacement.HOME_HERO_CAROUSEL)
            .field('platform', BannerPlatform.MOBILE)
            .field('purpose', BannerPurpose.SALE_EVENT)
            .field('isActive', 'true')
            .field('redirectLink', 'https://example.com/products/sale')
            .attach('image', Buffer.from('dummy image'), 'banner.png');

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Summer Sale');
        expect(res.body.data.placement).toBe(BannerPlacement.HOME_HERO_CAROUSEL);

        bannerId = res.body.data._id;
    });

    it('should list banners (Customer)', async () => {
        const res = await request(app)
            .get('/v1/customer/banners')
            .set('Authorization', `Bearer ${customerToken}`)
            .query({ placement: BannerPlacement.HOME_HERO_CAROUSEL });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.docs).toBeDefined();
        expect(Array.isArray(res.body.result.docs)).toBe(true);
        expect(res.body.result.docs.length).toBeGreaterThan(0);
        expect(res.body.result.docs[0].title).toBe('Summer Sale');
    });
});
