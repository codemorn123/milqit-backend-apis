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

describe('Coupon API Tests', () => {
    let couponCode = 'WELCOME50';

    it('should create coupon (Admin)', async () => {
        const res = await request(app)
            .post('/v1/admin/coupons')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                code: couponCode,
                description: 'Welcome Offer',
                discountType: 'percentage',
                discountValue: 50,
                maxDiscountAmount: 100,
                minOrderValue: 200,
                validFrom: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                validUntil: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                totalUsageLimit: 100,
                usageLimitPerUser: 1,
                isActive: true
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.result.code).toBe(couponCode);
    });

    it('should get available coupons (Customer)', async () => {
        const res = await request(app)
            .get('/v1/customer/coupons/available')
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.result)).toBe(true);
        expect(res.body.result.some((c: any) => c.code === couponCode)).toBe(true);
    });

    it('should apply coupon (Customer)', async () => {
        const res = await request(app)
            .post('/v1/customer/coupons/apply')
            .set('Authorization', `Bearer ${customerToken}`)
            .send({
                code: couponCode,
                orderTotal: 500
            });

        if (res.status !== 200) {
            console.log('Apply Coupon Failed Response:', JSON.stringify(res.body, null, 2));
        }
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.code).toBe(couponCode);
        expect(res.body.result.discountAmount).toBe(100); // 50% of 500 is 250, but max is 100
        expect(res.body.result.finalTotal).toBe(400); // 500 - 100
    });
});
