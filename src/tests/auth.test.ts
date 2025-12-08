import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { UserModel } from '../models/UserModel';
import { OtpModel } from '../models/OtpModel';
import { config } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

config({ path: '.env.test' });

jest.setTimeout(30000);

describe('Auth API Tests', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        console.log('Starting MongoMemoryServer...');
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        console.log(`Connecting to In-Memory DB: ${uri}`);
        await mongoose.connect(uri);
        console.log('Connected to DB');
    });

    afterAll(async () => {
        // Cleanup
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
        await OtpModel.deleteMany({});
    });

    it('should send OTP successfully', async () => {
        const res = await request(app)
            .post('/v1/customer/auth/send-otp')
            .send({
                phone: '+919999999999'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.otp).toBeDefined();
        expect(res.body.result.isNewUser).toBe(true);
    });

    it('should verify OTP and register new user', async () => {
        // 1. Send OTP
        const sendRes = await request(app)
            .post('/v1/customer/auth/send-otp')
            .send({
                phone: '+919999999999'
            });

        const otp = sendRes.body.result.otp;

        // 2. Verify OTP
        const verifyRes = await request(app)
            .post('/v1/customer/auth/verify-otp')
            .send({
                phone: '+919999999999',
                otp: otp
            });

        expect(verifyRes.status).toBe(200);
        expect(verifyRes.body.success).toBe(true);
        expect(verifyRes.body.result.tokens).toBeDefined();
        expect(verifyRes.body.result.user).toBeDefined();
        expect(verifyRes.body.result.user.phone).toBe('+919999999999');
    });

    it('should fail with invalid OTP', async () => {
        // 1. Send OTP
        await request(app)
            .post('/v1/customer/auth/send-otp')
            .send({
                phone: '+919999999999'
            });

        // 2. Verify with wrong OTP
        const verifyRes = await request(app)
            .post('/v1/customer/auth/verify-otp')
            .send({
                phone: '+919999999999',
                otp: '000000'
            });

        expect(verifyRes.status).toBe(401); // Or 400 depending on implementation
        expect(verifyRes.body.success).toBe(false);
    });
});
