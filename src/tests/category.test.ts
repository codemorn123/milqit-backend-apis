import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { CategoryModel } from '../models/category.model';
import { UserModel } from '../models/UserModel';
import { config } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { tokenService } from '../services/token.service';

config({ path: '.env.test' });

jest.setTimeout(30000);

describe('Category API Tests', () => {
    let mongoServer: MongoMemoryServer;
    let adminToken: string;

    beforeAll(async () => {
        console.log('Starting MongoMemoryServer...');
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        console.log(`Connecting to In-Memory DB: ${uri}`);
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Create Admin User
        const admin = await UserModel.create({
            name: 'Admin User',
            phone: '+919999999990',
            passwordHash: 'hashedpassword',
            isActive: true,
            isPhoneVerified: true,
            roles: ['admin']
        });
        const adminTokens = tokenService.generateAuthTokens((admin as any)._id.toString(), ['admin']);
        adminToken = adminTokens.accessToken;
    });

    afterAll(async () => {
        // Cleanup
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await CategoryModel.deleteMany({});
    });

    it('should create category (Admin)', async () => {
        const res = await request(app)
            .post('/v1/admin/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', 'Dairy Products')
            .field('description', 'Fresh Dairy')
            .field('backgroundColor', '#ffffff')
            .field('textColor', '#000000')
            .attach('categoryImage', Buffer.from('dummy image'), 'image.png');

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.result.name).toBe('Dairy Products');
        expect(res.body.result.slug).toBe('dairy-products');
    });

    it('should list categories (Customer)', async () => {
        // Create a category first
        await CategoryModel.create({
            name: 'Vegetables',
            slug: 'vegetables',
            description: 'Fresh Vegetables',
            isActive: true
        });

        const res = await request(app)
            .get('/v1/customer/categories');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.docs).toHaveLength(1);
        expect(res.body.result.docs[0].name).toBe('Vegetables');
    });
});
