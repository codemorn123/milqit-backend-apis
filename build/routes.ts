/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MobileAuthController } from './../src/controllers/mobile/mobile.auth.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MobileCategoryController } from './../src/controllers/mobile/CategoryController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminProductController } from './../src/controllers/admin/AdminProductController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminCategoryController } from './../src/controllers/admin/AdminCategoriesController';
import { expressAuthentication } from './../src/middleware/auth-helper';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');


const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ErrorDetail": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"nestedObjectLiteral","nestedProperties":{"details":{"dataType":"any"},"message":{"dataType":"string","required":true},"code":{"dataType":"string"}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[false],"required":true},
            "error": {"ref":"ErrorDetail","required":true},
            "timestamp": {"dataType":"string"},
            "developer": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISendOtpInput": {
        "dataType": "refObject",
        "properties": {
            "phone": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthTokens": {
        "dataType": "refObject",
        "properties": {
            "accessToken": {"dataType":"string","required":true},
            "refreshToken": {"dataType":"string","required":true},
            "expiresIn": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAuthResponse": {
        "dataType": "refObject",
        "properties": {
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"updatedAt":{"dataType":"string","required":true},"createdAt":{"dataType":"string","required":true},"isNewUser":{"dataType":"boolean","required":true},"isPhoneVerified":{"dataType":"boolean","required":true},"email":{"dataType":"string"},"phone":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
            "tokens": {"ref":"AuthTokens","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IVerifyOtpInput": {
        "dataType": "refObject",
        "properties": {
            "phone": {"dataType":"string","required":true},
            "otp": {"dataType":"string","required":true},
            "name": {"dataType":"string"},
            "deviceId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MobileCategoryResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"pagination":{"dataType":"nestedObjectLiteral","nestedProperties":{"hasMore":{"dataType":"boolean","required":true},"page":{"dataType":"double","required":true},"pages":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},"categories":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"deepLink":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"textColor":{"dataType":"string","required":true},"backgroundColor":{"dataType":"string","required":true},"slug":{"dataType":"string","required":true},"icon":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"image":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CategoryTreeResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"categoryTree":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"children":{"dataType":"array","array":{"dataType":"any"},"required":true},"slug":{"dataType":"string","required":true},"icon":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"image":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeaturedCategoriesResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"featuredCategories":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"textColor":{"dataType":"string","required":true},"backgroundColor":{"dataType":"string","required":true},"deepLink":{"dataType":"string","required":true},"image":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "price": {"dataType":"double","required":true},
            "images": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "isActive": {"dataType":"boolean","required":true},
            "inStock": {"dataType":"boolean","required":true},
            "user": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_ProductResponseDTO_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"ProductResponseDTO","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_CreateProductDTO_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"description":{"dataType":"string"},"price":{"dataType":"double"},"compareAtPrice":{"dataType":"double"},"categoryId":{"dataType":"string"},"sku":{"dataType":"string"},"quantity":{"dataType":"double"},"isActive":{"dataType":"boolean"},"brand":{"dataType":"string"},"unit":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["piece"]},{"dataType":"enum","enums":["kg"]},{"dataType":"enum","enums":["gm"]},{"dataType":"enum","enums":["litre"]},{"dataType":"enum","enums":["ml"]},{"dataType":"enum","enums":["pack"]},{"dataType":"enum","enums":["dozen"]}]}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateProductDTO": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_CreateProductDTO_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedProductsResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "products": {"dataType":"array","array":{"dataType":"refObject","ref":"ProductResponseDTO"},"required":true},
            "pagination": {"dataType":"nestedObjectLiteral","nestedProperties":{"hasPrevPage":{"dataType":"boolean","required":true},"hasNextPage":{"dataType":"boolean","required":true},"limit":{"dataType":"double","required":true},"currentPage":{"dataType":"double","required":true},"totalPages":{"dataType":"double","required":true},"totalDocs":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedProductsResponseDTO_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedProductsResponseDTO","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_null_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"enum","enums":[null],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NullSuccessResponse": {
        "dataType": "refAlias",
        "type": {"ref":"SuccessResponse_null_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.any_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CategoryResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string"},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"category":{"ref":"Record_string.any_"}},"additionalProperties":{"dataType":"any"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedCategoryResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"pagination":{"dataType":"nestedObjectLiteral","nestedProperties":{"nextPage":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"prevPage":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"hasNextPage":{"dataType":"boolean","required":true},"hasPrevPage":{"dataType":"boolean","required":true},"limit":{"dataType":"double","required":true},"page":{"dataType":"double","required":true},"pages":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},"categories":{"dataType":"array","array":{"dataType":"refAlias","ref":"Record_string.any_"},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReorderResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"results":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"success":{"dataType":"boolean","required":true},"id":{"dataType":"string","required":true}}},"required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CategoryReorderRequest": {
        "dataType": "refObject",
        "properties": {
            "categories": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"displayOrder":{"dataType":"double","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        const argsMobileAuthController_sendOtp: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ISendOtpInput"},
        };
        app.post('/mobile/auth/send-otp',
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController)),
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController.prototype.sendOtp)),

            async function MobileAuthController_sendOtp(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileAuthController_sendOtp, request, response });

                const controller = new MobileAuthController();

              await templateService.apiHandler({
                methodName: 'sendOtp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMobileAuthController_verifyOtp: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"IVerifyOtpInput"},
        };
        app.post('/mobile/auth/verify-otp',
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController)),
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController.prototype.verifyOtp)),

            async function MobileAuthController_verifyOtp(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileAuthController_verifyOtp, request, response });

                const controller = new MobileAuthController();

              await templateService.apiHandler({
                methodName: 'verifyOtp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMobileAuthController_resendOtp: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ISendOtpInput"},
        };
        app.post('/mobile/auth/resend-otp',
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController)),
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController.prototype.resendOtp)),

            async function MobileAuthController_resendOtp(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileAuthController_resendOtp, request, response });

                const controller = new MobileAuthController();

              await templateService.apiHandler({
                methodName: 'resendOtp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMobileCategoryController_listCategories: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":20,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/mobile/categories',
            ...(fetchMiddlewares<RequestHandler>(MobileCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(MobileCategoryController.prototype.listCategories)),

            async function MobileCategoryController_listCategories(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileCategoryController_listCategories, request, response });

                const controller = new MobileCategoryController();

              await templateService.apiHandler({
                methodName: 'listCategories',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMobileCategoryController_getCategoryTree: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/mobile/categories/tree',
            ...(fetchMiddlewares<RequestHandler>(MobileCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(MobileCategoryController.prototype.getCategoryTree)),

            async function MobileCategoryController_getCategoryTree(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileCategoryController_getCategoryTree, request, response });

                const controller = new MobileCategoryController();

              await templateService.apiHandler({
                methodName: 'getCategoryTree',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMobileCategoryController_getFeaturedCategories: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/mobile/categories/featured',
            ...(fetchMiddlewares<RequestHandler>(MobileCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(MobileCategoryController.prototype.getFeaturedCategories)),

            async function MobileCategoryController_getFeaturedCategories(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileCategoryController_getFeaturedCategories, request, response });

                const controller = new MobileCategoryController();

              await templateService.apiHandler({
                methodName: 'getFeaturedCategories',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminProductController_createProduct: Record<string, TsoaRoute.ParameterSchema> = {
                name: {"in":"formData","name":"name","required":true,"dataType":"string"},
                price: {"in":"formData","name":"price","required":true,"dataType":"string"},
                categoryId: {"in":"formData","name":"categoryId","required":true,"dataType":"string"},
                sku: {"in":"formData","name":"sku","required":true,"dataType":"string"},
                quantity: {"in":"formData","name":"quantity","required":true,"dataType":"string"},
                unit: {"in":"formData","name":"unit","required":true,"dataType":"string"},
                description: {"in":"formData","name":"description","dataType":"string"},
                brand: {"in":"formData","name":"brand","dataType":"string"},
                isActive: {"in":"formData","name":"isActive","dataType":"string"},
                files: {"in":"formData","name":"images","dataType":"array","array":{"dataType":"file"}},
        };
        app.post('/admin/products',
            upload.fields([
                {
                    name: "images",
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(AdminProductController)),
            ...(fetchMiddlewares<RequestHandler>(AdminProductController.prototype.createProduct)),

            async function AdminProductController_createProduct(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminProductController_createProduct, request, response });

                const controller = new AdminProductController();

              await templateService.apiHandler({
                methodName: 'createProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminProductController_updateProduct: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                data: {"in":"body","name":"data","required":true,"ref":"UpdateProductDTO"},
        };
        app.put('/admin/products/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminProductController)),
            ...(fetchMiddlewares<RequestHandler>(AdminProductController.prototype.updateProduct)),

            async function AdminProductController_updateProduct(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminProductController_updateProduct, request, response });

                const controller = new AdminProductController();

              await templateService.apiHandler({
                methodName: 'updateProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminProductController_getProducts: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                sortBy: {"in":"query","name":"sortBy","dataType":"string"},
                sortOrder: {"in":"query","name":"sortOrder","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
                search: {"in":"query","name":"search","dataType":"string"},
                isActive: {"in":"query","name":"isActive","dataType":"boolean"},
        };
        app.get('/admin/products',
            ...(fetchMiddlewares<RequestHandler>(AdminProductController)),
            ...(fetchMiddlewares<RequestHandler>(AdminProductController.prototype.getProducts)),

            async function AdminProductController_getProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminProductController_getProducts, request, response });

                const controller = new AdminProductController();

              await templateService.apiHandler({
                methodName: 'getProducts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminProductController_getProductById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/admin/products/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminProductController)),
            ...(fetchMiddlewares<RequestHandler>(AdminProductController.prototype.getProductById)),

            async function AdminProductController_getProductById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminProductController_getProductById, request, response });

                const controller = new AdminProductController();

              await templateService.apiHandler({
                methodName: 'getProductById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminProductController_deleteProduct: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/products/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminProductController)),
            ...(fetchMiddlewares<RequestHandler>(AdminProductController.prototype.deleteProduct)),

            async function AdminProductController_deleteProduct(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminProductController_deleteProduct, request, response });

                const controller = new AdminProductController();

              await templateService.apiHandler({
                methodName: 'deleteProduct',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCategoryController_createCategory: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/admin/categories',
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.createCategory)),

            async function AdminCategoryController_createCategory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_createCategory, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'createCategory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCategoryController_listCategories: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                sortBy: {"in":"query","name":"sortBy","dataType":"string"},
                sortOrder: {"in":"query","name":"sortOrder","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
                search: {"in":"query","name":"search","dataType":"string"},
                isActive: {"in":"query","name":"isActive","dataType":"boolean"},
                parentId: {"in":"query","name":"parentId","dataType":"string"},
        };
        app.get('/admin/categories',
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.listCategories)),

            async function AdminCategoryController_listCategories(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_listCategories, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'listCategories',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCategoryController_getCategoryById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/admin/categories/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.getCategoryById)),

            async function AdminCategoryController_getCategoryById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_getCategoryById, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'getCategoryById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCategoryController_updateCategory: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.put('/admin/categories/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.updateCategory)),

            async function AdminCategoryController_updateCategory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_updateCategory, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'updateCategory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCategoryController_deleteCategory: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/categories/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.deleteCategory)),

            async function AdminCategoryController_deleteCategory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_deleteCategory, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'deleteCategory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCategoryController_getCategoryTree: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/categories/tree',
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.getCategoryTree)),

            async function AdminCategoryController_getCategoryTree(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_getCategoryTree, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'getCategoryTree',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCategoryController_reorderCategories: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CategoryReorderRequest"},
        };
        app.put('/admin/categories/reorder',
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.reorderCategories)),

            async function AdminCategoryController_reorderCategories(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_reorderCategories, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'reorderCategories',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
