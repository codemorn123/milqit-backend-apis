import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { ProductModel } from '../models/product.model';
import { UserModel } from '../models/UserModel';
import CartModelClass from '../models/CartModel';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { tokenService } from '../services/token.service';

config({ path: '.env.test' });

jest.setTimeout(30000);

describe('Cart API Tests', () => {
    let authToken: string;
    let userId: string;
    let productId: string;
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        console.log('Starting MongoMemoryServer...');
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        console.log(`Connecting to In-Memory DB: ${uri}`);
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Create Test User
        const user = await UserModel.create({
            name: 'Test User',
            phone: '+919999999999',
            passwordHash: 'hashedpassword',
            isActive: true,
            isPhoneVerified: true
        });
        userId = (user as any)._id.toString();

        // Generate Token
        const tokens = tokenService.generateAuthTokens(userId, ['customer']);
        authToken = tokens.accessToken;

        // Create Test Product
        const product = await ProductModel.create({
            name: 'Test Milk',
            slug: 'test-milk',
            description: 'Fresh Test Milk',
            mrp: 60,
            sellingPrice: 50,
            quantity: 100,
            unit: 'litre',
            category: new mongoose.Types.ObjectId(), // Dummy category ID
            images: [{ url: 'http://example.com/image.png', key: 'image.png' }],
            isActive: true,
            inStock: true,
            sku: 'TEST-MILK-001',
            productType: 'Food',
            productDetails: {
                fssaiLicenceNumber: '12345678901234',
                isVegetarian: true,
                shelfLife: '3 Days',
                keyFeatures: ['Organic']
            }
        });
        productId = (product as any)._id.toString();
    });

    afterAll(async () => {
        // Cleanup
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should add item to cart', async () => {
        const res = await request(app)
            .post('/v1/customer/cart')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                productId,
                quantity: 2
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.items).toHaveLength(1);
        expect(res.body.result.items[0].productId).toBe(productId);
        expect(res.body.result.items[0].quantity).toBe(2);
        expect(res.body.result.subtotal).toBe(100); // 50 * 2
    });

    it('should get user cart', async () => {
        const res = await request(app)
            .get('/v1/customer/cart')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.items).toHaveLength(1);
    });

    it('should update cart item quantity', async () => {
        const res = await request(app)
            .put(`/v1/customer/cart/${productId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                quantity: 5
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.items[0].quantity).toBe(5);
        expect(res.body.result.subtotal).toBe(250); // 50 * 5
    });

    it('should remove item from cart', async () => {
        const res = await request(app)
            .delete(`/v1/customer/cart/${productId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.items).toHaveLength(0);
    });
});
