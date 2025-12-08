import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { ProductModel } from '../models/product.model';
import { UserModel } from '../models/UserModel';
import { CategoryModel } from '../models/category.model';
import { config } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { tokenService } from '../services/token.service';

config({ path: '.env.test' });

jest.setTimeout(30000);

describe('Product API Tests', () => {
    let mongoServer: MongoMemoryServer;
    let adminToken: string;
    let customerToken: string;
    let categoryId: string;

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

        // Create Customer User
        const customer = await UserModel.create({
            name: 'Customer User',
            phone: '+919999999991',
            passwordHash: 'hashedpassword',
            isActive: true,
            isPhoneVerified: true,
            roles: ['customer']
        });
        const customerTokens = tokenService.generateAuthTokens((customer as any)._id.toString(), ['customer']);
        customerToken = customerTokens.accessToken;

        // Create Category
        const category = await CategoryModel.create({
            name: 'Dairy',
            slug: 'dairy',
            isActive: true
        });
        categoryId = (category as any)._id.toString();
    });

    afterAll(async () => {
        // Cleanup
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await ProductModel.deleteMany({});
    });

    it('should create product (Admin)', async () => {
        const res = await request(app)
            .post('/v1/admin/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', 'Fresh Milk')
            .field('description', 'Fresh Cow Milk')
            .field('mrp', '60')
            .field('sellingPrice', '50')
            .field('quantity', '100')
            .field('unit', 'litre')
            .field('category', categoryId)
            .field('isActive', 'true')
            .field('inStock', 'true')
            .field('sku', 'MILK-001')
            .field('productType', 'Food')
            .field('productDetails', JSON.stringify({
                fssaiLicenceNumber: '12345678901234',
                isVegetarian: true,
                shelfLife: '3 Days',
                keyFeatures: ['Organic']
            }))
            .attach('images', Buffer.from('dummy image'), 'image.png');

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.result.name).toBe('Fresh Milk');
    });

    it('should list products (Customer)', async () => {
        // Create a product first
        await ProductModel.create({
            name: 'Butter',
            slug: 'butter',
            description: 'Fresh Butter',
            mrp: 100,
            sellingPrice: 90,
            quantity: 50,
            unit: 'kg',
            category: categoryId,
            images: [{ url: 'http://example.com/image.png', key: 'image.png' }],
            isActive: true,
            inStock: true,
            sku: 'BUTTER-001',
            productType: 'Food',
            productDetails: {
                fssaiLicenceNumber: '12345678901234',
                isVegetarian: true,
                shelfLife: '30 Days',
                keyFeatures: ['Organic']
            }
        });

        const res = await request(app)
            .get('/v1/customer/products')
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.docs).toHaveLength(1);
        expect(res.body.result.docs[0].name).toBe('Butter');
    });

    it('should search products (Customer)', async () => {
        // Create products
        await ProductModel.create([
            {
                name: 'Paneer',
                slug: 'paneer',
                description: 'Fresh Paneer',
                mrp: 200,
                sellingPrice: 180,
                quantity: 20,
                unit: 'kg',
                category: categoryId,
                images: [{ url: 'http://example.com/image.png', key: 'image.png' }],
                isActive: true,
                inStock: true,
                sku: 'PANEER-001',
                productType: 'Food',
                productDetails: {
                    fssaiLicenceNumber: '12345678901234',
                    isVegetarian: true,
                    shelfLife: '7 Days',
                    keyFeatures: ['Organic']
                }
            },
            {
                name: 'Curd',
                slug: 'curd',
                description: 'Fresh Curd',
                mrp: 40,
                sellingPrice: 35,
                quantity: 30,
                unit: 'kg',
                category: categoryId,
                images: [{ url: 'http://example.com/image.png', key: 'image.png' }],
                isActive: true,
                inStock: true,
                sku: 'CURD-001',
                productType: 'Food',
                productDetails: {
                    fssaiLicenceNumber: '12345678901234',
                    isVegetarian: true,
                    shelfLife: '5 Days',
                    keyFeatures: ['Organic']
                }
            }
        ]);

        const res = await request(app)
            .get('/v1/customer/products/search')
            .query({ q: 'Paneer' })
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.result.docs).toHaveLength(1);
        expect(res.body.result.docs[0].name).toBe('Paneer');
    });
});
