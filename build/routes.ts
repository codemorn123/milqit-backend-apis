/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MobileUserController } from './../src/controllers/user/users.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserProductController } from './../src/controllers/user/user.product.Controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MobileCategoryController } from './../src/controllers/user/user.category.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserCartController } from './../src/controllers/user/user.cart.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SubscriptionController } from './../src/controllers/user/subscription.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MobileAuthController } from './../src/controllers/user/mobile.auth.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ImagesController } from './../src/controllers/admin/image.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminCartController } from './../src/controllers/admin/admin.cart.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminController } from './../src/controllers/admin/admin.auth.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminProductController } from './../src/controllers/admin/AdminProductController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminCategoryController } from './../src/controllers/admin/AdminCategoriesController';
import { expressAuthentication } from './../src/middleware/auth-helper';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "customErrorCode": {
        "dataType": "refAlias",
        "type": {"dataType":"enum","enums":["SERVER_ERROR","UNAUTHORIZED","FORBIDDEN","NOT_FOUND","VALIDATION_ERROR","EXCEL_ERROR","AWS_ERROR","BAD_REQUEST","TOO_MANY_REQUESTS","CONFLICT"],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClientErrorInterface": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[false],"required":true},
            "code": {"ref":"customErrorCode","required":true},
            "status": {"dataType":"double","required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
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
    "UserProfile": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"string"},
            "roles": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "isActive": {"dataType":"boolean","required":true},
            "isEmailVerified": {"dataType":"boolean","required":true},
            "isPhoneVerified": {"dataType":"boolean","required":true},
            "lastLogin": {"dataType":"string"},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_UserProfile_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"UserProfile","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse____": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_UserProfile_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string"},"name":{"dataType":"string"},"email":{"dataType":"string"},"phone":{"dataType":"string"},"roles":{"dataType":"array","array":{"dataType":"string"}},"isActive":{"dataType":"boolean"},"isEmailVerified":{"dataType":"boolean"},"isPhoneVerified":{"dataType":"boolean"},"lastLogin":{"dataType":"string"},"createdAt":{"dataType":"string"},"updatedAt":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_any_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"any","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__success-boolean__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"success":{"dataType":"boolean","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "mongoose.Types.ObjectId": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidUnit": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["piece"]},{"dataType":"enum","enums":["kg"]},{"dataType":"enum","enums":["gm"]},{"dataType":"enum","enums":["litre"]},{"dataType":"enum","enums":["ml"]},{"dataType":"enum","enums":["pack"]},{"dataType":"enum","enums":["dozen"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProduct": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "price": {"dataType":"double","required":true},
            "compareAtPrice": {"dataType":"double"},
            "categoryId": {"ref":"mongoose.Types.ObjectId","required":true},
            "sku": {"dataType":"string","required":true},
            "images": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "quantity": {"dataType":"double","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "isFeatured": {"dataType":"boolean","required":true},
            "inStock": {"dataType":"boolean","required":true},
            "brand": {"dataType":"string"},
            "unit": {"ref":"ValidUnit","required":true},
            "user": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IProduct_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IProduct"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_IProduct__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IProduct_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductFilterQueryParams": {
        "dataType": "refObject",
        "properties": {
            "q": {"dataType":"string"},
            "page": {"dataType":"double"},
            "limit": {"dataType":"double"},
            "search": {"dataType":"string"},
            "categoryId": {"dataType":"string"},
            "minPrice": {"dataType":"double"},
            "maxPrice": {"dataType":"double"},
            "brand": {"dataType":"string"},
            "unit": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["piece"]},{"dataType":"enum","enums":["kg"]},{"dataType":"enum","enums":["gm"]},{"dataType":"enum","enums":["litre"]},{"dataType":"enum","enums":["ml"]},{"dataType":"enum","enums":["pack"]},{"dataType":"enum","enums":["dozen"]}]},
            "sortBy": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["name"]},{"dataType":"enum","enums":["price"]},{"dataType":"enum","enums":["createdAt"]},{"dataType":"enum","enums":["popularity"]},{"dataType":"enum","enums":["rating"]},{"dataType":"enum","enums":["quantity"]},{"dataType":"enum","enums":["unit"]},{"dataType":"enum","enums":["relevance"]}]},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
            "isActive": {"dataType":"enum","enums":[true]},
            "isPublic": {"dataType":"enum","enums":[true]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IProduct_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IProduct","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IProduct-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"IProduct"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__id-string--name-string--isAvailable-boolean--quantity-number--unit-string--estimatedDelivery_63_-string__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"estimatedDelivery":{"dataType":"string"},"unit":{"dataType":"string","required":true},"quantity":{"dataType":"double","required":true},"isAvailable":{"dataType":"boolean","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICategory": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "image": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "displayOrder": {"dataType":"double","required":true},
            "parentId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"enum","enums":[null]}]},
            "icon": {"dataType":"string"},
            "bannerImage": {"dataType":"string"},
            "backgroundColor": {"dataType":"string"},
            "textColor": {"dataType":"string"},
            "deepLink": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_ICategory_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"ICategory"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_ICategory__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_ICategory_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IFilter": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"double"},
            "limit": {"dataType":"double"},
            "isActive": {"dataType":"boolean"},
            "search": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICartItem": {
        "dataType": "refObject",
        "properties": {
            "productId": {"ref":"mongoose.Types.ObjectId","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "price": {"dataType":"double","required":true},
            "compareAtPrice": {"dataType":"double"},
            "quantity": {"dataType":"double","required":true},
            "unit": {"ref":"ValidUnit","required":true},
            "images": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "brand": {"dataType":"string"},
            "categoryId": {"ref":"mongoose.Types.ObjectId","required":true},
            "sku": {"dataType":"string","required":true},
            "isAvailable": {"dataType":"boolean","required":true},
            "maxQuantity": {"dataType":"double","required":true},
            "subtotal": {"dataType":"double","required":true},
            "discount": {"dataType":"double","required":true},
            "finalPrice": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["checkout"]},{"dataType":"enum","enums":["completed"]},{"dataType":"enum","enums":["abandoned"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeliveryType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["standard"]},{"dataType":"enum","enums":["express"]},{"dataType":"enum","enums":["scheduled"]},{"dataType":"enum","enums":["pickup"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDeviceInfo": {
        "dataType": "refObject",
        "properties": {
            "platform": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ios"]},{"dataType":"enum","enums":["android"]}],"required":true},
            "version": {"dataType":"string","required":true},
            "deviceId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILocation": {
        "dataType": "refObject",
        "properties": {
            "latitude": {"dataType":"double","required":true},
            "longitude": {"dataType":"double","required":true},
            "address": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICart": {
        "dataType": "refObject",
        "properties": {
            "userId": {"ref":"mongoose.Types.ObjectId","required":true},
            "sessionId": {"dataType":"string"},
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"ICartItem"},"required":true},
            "totalItems": {"dataType":"double","required":true},
            "subtotal": {"dataType":"double","required":true},
            "discount": {"dataType":"double","required":true},
            "deliveryCharges": {"dataType":"double","required":true},
            "taxes": {"dataType":"double","required":true},
            "totalAmount": {"dataType":"double","required":true},
            "savings": {"dataType":"double","required":true},
            "status": {"ref":"CartStatus","required":true},
            "deliveryType": {"ref":"DeliveryType","required":true},
            "deliveryAddress": {"ref":"mongoose.Types.ObjectId"},
            "scheduledDelivery": {"dataType":"datetime"},
            "estimatedDelivery": {"dataType":"datetime"},
            "appliedCoupons": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "notes": {"dataType":"string"},
            "deviceInfo": {"ref":"IDeviceInfo"},
            "location": {"ref":"ILocation"},
            "isActive": {"dataType":"boolean","required":true},
            "expiresAt": {"dataType":"datetime","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_ICart_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"ICart","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddToCartRequest": {
        "dataType": "refObject",
        "properties": {
            "productId": {"dataType":"string","required":true},
            "quantity": {"dataType":"double","required":true},
            "notes": {"dataType":"string"},
            "deviceInfo": {"dataType":"nestedObjectLiteral","nestedProperties":{"deviceId":{"dataType":"string","required":true},"version":{"dataType":"string","required":true},"platform":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ios"]},{"dataType":"enum","enums":["android"]}],"required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCartItemRequest": {
        "dataType": "refObject",
        "properties": {
            "quantity": {"dataType":"double","required":true},
            "notes": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClearCartRequest": {
        "dataType": "refObject",
        "properties": {
            "confirmClear": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApplyCouponRequest": {
        "dataType": "refObject",
        "properties": {
            "couponCode": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SetDeliveryInfoRequest": {
        "dataType": "refObject",
        "properties": {
            "deliveryType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["standard"]},{"dataType":"enum","enums":["express"]},{"dataType":"enum","enums":["scheduled"]},{"dataType":"enum","enums":["pickup"]}],"required":true},
            "deliveryAddress": {"dataType":"string"},
            "scheduledDelivery": {"dataType":"datetime"},
            "location": {"dataType":"nestedObjectLiteral","nestedProperties":{"address":{"dataType":"string","required":true},"longitude":{"dataType":"double","required":true},"latitude":{"dataType":"double","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISubscription": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "productType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["milk"]},{"dataType":"enum","enums":["vegetable"]}],"required":true},
            "plan": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["daily"]},{"dataType":"enum","enums":["weekly"]},{"dataType":"enum","enums":["monthly"]}],"required":true},
            "startDate": {"dataType":"datetime","required":true},
            "endDate": {"dataType":"string"},
            "quantity": {"dataType":"double","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "productName": {"dataType":"string","required":true},
            "subscriptionType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["milk"]},{"dataType":"enum","enums":["vegetable"]},{"dataType":"enum","enums":["other"]}],"required":true},
            "planType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["daily"]},{"dataType":"enum","enums":["weekly"]},{"dataType":"enum","enums":["monthly"]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_ISubscription-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"ISubscription"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_ISubscription_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"ISubscription","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_ISubscription_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string"},"userId":{"dataType":"string"},"productType":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["milk"]},{"dataType":"enum","enums":["vegetable"]}]},"plan":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["daily"]},{"dataType":"enum","enums":["weekly"]},{"dataType":"enum","enums":["monthly"]}]},"startDate":{"dataType":"datetime"},"endDate":{"dataType":"string"},"quantity":{"dataType":"double"},"isActive":{"dataType":"boolean"},"productName":{"dataType":"string"},"subscriptionType":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["milk"]},{"dataType":"enum","enums":["vegetable"]},{"dataType":"enum","enums":["other"]}]},"planType":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["daily"]},{"dataType":"enum","enums":["weekly"]},{"dataType":"enum","enums":["monthly"]}]}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__isNewUser-boolean--otp-string__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"otp":{"dataType":"string","required":true},"isNewUser":{"dataType":"boolean","required":true}},"required":true},
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
    "SuccessResponse_IAuthResponse_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IAuthResponse","required":true},
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
    "SuccessResponse__otp-string__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"otp":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IImage": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string"},
            "url": {"dataType":"string"},
            "key": {"dataType":"string"},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPaginated": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "totalRecord": {"dataType":"double","required":true},
            "totalPage": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_ICart_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"ICart"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_ICart__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_ICart_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserInfo": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "email": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartItem": {
        "dataType": "refObject",
        "properties": {
            "productId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "price": {"dataType":"double","required":true},
            "compareAtPrice": {"dataType":"double"},
            "quantity": {"dataType":"double","required":true},
            "unit": {"dataType":"string","required":true},
            "images": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "brand": {"dataType":"string"},
            "categoryId": {"dataType":"string","required":true},
            "sku": {"dataType":"string","required":true},
            "isAvailable": {"dataType":"boolean","required":true},
            "maxQuantity": {"dataType":"double","required":true},
            "subtotal": {"dataType":"double","required":true},
            "discount": {"dataType":"double","required":true},
            "finalPrice": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Address": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "city": {"dataType":"string","required":true},
            "state": {"dataType":"string","required":true},
            "pincode": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeviceInfo": {
        "dataType": "refObject",
        "properties": {
            "platform": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ios"]},{"dataType":"enum","enums":["android"]}],"required":true},
            "version": {"dataType":"string","required":true},
            "deviceId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Location": {
        "dataType": "refObject",
        "properties": {
            "latitude": {"dataType":"double","required":true},
            "longitude": {"dataType":"double","required":true},
            "address": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Cart": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "userInfo": {"ref":"UserInfo"},
            "sessionId": {"dataType":"string"},
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"CartItem"},"required":true},
            "totalItems": {"dataType":"double","required":true},
            "subtotal": {"dataType":"double","required":true},
            "discount": {"dataType":"double","required":true},
            "deliveryCharges": {"dataType":"double","required":true},
            "taxes": {"dataType":"double","required":true},
            "totalAmount": {"dataType":"double","required":true},
            "savings": {"dataType":"double","required":true},
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["checkout"]},{"dataType":"enum","enums":["completed"]},{"dataType":"enum","enums":["abandoned"]}],"required":true},
            "deliveryType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["standard"]},{"dataType":"enum","enums":["express"]},{"dataType":"enum","enums":["scheduled"]},{"dataType":"enum","enums":["pickup"]}],"required":true},
            "deliveryAddress": {"ref":"Address"},
            "scheduledDelivery": {"dataType":"string"},
            "estimatedDelivery": {"dataType":"string"},
            "appliedCoupons": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "notes": {"dataType":"string"},
            "deviceInfo": {"ref":"DeviceInfo"},
            "location": {"ref":"Location"},
            "isActive": {"dataType":"boolean","required":true},
            "expiresAt": {"dataType":"string","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartDetailResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"cart":{"ref":"Cart","required":true}},"required":true},
            "timestamp": {"dataType":"string","required":true},
            "user": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartAnalytics": {
        "dataType": "refObject",
        "properties": {
            "totalCarts": {"dataType":"double","required":true},
            "activeCarts": {"dataType":"double","required":true},
            "abandonedCarts": {"dataType":"double","required":true},
            "completedCarts": {"dataType":"double","required":true},
            "abandonmentRate": {"dataType":"string","required":true},
            "averageCartValue": {"dataType":"double","required":true},
            "topProducts": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"totalQuantity":{"dataType":"double","required":true},"name":{"dataType":"string","required":true},"productId":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartAnalyticsResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"analytics":{"ref":"CartAnalytics","required":true}},"required":true},
            "timestamp": {"dataType":"string","required":true},
            "user": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanupResult": {
        "dataType": "refObject",
        "properties": {
            "deletedCount": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartCleanupResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"result":{"ref":"CleanupResult","required":true}},"required":true},
            "timestamp": {"dataType":"string","required":true},
            "user": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FunnelData": {
        "dataType": "refObject",
        "properties": {
            "active": {"dataType":"nestedObjectLiteral","nestedProperties":{"totalValue":{"dataType":"double","required":true},"count":{"dataType":"double","required":true}}},
            "checkout": {"dataType":"nestedObjectLiteral","nestedProperties":{"totalValue":{"dataType":"double","required":true},"count":{"dataType":"double","required":true}}},
            "completed": {"dataType":"nestedObjectLiteral","nestedProperties":{"totalValue":{"dataType":"double","required":true},"count":{"dataType":"double","required":true}}},
            "abandoned": {"dataType":"nestedObjectLiteral","nestedProperties":{"totalValue":{"dataType":"double","required":true},"count":{"dataType":"double","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartFunnel": {
        "dataType": "refObject",
        "properties": {
            "funnelData": {"ref":"FunnelData","required":true},
            "conversionRates": {"dataType":"nestedObjectLiteral","nestedProperties":{"overallConversion":{"dataType":"string","required":true},"checkoutToCompleted":{"dataType":"string","required":true},"activeToCheckout":{"dataType":"string","required":true}},"required":true},
            "totalCarts": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CartFunnelResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"funnel":{"ref":"CartFunnel","required":true}},"required":true},
            "timestamp": {"dataType":"string","required":true},
            "user": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateAdminRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"string"},
            "password": {"dataType":"string","required":true},
            "isActive": {"dataType":"boolean"},
            "roles": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["admin"]},{"dataType":"enum","enums":["manager"]},{"dataType":"enum","enums":["staff"]}]},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__user-UserProfile--tokens-AuthTokens__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"tokens":{"ref":"AuthTokens","required":true},"user":{"ref":"UserProfile","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_UserProfile-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"UserProfile"},"required":true},
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
    "CategoryDTO": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_CategoryDTO_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"CategoryDTO","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateCategoryRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "image": {"dataType":"string"},
            "icon": {"dataType":"string"},
            "banner": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_ICategory_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"ICategory","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsMobileUserController_getUserProfile: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.get('/mobile/user/:userId/profile',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController)),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController.prototype.getUserProfile)),

            async function MobileUserController_getUserProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileUserController_getUserProfile, request, response });

                const controller = new MobileUserController();

              await templateService.apiHandler({
                methodName: 'getUserProfile',
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
        const argsMobileUserController_updateProfile: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"Partial_UserProfile_"},
        };
        app.put('/mobile/user/:userId/profile',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController)),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController.prototype.updateProfile)),

            async function MobileUserController_updateProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileUserController_updateProfile, request, response });

                const controller = new MobileUserController();

              await templateService.apiHandler({
                methodName: 'updateProfile',
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
        const argsMobileUserController_getAddresses: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.get('/mobile/user/:userId/addresses',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController)),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController.prototype.getAddresses)),

            async function MobileUserController_getAddresses(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileUserController_getAddresses, request, response });

                const controller = new MobileUserController();

              await templateService.apiHandler({
                methodName: 'getAddresses',
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
        const argsMobileUserController_addAddress: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                address: {"in":"body","name":"address","required":true,"dataType":"any"},
        };
        app.post('/mobile/user/:userId/addresses',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController)),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController.prototype.addAddress)),

            async function MobileUserController_addAddress(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileUserController_addAddress, request, response });

                const controller = new MobileUserController();

              await templateService.apiHandler({
                methodName: 'addAddress',
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
        const argsMobileUserController_setPrimaryAddress: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"addressId":{"dataType":"string","required":true}}},
        };
        app.put('/mobile/user/:userId/addresses/primary',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController)),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController.prototype.setPrimaryAddress)),

            async function MobileUserController_setPrimaryAddress(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileUserController_setPrimaryAddress, request, response });

                const controller = new MobileUserController();

              await templateService.apiHandler({
                methodName: 'setPrimaryAddress',
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
        const argsMobileUserController_removeAddress: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"addressId":{"dataType":"string","required":true}}},
        };
        app.delete('/mobile/user/:userId/addresses',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController)),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController.prototype.removeAddress)),

            async function MobileUserController_removeAddress(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileUserController_removeAddress, request, response });

                const controller = new MobileUserController();

              await templateService.apiHandler({
                methodName: 'removeAddress',
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
        const argsUserProductController_getProducts: Record<string, TsoaRoute.ParameterSchema> = {
                filters: {"in":"queries","name":"filters","required":true,"ref":"ProductFilterQueryParams"},
        };
        app.get('/user/products',
            ...(fetchMiddlewares<RequestHandler>(UserProductController)),
            ...(fetchMiddlewares<RequestHandler>(UserProductController.prototype.getProducts)),

            async function UserProductController_getProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserProductController_getProducts, request, response });

                const controller = new UserProductController();

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
        const argsUserProductController_getProductById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/user/products/:id',
            ...(fetchMiddlewares<RequestHandler>(UserProductController)),
            ...(fetchMiddlewares<RequestHandler>(UserProductController.prototype.getProductById)),

            async function UserProductController_getProductById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserProductController_getProductById, request, response });

                const controller = new UserProductController();

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
        const argsUserProductController_getProductsByCategory: Record<string, TsoaRoute.ParameterSchema> = {
                filters: {"in":"queries","name":"filters","required":true,"ref":"ProductFilterQueryParams"},
        };
        app.get('/user/products/category/:categoryId',
            ...(fetchMiddlewares<RequestHandler>(UserProductController)),
            ...(fetchMiddlewares<RequestHandler>(UserProductController.prototype.getProductsByCategory)),

            async function UserProductController_getProductsByCategory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserProductController_getProductsByCategory, request, response });

                const controller = new UserProductController();

              await templateService.apiHandler({
                methodName: 'getProductsByCategory',
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
        const argsUserProductController_searchProducts: Record<string, TsoaRoute.ParameterSchema> = {
                filters: {"in":"queries","name":"filters","required":true,"ref":"ProductFilterQueryParams"},
        };
        app.get('/user/products/search',
            ...(fetchMiddlewares<RequestHandler>(UserProductController)),
            ...(fetchMiddlewares<RequestHandler>(UserProductController.prototype.searchProducts)),

            async function UserProductController_searchProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserProductController_searchProducts, request, response });

                const controller = new UserProductController();

              await templateService.apiHandler({
                methodName: 'searchProducts',
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
        const argsUserProductController_getFeaturedProducts: Record<string, TsoaRoute.ParameterSchema> = {
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/user/products/featured',
            ...(fetchMiddlewares<RequestHandler>(UserProductController)),
            ...(fetchMiddlewares<RequestHandler>(UserProductController.prototype.getFeaturedProducts)),

            async function UserProductController_getFeaturedProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserProductController_getFeaturedProducts, request, response });

                const controller = new UserProductController();

              await templateService.apiHandler({
                methodName: 'getFeaturedProducts',
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
        const argsUserProductController_getRelatedProducts: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/user/products/:id/related',
            ...(fetchMiddlewares<RequestHandler>(UserProductController)),
            ...(fetchMiddlewares<RequestHandler>(UserProductController.prototype.getRelatedProducts)),

            async function UserProductController_getRelatedProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserProductController_getRelatedProducts, request, response });

                const controller = new UserProductController();

              await templateService.apiHandler({
                methodName: 'getRelatedProducts',
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
        const argsUserProductController_getProductAvailability: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/user/products/:id/availability',
            ...(fetchMiddlewares<RequestHandler>(UserProductController)),
            ...(fetchMiddlewares<RequestHandler>(UserProductController.prototype.getProductAvailability)),

            async function UserProductController_getProductAvailability(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserProductController_getProductAvailability, request, response });

                const controller = new UserProductController();

              await templateService.apiHandler({
                methodName: 'getProductAvailability',
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
        const argsMobileCategoryController_listCategories: Record<string, TsoaRoute.ParameterSchema> = {
                filter: {"in":"queries","name":"filter","required":true,"ref":"IFilter"},
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
        const argsMobileCategoryController_getFeaturedCategories: Record<string, TsoaRoute.ParameterSchema> = {
                options: {"in":"queries","name":"options","required":true,"ref":"IFilter"},
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
        const argsUserCartController_addToCart: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"AddToCartRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/user/cart',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserCartController)),
            ...(fetchMiddlewares<RequestHandler>(UserCartController.prototype.addToCart)),

            async function UserCartController_addToCart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserCartController_addToCart, request, response });

                const controller = new UserCartController();

              await templateService.apiHandler({
                methodName: 'addToCart',
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
        const argsUserCartController_getCart: Record<string, TsoaRoute.ParameterSchema> = {
                includeUnavailable: {"default":false,"in":"query","name":"includeUnavailable","dataType":"boolean"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/user/cart',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserCartController)),
            ...(fetchMiddlewares<RequestHandler>(UserCartController.prototype.getCart)),

            async function UserCartController_getCart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserCartController_getCart, request, response });

                const controller = new UserCartController();

              await templateService.apiHandler({
                methodName: 'getCart',
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
        const argsUserCartController_updateCartItem: Record<string, TsoaRoute.ParameterSchema> = {
                productId: {"in":"path","name":"productId","required":true,"dataType":"string"},
                request: {"in":"body","name":"request","required":true,"ref":"UpdateCartItemRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.put('/user/cart/:productId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserCartController)),
            ...(fetchMiddlewares<RequestHandler>(UserCartController.prototype.updateCartItem)),

            async function UserCartController_updateCartItem(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserCartController_updateCartItem, request, response });

                const controller = new UserCartController();

              await templateService.apiHandler({
                methodName: 'updateCartItem',
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
        const argsUserCartController_removeFromCart: Record<string, TsoaRoute.ParameterSchema> = {
                productId: {"in":"path","name":"productId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.delete('/user/cart/:productId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserCartController)),
            ...(fetchMiddlewares<RequestHandler>(UserCartController.prototype.removeFromCart)),

            async function UserCartController_removeFromCart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserCartController_removeFromCart, request, response });

                const controller = new UserCartController();

              await templateService.apiHandler({
                methodName: 'removeFromCart',
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
        const argsUserCartController_clearCart: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"ClearCartRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.delete('/user/cart',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserCartController)),
            ...(fetchMiddlewares<RequestHandler>(UserCartController.prototype.clearCart)),

            async function UserCartController_clearCart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserCartController_clearCart, request, response });

                const controller = new UserCartController();

              await templateService.apiHandler({
                methodName: 'clearCart',
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
        const argsUserCartController_applyCoupon: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"ApplyCouponRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/user/cart/coupon',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserCartController)),
            ...(fetchMiddlewares<RequestHandler>(UserCartController.prototype.applyCoupon)),

            async function UserCartController_applyCoupon(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserCartController_applyCoupon, request, response });

                const controller = new UserCartController();

              await templateService.apiHandler({
                methodName: 'applyCoupon',
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
        const argsUserCartController_setDeliveryInfo: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"SetDeliveryInfoRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/user/cart/delivery',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserCartController)),
            ...(fetchMiddlewares<RequestHandler>(UserCartController.prototype.setDeliveryInfo)),

            async function UserCartController_setDeliveryInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserCartController_setDeliveryInfo, request, response });

                const controller = new UserCartController();

              await templateService.apiHandler({
                methodName: 'setDeliveryInfo',
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
        const argsUserCartController_getCartSummary: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/user/cart/summary',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserCartController)),
            ...(fetchMiddlewares<RequestHandler>(UserCartController.prototype.getCartSummary)),

            async function UserCartController_getCartSummary(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserCartController_getCartSummary, request, response });

                const controller = new UserCartController();

              await templateService.apiHandler({
                methodName: 'getCartSummary',
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
        const argsSubscriptionController_getAllSubscriptions: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/mobile/subscriptions',
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController)),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController.prototype.getAllSubscriptions)),

            async function SubscriptionController_getAllSubscriptions(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubscriptionController_getAllSubscriptions, request, response });

                const controller = new SubscriptionController();

              await templateService.apiHandler({
                methodName: 'getAllSubscriptions',
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
        const argsSubscriptionController_createSubscription: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"Partial_ISubscription_"},
        };
        app.post('/mobile/subscriptions',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController)),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController.prototype.createSubscription)),

            async function SubscriptionController_createSubscription(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubscriptionController_createSubscription, request, response });

                const controller = new SubscriptionController();

              await templateService.apiHandler({
                methodName: 'createSubscription',
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
        const argsSubscriptionController_getSubscriptions: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.get('/mobile/subscriptions/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController)),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController.prototype.getSubscriptions)),

            async function SubscriptionController_getSubscriptions(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubscriptionController_getSubscriptions, request, response });

                const controller = new SubscriptionController();

              await templateService.apiHandler({
                methodName: 'getSubscriptions',
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
        const argsSubscriptionController_getSubscription: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/mobile/subscriptions/detail/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController)),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController.prototype.getSubscription)),

            async function SubscriptionController_getSubscription(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubscriptionController_getSubscription, request, response });

                const controller = new SubscriptionController();

              await templateService.apiHandler({
                methodName: 'getSubscription',
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
        const argsSubscriptionController_updateSubscription: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"Partial_ISubscription_"},
        };
        app.put('/mobile/subscriptions/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController)),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController.prototype.updateSubscription)),

            async function SubscriptionController_updateSubscription(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubscriptionController_updateSubscription, request, response });

                const controller = new SubscriptionController();

              await templateService.apiHandler({
                methodName: 'updateSubscription',
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
        const argsSubscriptionController_cancelSubscription: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.put('/mobile/subscriptions/:id/cancel',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController)),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController.prototype.cancelSubscription)),

            async function SubscriptionController_cancelSubscription(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubscriptionController_cancelSubscription, request, response });

                const controller = new SubscriptionController();

              await templateService.apiHandler({
                methodName: 'cancelSubscription',
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
        const argsSubscriptionController_deleteSubscription: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/mobile/subscriptions/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController)),
            ...(fetchMiddlewares<RequestHandler>(SubscriptionController.prototype.deleteSubscription)),

            async function SubscriptionController_deleteSubscription(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSubscriptionController_deleteSubscription, request, response });

                const controller = new SubscriptionController();

              await templateService.apiHandler({
                methodName: 'deleteSubscription',
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
                successStatus: undefined,
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
                successStatus: undefined,
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
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsImagesController_uploadImage: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/images',
            ...(fetchMiddlewares<RequestHandler>(ImagesController)),
            ...(fetchMiddlewares<RequestHandler>(ImagesController.prototype.uploadImage)),

            async function ImagesController_uploadImage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsImagesController_uploadImage, request, response });

                const controller = new ImagesController();

              await templateService.apiHandler({
                methodName: 'uploadImage',
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
        const argsImagesController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"IFilter"},
        };
        app.get('/images',
            ...(fetchMiddlewares<RequestHandler>(ImagesController)),
            ...(fetchMiddlewares<RequestHandler>(ImagesController.prototype.getAll)),

            async function ImagesController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsImagesController_getAll, request, response });

                const controller = new ImagesController();

              await templateService.apiHandler({
                methodName: 'getAll',
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
        const argsImagesController_getById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/images/:id',
            ...(fetchMiddlewares<RequestHandler>(ImagesController)),
            ...(fetchMiddlewares<RequestHandler>(ImagesController.prototype.getById)),

            async function ImagesController_getById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsImagesController_getById, request, response });

                const controller = new ImagesController();

              await templateService.apiHandler({
                methodName: 'getById',
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
        const argsImagesController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.put('/images/:id',
            ...(fetchMiddlewares<RequestHandler>(ImagesController)),
            ...(fetchMiddlewares<RequestHandler>(ImagesController.prototype.update)),

            async function ImagesController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsImagesController_update, request, response });

                const controller = new ImagesController();

              await templateService.apiHandler({
                methodName: 'update',
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
        const argsImagesController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/images/:id',
            ...(fetchMiddlewares<RequestHandler>(ImagesController)),
            ...(fetchMiddlewares<RequestHandler>(ImagesController.prototype.delete)),

            async function ImagesController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsImagesController_delete, request, response });

                const controller = new ImagesController();

              await templateService.apiHandler({
                methodName: 'delete',
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
        const argsAdminCartController_getCarts: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":20,"in":"query","name":"limit","dataType":"double"},
                status: {"in":"query","name":"status","dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["checkout"]},{"dataType":"enum","enums":["completed"]},{"dataType":"enum","enums":["abandoned"]}]},
                userId: {"in":"query","name":"userId","dataType":"string"},
                startDate: {"in":"query","name":"startDate","dataType":"string"},
                endDate: {"in":"query","name":"endDate","dataType":"string"},
                sortBy: {"default":"createdAt","in":"query","name":"sortBy","dataType":"union","subSchemas":[{"dataType":"enum","enums":["createdAt"]},{"dataType":"enum","enums":["totalAmount"]},{"dataType":"enum","enums":["totalItems"]}]},
                sortOrder: {"default":"desc","in":"query","name":"sortOrder","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
        };
        app.get('/admin/carts',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController.prototype.getCarts)),

            async function AdminCartController_getCarts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCartController_getCarts, request, response });

                const controller = new AdminCartController();

              await templateService.apiHandler({
                methodName: 'getCarts',
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
        const argsAdminCartController_getCartById: Record<string, TsoaRoute.ParameterSchema> = {
                cartId: {"in":"path","name":"cartId","required":true,"dataType":"string"},
        };
        app.get('/admin/carts/:cartId',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController.prototype.getCartById)),

            async function AdminCartController_getCartById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCartController_getCartById, request, response });

                const controller = new AdminCartController();

              await templateService.apiHandler({
                methodName: 'getCartById',
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
        const argsAdminCartController_getCartAnalytics: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/carts/analytics/stats',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController.prototype.getCartAnalytics)),

            async function AdminCartController_getCartAnalytics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCartController_getCartAnalytics, request, response });

                const controller = new AdminCartController();

              await templateService.apiHandler({
                methodName: 'getCartAnalytics',
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
        const argsAdminCartController_cleanupAbandonedCarts: Record<string, TsoaRoute.ParameterSchema> = {
                days: {"default":7,"in":"query","name":"days","dataType":"double"},
        };
        app.delete('/admin/carts/cleanup/abandoned',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController.prototype.cleanupAbandonedCarts)),

            async function AdminCartController_cleanupAbandonedCarts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCartController_cleanupAbandonedCarts, request, response });

                const controller = new AdminCartController();

              await templateService.apiHandler({
                methodName: 'cleanupAbandonedCarts',
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
        const argsAdminCartController_getCartFunnel: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/carts/analytics/funnel',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCartController.prototype.getCartFunnel)),

            async function AdminCartController_getCartFunnel(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCartController_getCartFunnel, request, response });

                const controller = new AdminCartController();

              await templateService.apiHandler({
                methodName: 'getCartFunnel',
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
        const argsAdminController_createAdmin: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateAdminRequest"},
        };
        app.post('/admin/create-admin',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.createAdmin)),

            async function AdminController_createAdmin(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_createAdmin, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'createAdmin',
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
        const argsAdminController_login: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"LoginRequest"},
        };
        app.post('/admin/login',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.login)),

            async function AdminController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_login, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'login',
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
        const argsAdminController_listUsers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/users-list',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.listUsers)),

            async function AdminController_listUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_listUsers, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'listUsers',
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
        const argsAdminController_adminlistUsers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/admin-users',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.adminlistUsers)),

            async function AdminController_adminlistUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_adminlistUsers, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'adminlistUsers',
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
                data: {"in":"body","name":"data","required":true,"ref":"IProduct"},
        };
        app.post('/admin/products',
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
                data: {"in":"body","name":"data","required":true,"ref":"IProduct"},
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
                filter: {"in":"queries","name":"filter","required":true,"ref":"ProductFilterQueryParams"},
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
                body: {"in":"body","name":"body","required":true,"ref":"CreateCategoryRequest"},
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
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCategoryController_listCategories: Record<string, TsoaRoute.ParameterSchema> = {
                fillter: {"in":"queries","name":"fillter","required":true,"ref":"IFilter"},
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
            authenticateMiddleware([{"jwt":["admin"]}]),
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
                validatedData: {"in":"body","name":"validatedData","required":true,"ref":"CreateCategoryRequest"},
        };
        app.put('/admin/categories/:id',
            authenticateMiddleware([{"jwt":["admin"]}]),
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
            authenticateMiddleware([{"jwt":["admin"]}]),
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
        const argsAdminCategoryController_reorderCategories: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"categories":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"displayOrder":{"dataType":"double","required":true},"id":{"dataType":"string","required":true}}},"required":true}}},
        };
        app.put('/admin/categories/reorder',
            authenticateMiddleware([{"jwt":["admin"]}]),
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

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
