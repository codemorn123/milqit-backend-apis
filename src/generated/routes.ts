/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PublicSettingsController } from './../controllers/public/settings.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DeliveryBoyAuthController } from './../controllers/deliveryBoy/deliveryBoy.auth.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MobileUserController } from './../controllers/customer/users.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerProductController } from './../controllers/customer/user.product.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserCartController } from './../controllers/customer/user.cart.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SubscriptionController } from './../controllers/customer/subscription.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerSettingsController } from './../controllers/customer/settings.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerRefundController } from './../controllers/customer/refund.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerReelController } from './../controllers/customer/reel.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PaymentController } from './../controllers/customer/payment.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerOrderController } from './../controllers/customer/order.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerNotificationController } from './../controllers/customer/notification.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LocationController } from './../controllers/customer/location.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerKisanCommunityController } from './../controllers/customer/kisan-community.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerCategoryController } from './../controllers/customer/customer.category.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MobileAuthController } from './../controllers/customer/customer.auth.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerCouponController } from './../controllers/customer/coupon.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerBannerController } from './../controllers/customer/banner.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminRefundController } from './../controllers/admin/refund.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminMarketingController } from './../controllers/admin/marketing.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminUsersController } from './../controllers/admin/admin.users.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminReelController } from './../controllers/admin/admin.reel.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminProductController } from './../controllers/admin/admin.product.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminOrderController } from './../controllers/admin/admin.order.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminDeliveryBoyController } from './../controllers/admin/admin.deliveryBoy.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminDashboardController } from './../controllers/admin/admin.dashboard.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminCategoryController } from './../controllers/admin/admin.categories.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminCartController } from './../controllers/admin/admin.cart.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BannerController } from './../controllers/admin/admin.banner.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminController } from './../controllers/admin/admin.auth.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminSettingsController } from './../controllers/admin/setting/settings.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminNotificationController } from './../controllers/admin/cms/notification.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { KisanCommunityController } from './../controllers/admin/cms/kisan-community.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminCouponController } from './../controllers/admin/cms/coupon.controller';
import { expressAuthentication } from './../middleware/auth-helper';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');


const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ClientErrorInterface": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "error": {"dataType":"string","required":true},
            "code": {"dataType":"string"},
            "details": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.any_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "error": {"dataType":"string","required":true},
            "code": {"dataType":"string"},
            "details": {"ref":"Record_string.any_"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_ISettings_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"splashScreen":{"dataType":"nestedObjectLiteral","nestedProperties":{"durationSeconds":{"dataType":"double","required":true},"imageUrl":{"dataType":"string","required":true}}},"maintenanceMode":{"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true},"isEnabled":{"dataType":"boolean","required":true}}},"forceUpdate":{"dataType":"nestedObjectLiteral","nestedProperties":{"updateMessage":{"dataType":"string","required":true},"minVersion":{"dataType":"string","required":true},"isRequired":{"dataType":"boolean","required":true}}},"supportInfo":{"dataType":"nestedObjectLiteral","nestedProperties":{"phone":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}}},"featureFlags":{"dataType":"nestedObjectLiteral","nestedProperties":{"isNewPaymentGatewayVisible":{"dataType":"boolean","required":true},"isReferralEnabled":{"dataType":"boolean","required":true}}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_Partial_ISettings__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"Partial_ISettings_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__isExistingDeliveryBoy-boolean--otp-string__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"otp":{"dataType":"string","required":true},"isExistingDeliveryBoy":{"dataType":"boolean","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDeliveryBoySendOtpInput": {
        "dataType": "refObject",
        "properties": {
            "phone": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDeliveryBoy": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "email": {"dataType":"string"},
            "passwordHash": {"dataType":"string","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "isPhoneVerified": {"dataType":"boolean","required":true},
            "isEmailVerified": {"dataType":"boolean","required":true},
            "lastLogin": {"dataType":"datetime"},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "vehicleType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["bike"]},{"dataType":"enum","enums":["scooter"]},{"dataType":"enum","enums":["bicycle"]},{"dataType":"enum","enums":["car"]}]},
            "vehicleNumber": {"dataType":"string"},
            "drivingLicenseNumber": {"dataType":"string"},
            "aadharNumber": {"dataType":"string"},
            "panNumber": {"dataType":"string"},
            "isDocumentVerified": {"dataType":"boolean","required":true},
            "isBackgroundCheckDone": {"dataType":"boolean","required":true},
            "isAvailable": {"dataType":"boolean","required":true},
            "currentLocation": {"dataType":"nestedObjectLiteral","nestedProperties":{"coordinates":{"dataType":"array","array":{"dataType":"double"},"required":true},"type":{"dataType":"string","required":true}}},
            "lastLocationUpdate": {"dataType":"datetime"},
            "deliveryZone": {"dataType":"array","array":{"dataType":"string"}},
            "totalDeliveries": {"dataType":"double","required":true},
            "completedDeliveries": {"dataType":"double","required":true},
            "cancelledDeliveries": {"dataType":"double","required":true},
            "averageRating": {"dataType":"double","required":true},
            "bankAccountNumber": {"dataType":"string"},
            "ifscCode": {"dataType":"string"},
            "bankAccountHolderName": {"dataType":"string"},
            "upiId": {"dataType":"string"},
            "emergencyContactName": {"dataType":"string"},
            "emergencyContactPhone": {"dataType":"string"},
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
    "IDeliveryBoyAuthResponse": {
        "dataType": "refObject",
        "properties": {
            "deliveryBoy": {"ref":"IDeliveryBoy","required":true},
            "tokens": {"ref":"AuthTokens","required":true},
            "isNewDeliveryBoy": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IDeliveryBoyAuthResponse_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IDeliveryBoyAuthResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDeliveryBoyVerifyOtpInput": {
        "dataType": "refObject",
        "properties": {
            "phone": {"dataType":"string","required":true},
            "otp": {"dataType":"string","required":true},
            "name": {"dataType":"string"},
            "email": {"dataType":"string"},
            "vehicleType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["bike"]},{"dataType":"enum","enums":["scooter"]},{"dataType":"enum","enums":["bicycle"]},{"dataType":"enum","enums":["car"]}]},
            "vehicleNumber": {"dataType":"string"},
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
    "SuccessResponse__tokens-any__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"tokens":{"dataType":"any","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IDeliveryBoy_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IDeliveryBoy","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateDeliveryBoyProfileInput": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "email": {"dataType":"string"},
            "vehicleType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["bike"]},{"dataType":"enum","enums":["scooter"]},{"dataType":"enum","enums":["bicycle"]},{"dataType":"enum","enums":["car"]}]},
            "vehicleNumber": {"dataType":"string"},
            "drivingLicenseNumber": {"dataType":"string"},
            "deliveryZone": {"dataType":"array","array":{"dataType":"string"}},
            "emergencyContactName": {"dataType":"string"},
            "emergencyContactPhone": {"dataType":"string"},
            "bankAccountNumber": {"dataType":"string"},
            "ifscCode": {"dataType":"string"},
            "bankAccountHolderName": {"dataType":"string"},
            "upiId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateDeliveryBoyLocationInput": {
        "dataType": "refObject",
        "properties": {
            "latitude": {"dataType":"double","required":true},
            "longitude": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateDeliveryBoyAvailabilityInput": {
        "dataType": "refObject",
        "properties": {
            "isAvailable": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Address": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "label": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "city": {"dataType":"string","required":true},
            "state": {"dataType":"string","required":true},
            "pincode": {"dataType":"string","required":true},
            "landmark": {"dataType":"string"},
            "latitude": {"dataType":"double"},
            "longitude": {"dataType":"double"},
            "addressType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["home"]},{"dataType":"enum","enums":["work"]},{"dataType":"enum","enums":["other"]}],"required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "email": {"dataType":"string"},
            "passwordHash": {"dataType":"string","required":true},
            "roles": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "isActive": {"dataType":"boolean","required":true},
            "isPhoneVerified": {"dataType":"boolean","required":true},
            "isEmailVerified": {"dataType":"boolean","required":true},
            "lastLogin": {"dataType":"datetime"},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "primaryAddressId": {"dataType":"string"},
            "addresses": {"dataType":"array","array":{"dataType":"refObject","ref":"Address"}},
            "isNewUser": {"dataType":"boolean","required":true},
            "currentLocation": {"dataType":"nestedObjectLiteral","nestedProperties":{"coordinates":{"dataType":"array","array":{"dataType":"double"},"required":true},"type":{"dataType":"string","required":true}}},
            "lastLocationUpdate": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IUser_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IUser","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateProfileRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "email": {"dataType":"string"},
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
    "mongoose.Types.ObjectId": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IcommonImage": {
        "dataType": "refObject",
        "properties": {
            "url": {"dataType":"string","required":true},
            "key": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidUnit": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["piece"]},{"dataType":"enum","enums":["kg"]},{"dataType":"enum","enums":["gm"]},{"dataType":"enum","enums":["litre"]},{"dataType":"enum","enums":["ml"]},{"dataType":"enum","enums":["pack"]},{"dataType":"enum","enums":["dozen"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Food"]},{"dataType":"enum","enums":["Electronics"]},{"dataType":"enum","enums":["Apparel"]},{"dataType":"enum","enums":["General"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IFoodProductDetails": {
        "dataType": "refObject",
        "properties": {
            "fssaiLicenceNumber": {"dataType":"string"},
            "isVegetarian": {"dataType":"boolean"},
            "shelfLife": {"dataType":"string"},
            "keyFeatures": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IElectronicsProductDetails": {
        "dataType": "refObject",
        "properties": {
            "modelNumber": {"dataType":"string"},
            "warranty": {"dataType":"string"},
            "specifications": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"value":{"dataType":"string","required":true},"key":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApparelProductDetails": {
        "dataType": "refObject",
        "properties": {
            "size": {"dataType":"array","array":{"dataType":"string"}},
            "color": {"dataType":"array","array":{"dataType":"string"}},
            "material": {"dataType":"string"},
            "careInstructions": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGeneralProductDetails": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": {"dataType":"any"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductDetails": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"ref":"IFoodProductDetails"},{"ref":"IElectronicsProductDetails"},{"ref":"IApparelProductDetails"},{"ref":"IGeneralProductDetails"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IProduct.Exclude_keyofIProduct.createdBy-or-updatedBy__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"_id":{"ref":"mongoose.Types.ObjectId","required":true},"name":{"dataType":"string","required":true},"slug":{"dataType":"string","required":true},"description":{"dataType":"string"},"mrp":{"dataType":"double","required":true},"sellingPrice":{"dataType":"double","required":true},"category":{"ref":"mongoose.Types.ObjectId","required":true},"sku":{"dataType":"string","required":true},"images":{"dataType":"array","array":{"dataType":"refObject","ref":"IcommonImage"}},"quantity":{"dataType":"double","required":true},"isActive":{"dataType":"boolean","required":true},"isFeatured":{"dataType":"boolean","required":true},"inStock":{"dataType":"boolean","required":true},"brand":{"dataType":"string"},"unit":{"ref":"ValidUnit","required":true},"productType":{"ref":"ProductType","required":true},"productDetails":{"ref":"ProductDetails","required":true},"averageRating":{"dataType":"double","required":true},"reviewCount":{"dataType":"double","required":true},"createdAt":{"dataType":"datetime"},"updatedAt":{"dataType":"datetime"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomerProductResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "mrp": {"dataType":"double","required":true},
            "sellingPrice": {"dataType":"double","required":true},
            "category": {"ref":"mongoose.Types.ObjectId","required":true},
            "sku": {"dataType":"string","required":true},
            "images": {"dataType":"array","array":{"dataType":"refObject","ref":"IcommonImage"}},
            "quantity": {"dataType":"double","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "isFeatured": {"dataType":"boolean","required":true},
            "inStock": {"dataType":"boolean","required":true},
            "brand": {"dataType":"string"},
            "unit": {"ref":"ValidUnit","required":true},
            "productType": {"ref":"ProductType","required":true},
            "productDetails": {"ref":"ProductDetails","required":true},
            "averageRating": {"dataType":"double","required":true},
            "reviewCount": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
            "discountPercentage": {"dataType":"double","required":true},
            "savings": {"dataType":"double","required":true},
            "hasDiscount": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_CustomerProductResponse_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"CustomerProductResponse"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_CustomerProductResponse__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_CustomerProductResponse_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductFilters": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "limit": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "sort": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
            "search": {"dataType":"string"},
            "q": {"dataType":"string"},
            "categoryId": {"dataType":"string"},
            "category": {"dataType":"string"},
            "isPublic": {"dataType":"boolean"},
            "inStock": {"dataType":"boolean"},
            "isActive": {"dataType":"boolean"},
            "minPrice": {"dataType":"double"},
            "maxPrice": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_CustomerProductResponse-or-null_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"union","subSchemas":[{"ref":"CustomerProductResponse"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchProductFilters": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "limit": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "sort": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
            "search": {"dataType":"string"},
            "q": {"dataType":"string","required":true},
            "categoryId": {"dataType":"string"},
            "category": {"dataType":"string"},
            "isPublic": {"dataType":"boolean"},
            "inStock": {"dataType":"boolean"},
            "isActive": {"dataType":"boolean"},
            "minPrice": {"dataType":"double"},
            "maxPrice": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProduct": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "mrp": {"dataType":"double","required":true},
            "sellingPrice": {"dataType":"double","required":true},
            "category": {"ref":"mongoose.Types.ObjectId","required":true},
            "sku": {"dataType":"string","required":true},
            "images": {"dataType":"array","array":{"dataType":"refObject","ref":"IcommonImage"}},
            "quantity": {"dataType":"double","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "isFeatured": {"dataType":"boolean","required":true},
            "inStock": {"dataType":"boolean","required":true},
            "brand": {"dataType":"string"},
            "unit": {"ref":"ValidUnit","required":true},
            "productType": {"ref":"ProductType","required":true},
            "productDetails": {"ref":"ProductDetails","required":true},
            "averageRating": {"dataType":"double","required":true},
            "reviewCount": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
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
    "SaleProductFilters": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "limit": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "sort": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
            "search": {"dataType":"string"},
            "q": {"dataType":"string"},
            "categoryId": {"dataType":"string"},
            "category": {"dataType":"string"},
            "isPublic": {"dataType":"boolean"},
            "inStock": {"dataType":"boolean"},
            "isActive": {"dataType":"boolean"},
            "minPrice": {"dataType":"double"},
            "maxPrice": {"dataType":"double"},
            "minDiscount": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_CustomerProductResponse-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"CustomerProductResponse"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PriceRangeFilters": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "limit": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "sort": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
            "search": {"dataType":"string"},
            "q": {"dataType":"string"},
            "categoryId": {"dataType":"string"},
            "category": {"dataType":"string"},
            "isPublic": {"dataType":"boolean"},
            "inStock": {"dataType":"boolean"},
            "isActive": {"dataType":"boolean"},
            "minPrice": {"dataType":"double","required":true},
            "maxPrice": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IProduct-or-null_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"union","subSchemas":[{"ref":"IProduct"},{"dataType":"enum","enums":[null]}],"required":true},
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
            "images": {"dataType":"array","array":{"dataType":"refObject","ref":"IcommonImage"},"required":true},
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
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["completed"]},{"dataType":"enum","enums":["expired"]},{"dataType":"enum","enums":["abandoned"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeliveryType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["standard"]},{"dataType":"enum","enums":["express"]},{"dataType":"enum","enums":["scheduled"]},{"dataType":"enum","enums":["pickup"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeviceInfo": {
        "dataType": "refObject",
        "properties": {
            "platform": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["ios"]},{"dataType":"enum","enums":["android"]},{"dataType":"enum","enums":["web"]},{"dataType":"enum","enums":["other"]}],"required":true},
            "version": {"dataType":"string","required":true},
            "deviceId": {"dataType":"string","required":true},
            "appVersion": {"dataType":"string"},
            "fcmToken": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Location": {
        "dataType": "refObject",
        "properties": {
            "latitude": {"dataType":"double","required":true},
            "longitude": {"dataType":"double","required":true},
            "address": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICart": {
        "dataType": "refObject",
        "properties": {
            "userId": {"ref":"mongoose.Types.ObjectId","required":true},
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
            "deviceInfo": {"ref":"DeviceInfo"},
            "location": {"ref":"Location"},
            "lastActivityAt": {"dataType":"datetime","required":true},
            "expiresAt": {"dataType":"datetime","required":true},
            "isActive": {"dataType":"boolean","required":true},
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
            "location": {"ref":"Location"},
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
    "RefundStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["pending"]},{"dataType":"enum","enums":["processing"]},{"dataType":"enum","enums":["completed"]},{"dataType":"enum","enums":["rejected"]},{"dataType":"enum","enums":["failed"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRefund": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},
            "orderId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},
            "userId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},
            "amount": {"dataType":"double","required":true},
            "reason": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "status": {"ref":"RefundStatus","required":true},
            "images": {"dataType":"array","array":{"dataType":"string"}},
            "paymentGateway": {"dataType":"string"},
            "gatewayTransactionId": {"dataType":"string"},
            "gatewayRefundId": {"dataType":"string"},
            "adminNotes": {"dataType":"string"},
            "processedBy": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "processedAt": {"dataType":"datetime"},
            "failureReason": {"dataType":"string"},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IRefund_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IRefund","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRefundRequest": {
        "dataType": "refObject",
        "properties": {
            "orderId": {"dataType":"string","required":true},
            "reason": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "amount": {"dataType":"double"},
            "images": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IRefund-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"IRefund"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IReelResponse": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "videoUrl": {"dataType":"string","required":true},
            "thumbnailUrl": {"dataType":"string"},
            "likes": {"dataType":"double","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "createdAt": {"dataType":"string","required":true},
            "updatedAt": {"dataType":"string","required":true},
            "isLiked": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IReelResponse_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IReelResponse"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_IReelResponse__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IReelResponse_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_PaginationQuery.Exclude_keyofPaginationQuery.populate-or-select__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"page":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}]},"limit":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}]},"sort":{"dataType":"string"},"sortBy":{"dataType":"string"},"sortOrder":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},"search":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IFilter": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}]},
            "limit": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}]},
            "sort": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
            "search": {"dataType":"string"},
            "isActive": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__message-string--liked-boolean--likes-number__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"likes":{"dataType":"double","required":true},"liked":{"dataType":"boolean","required":true},"message":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_any_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"any"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_any__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_any_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrderRequest": {
        "dataType": "refObject",
        "properties": {
            "amount": {"dataType":"double","required":true},
            "currency": {"dataType":"string"},
            "receipt": {"dataType":"string","required":true},
            "notes": {"ref":"Record_string.any_"},
            "userId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__verified-boolean__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"verified":{"dataType":"boolean","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyPaymentRequest": {
        "dataType": "refObject",
        "properties": {
            "razorpayOrderId": {"dataType":"string","required":true},
            "razorpayPaymentId": {"dataType":"string","required":true},
            "razorpaySignature": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["created"]},{"dataType":"enum","enums":["authorized"]},{"dataType":"enum","enums":["captured"]},{"dataType":"enum","enums":["failed"]},{"dataType":"enum","enums":["refunded"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransactionMethod": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["card"]},{"dataType":"enum","enums":["upi"]},{"dataType":"enum","enums":["netbanking"]},{"dataType":"enum","enums":["wallet"]},{"dataType":"enum","enums":["cod"]},{"dataType":"enum","enums":["unknown"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPayment": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},
            "user": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"},{"dataType":"any"}],"required":true},
            "order": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"},{"dataType":"any"}]},
            "razorpayOrderId": {"dataType":"string","required":true},
            "razorpayPaymentId": {"dataType":"string"},
            "razorpaySignature": {"dataType":"string"},
            "amount": {"dataType":"double","required":true},
            "currency": {"dataType":"string","required":true},
            "status": {"ref":"TransactionStatus","required":true},
            "method": {"ref":"TransactionMethod","required":true},
            "notes": {"ref":"Record_string.any_"},
            "errorReason": {"dataType":"string"},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IPayment_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IPayment"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_IPayment__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IPayment_","required":true},
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
    "IOrderItem": {
        "dataType": "refObject",
        "properties": {
            "product": {"ref":"mongoose.Types.ObjectId","required":true},
            "productName": {"dataType":"string","required":true},
            "productImage": {"dataType":"string"},
            "quantity": {"dataType":"double","required":true},
            "unit": {"dataType":"string","required":true},
            "mrp": {"dataType":"double","required":true},
            "sellingPrice": {"dataType":"double","required":true},
            "totalPrice": {"dataType":"double","required":true},
            "discount": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IShippingAddress": {
        "dataType": "refObject",
        "properties": {
            "fullName": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "addressLine1": {"dataType":"string","required":true},
            "addressLine2": {"dataType":"string"},
            "city": {"dataType":"string","required":true},
            "state": {"dataType":"string","required":true},
            "pincode": {"dataType":"string","required":true},
            "landmark": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["pending"]},{"dataType":"enum","enums":["confirmed"]},{"dataType":"enum","enums":["processing"]},{"dataType":"enum","enums":["shipped"]},{"dataType":"enum","enums":["delivered"]},{"dataType":"enum","enums":["cancelled"]},{"dataType":"enum","enums":["refunded"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaymentStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["pending"]},{"dataType":"enum","enums":["paid"]},{"dataType":"enum","enums":["failed"]},{"dataType":"enum","enums":["refunded"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaymentMethod": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["card"]},{"dataType":"enum","enums":["upi"]},{"dataType":"enum","enums":["netbanking"]},{"dataType":"enum","enums":["wallet"]},{"dataType":"enum","enums":["cod"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOrder": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId","required":true},
            "orderNumber": {"dataType":"string","required":true},
            "user": {"ref":"mongoose.Types.ObjectId","required":true},
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"IOrderItem"},"required":true},
            "shippingAddress": {"ref":"IShippingAddress","required":true},
            "subtotal": {"dataType":"double","required":true},
            "discount": {"dataType":"double","required":true},
            "deliveryCharge": {"dataType":"double","required":true},
            "totalAmount": {"dataType":"double","required":true},
            "orderStatus": {"ref":"OrderStatus","required":true},
            "paymentStatus": {"ref":"PaymentStatus","required":true},
            "paymentMethod": {"ref":"PaymentMethod","required":true},
            "trackingNumber": {"dataType":"string"},
            "estimatedDelivery": {"dataType":"datetime"},
            "deliveredAt": {"dataType":"datetime"},
            "notes": {"dataType":"string"},
            "cancellationReason": {"dataType":"string"},
            "cancelledAt": {"dataType":"datetime"},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IOrder_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IOrder","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICreateOrderRequest": {
        "dataType": "refObject",
        "properties": {
            "user": {"dataType":"string","required":true},
            "items": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"quantity":{"dataType":"double","required":true},"product":{"dataType":"string","required":true}}},"required":true},
            "shippingAddress": {"ref":"IShippingAddress","required":true},
            "paymentMethod": {"ref":"PaymentMethod","required":true},
            "notes": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IOrder_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IOrder"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_IOrder__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IOrder_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "INotification": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "targetAudience": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["all"]},{"dataType":"enum","enums":["customers"]},{"dataType":"enum","enums":["vendors"]}],"required":true},
            "scheduledAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}]},
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["pending"]},{"dataType":"enum","enums":["sent"]},{"dataType":"enum","enums":["failed"]}],"required":true},
            "imageUrl": {"dataType":"string"},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_INotification_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"INotification"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_PaginatedResponse_INotification__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_INotification_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse__success-boolean__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"success":{"dataType":"boolean","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeviceRegistrationRequest": {
        "dataType": "refObject",
        "properties": {
            "deviceToken": {"dataType":"string","required":true},
            "platform": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["android"]},{"dataType":"enum","enums":["ios"]},{"dataType":"enum","enums":["web"]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeviceRemovalRequest": {
        "dataType": "refObject",
        "properties": {
            "deviceToken": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LocationType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["customer"]},{"dataType":"enum","enums":["delivery_partner"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILocationPoint": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"enum","enums":["Point"],"required":true},
            "coordinates": {"dataType":"array","array":{"dataType":"double"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TrackingStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["inactive"]},{"dataType":"enum","enums":["completed"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILocationHistory": {
        "dataType": "refObject",
        "properties": {
            "coordinates": {"ref":"ILocationPoint","required":true},
            "timestamp": {"dataType":"datetime","required":true},
            "speed": {"dataType":"double"},
            "accuracy": {"dataType":"double"},
            "heading": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILiveLocation": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "userType": {"ref":"LocationType","required":true},
            "orderId": {"dataType":"string"},
            "currentLocation": {"ref":"ILocationPoint","required":true},
            "lastUpdated": {"dataType":"datetime","required":true},
            "status": {"ref":"TrackingStatus","required":true},
            "sessionId": {"dataType":"string","required":true},
            "speed": {"dataType":"double"},
            "accuracy": {"dataType":"double"},
            "heading": {"dataType":"double"},
            "batteryLevel": {"dataType":"double"},
            "locationHistory": {"dataType":"array","array":{"dataType":"refObject","ref":"ILocationHistory"},"required":true},
            "createdAt": {"dataType":"datetime"},
            "updatedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_ILiveLocation_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"ILiveLocation","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStartTrackingRequest": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "userType": {"ref":"LocationType","required":true},
            "orderId": {"dataType":"string"},
            "latitude": {"dataType":"double","required":true},
            "longitude": {"dataType":"double","required":true},
            "sessionId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateLocationRequest": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "userType": {"ref":"LocationType","required":true},
            "latitude": {"dataType":"double","required":true},
            "longitude": {"dataType":"double","required":true},
            "orderId": {"dataType":"string"},
            "sessionId": {"dataType":"string","required":true},
            "speed": {"dataType":"double"},
            "accuracy": {"dataType":"double"},
            "heading": {"dataType":"double"},
            "batteryLevel": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_ILiveLocation-or-null_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"union","subSchemas":[{"ref":"ILiveLocation"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NullSuccessResponse": {
        "dataType": "refAlias",
        "type": {"ref":"SuccessResponse_null_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_ILiveLocation-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"ILiveLocation"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__distance-number--eta-number__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"eta":{"dataType":"double","required":true},"distance":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IKisanCommunity": {
        "dataType": "refObject",
        "properties": {
            "farmerName": {"dataType":"string","required":true},
            "farmName": {"dataType":"string","required":true},
            "farmLocation": {"dataType":"string","required":true},
            "mobile": {"dataType":"string","required":true},
            "email": {"dataType":"string"},
            "products": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "profileImage": {"dataType":"nestedObjectLiteral","nestedProperties":{"key":{"dataType":"string","required":true},"url":{"dataType":"string","required":true}}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IKisanCommunity_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IKisanCommunity"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_PaginatedResponse_IKisanCommunity__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IKisanCommunity_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_IKisanCommunity_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IKisanCommunity","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICategory": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "slug": {"dataType":"string","required":true},
            "isActive": {"dataType":"boolean","required":true},
            "status": {"dataType":"string"},
            "parentId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"enum","enums":[null]}]},
            "icon": {"dataType":"string"},
            "backgroundColor": {"dataType":"string"},
            "textColor": {"dataType":"string"},
            "deepLink": {"dataType":"string"},
            "displayOrder": {"dataType":"double"},
            "bannerImage": {"dataType":"nestedObjectLiteral","nestedProperties":{"key":{"dataType":"string","required":true},"url":{"dataType":"string","required":true}}},
            "categoryImage": {"dataType":"nestedObjectLiteral","nestedProperties":{"key":{"dataType":"string","required":true},"url":{"dataType":"string","required":true}}},
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
            "pagingCounter": {"dataType":"double","required":true},
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
    "AuthPlatform": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["mobile"]},{"dataType":"enum","enums":["web"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISendOtpInput": {
        "dataType": "refObject",
        "properties": {
            "phone": {"dataType":"string","required":true},
            "platform": {"ref":"AuthPlatform"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAuthResponse": {
        "dataType": "refObject",
        "properties": {
            "user": {"ref":"IUser","required":true},
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
            "platform": {"ref":"AuthPlatform"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__tokens-AuthTokens__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"tokens":{"ref":"AuthTokens","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICoupon": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "discountType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["percentage"]},{"dataType":"enum","enums":["fixed"]}],"required":true},
            "discountValue": {"dataType":"double","required":true},
            "maxDiscountAmount": {"dataType":"double"},
            "minOrderValue": {"dataType":"double","required":true},
            "validFrom": {"dataType":"datetime","required":true},
            "validUntil": {"dataType":"datetime","required":true},
            "totalUsageLimit": {"dataType":"double","required":true},
            "timesUsed": {"dataType":"double","required":true},
            "usageLimitPerUser": {"dataType":"double","required":true},
            "usedBy": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "isActive": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_ICoupon-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"ICoupon"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse__message-string--code-string--originalTotal-number--discountAmount-number--finalTotal-number__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"finalTotal":{"dataType":"double","required":true},"discountAmount":{"dataType":"double","required":true},"originalTotal":{"dataType":"double","required":true},"code":{"dataType":"string","required":true},"message":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BannerPlacement": {
        "dataType": "refEnum",
        "enums": ["HOME_TOP","HOME_HERO_CAROUSEL","HOME_CATEGORY_STRIP","HOME_STATIC_TILE","CATEGORY_HEADER","PRODUCT_LIST_INLINE","SEARCH_PAGE_BANNER","CHECKOUT_PAGE_OFFER"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BannerPlatform": {
        "dataType": "refEnum",
        "enums": ["WEB","MOBILE"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BannerPurpose": {
        "dataType": "refEnum",
        "enums": ["PROMOTION","GENERAL_PROMOTION","NEW_LAUNCH","SALE_EVENT","BANK_OFFER","PAYMENT_WALLET_OFFER","APP_FEATURE_AWARENESS","BRAND_AWARENESS"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBanner": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "placement": {"ref":"BannerPlacement","required":true},
            "platform": {"ref":"BannerPlatform","required":true},
            "purpose": {"ref":"BannerPurpose"},
            "imageUrl": {"dataType":"string","required":true},
            "redirectLink": {"dataType":"string"},
            "isActive": {"dataType":"boolean","required":true},
            "startDate": {"dataType":"datetime"},
            "endDate": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IBanner_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IBanner"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_PaginatedResponse_IBanner__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IBanner_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBannerFilter": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}]},
            "limit": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}]},
            "sort": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
            "search": {"dataType":"string"},
            "isActive": {"dataType":"boolean"},
            "placement": {"ref":"BannerPlacement"},
            "purpose": {"ref":"BannerPurpose"},
            "platform": {"ref":"BannerPlatform"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IRefund_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IRefund"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_PaginatedResponse_IRefund__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IRefund_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRefundFilter": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}]},
            "limit": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}]},
            "sort": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
            "search": {"dataType":"string"},
            "isActive": {"dataType":"boolean"},
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["pending"]},{"dataType":"enum","enums":["processing"]},{"dataType":"enum","enums":["completed"]},{"dataType":"enum","enums":["rejected"]},{"dataType":"enum","enums":["failed"]}]},
            "orderId": {"dataType":"string"},
            "userId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_any_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"any","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMarketingCampaign": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "imageUrl": {"dataType":"string"},
            "context": {"dataType":"string"},
            "scheduleTime": {"dataType":"datetime","required":true},
            "status": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["pending"]},{"dataType":"enum","enums":["processing"]},{"dataType":"enum","enums":["completed"]},{"dataType":"enum","enums":["failed"]}],"required":true},
            "targetAudience": {"dataType":"string"},
            "failureReason": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_IMarketingCampaign_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IMarketingCampaign","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IMarketingCampaign_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IMarketingCampaign"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_PaginatedResponse_IMarketingCampaign__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IMarketingCampaign_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IUser_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IUser"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_IUser__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IUser_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IReelResponse_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IReelResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IReel": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "videoUrl": {"dataType":"string","required":true},
            "videoKey": {"dataType":"string"},
            "thumbnailUrl": {"dataType":"string"},
            "thumbnailKey": {"dataType":"string"},
            "likes": {"dataType":"double","required":true},
            "likedBy": {"dataType":"array","array":{"dataType":"refAlias","ref":"mongoose.Types.ObjectId"},"required":true},
            "isActive": {"dataType":"boolean","required":true},
            "userId": {"ref":"mongoose.Types.ObjectId"},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IReel_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IReel"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_IReel__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IReel_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IReel_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IReel","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__message-string__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true}},"required":true},
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
            "pagingCounter": {"dataType":"double","required":true},
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
            "page": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "limit": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"string"}]},
            "sort": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
            "search": {"dataType":"string"},
            "q": {"dataType":"string"},
            "categoryId": {"dataType":"string"},
            "category": {"dataType":"string"},
            "isPublic": {"dataType":"boolean"},
            "inStock": {"dataType":"boolean"},
            "isActive": {"dataType":"boolean"},
            "minPrice": {"dataType":"double"},
            "maxPrice": {"dataType":"double"},
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
    "OrderFilterQueryParams": {
        "dataType": "refObject",
        "properties": {
            "page": {"dataType":"double"},
            "limit": {"dataType":"double"},
            "orderStatus": {"ref":"OrderStatus"},
            "paymentStatus": {"ref":"PaymentStatus"},
            "user": {"dataType":"string"},
            "orderNumber": {"dataType":"string"},
            "startDate": {"dataType":"string"},
            "endDate": {"dataType":"string"},
            "sortBy": {"dataType":"string"},
            "sortOrder": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateOrderRequest": {
        "dataType": "refObject",
        "properties": {
            "orderStatus": {"ref":"OrderStatus"},
            "paymentStatus": {"ref":"PaymentStatus"},
            "trackingNumber": {"dataType":"string"},
            "estimatedDelivery": {"dataType":"datetime"},
            "cancellationReason": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse__updated-number__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"updated":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAdminCreateDeliveryBoyInput": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "email": {"dataType":"string"},
            "password": {"dataType":"string"},
            "vehicleType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["bike"]},{"dataType":"enum","enums":["scooter"]},{"dataType":"enum","enums":["bicycle"]},{"dataType":"enum","enums":["car"]}]},
            "vehicleNumber": {"dataType":"string"},
            "drivingLicenseNumber": {"dataType":"string"},
            "aadharNumber": {"dataType":"string"},
            "panNumber": {"dataType":"string"},
            "deliveryZone": {"dataType":"array","array":{"dataType":"string"}},
            "isActive": {"dataType":"boolean"},
            "emergencyContactName": {"dataType":"string"},
            "emergencyContactPhone": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_IDeliveryBoy_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"IDeliveryBoy"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_PaginatedResponse_IDeliveryBoy__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_IDeliveryBoy_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.number_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDeliveryBoyStats": {
        "dataType": "refObject",
        "properties": {
            "totalDeliveryBoys": {"dataType":"double","required":true},
            "activeDeliveryBoys": {"dataType":"double","required":true},
            "availableDeliveryBoys": {"dataType":"double","required":true},
            "onDelivery": {"dataType":"double","required":true},
            "documentsVerified": {"dataType":"double","required":true},
            "documentsPending": {"dataType":"double","required":true},
            "averageRating": {"dataType":"double","required":true},
            "totalDeliveries": {"dataType":"double","required":true},
            "completedDeliveries": {"dataType":"double","required":true},
            "cancelledDeliveries": {"dataType":"double","required":true},
            "byVehicleType": {"dataType":"nestedObjectLiteral","nestedProperties":{"car":{"dataType":"double","required":true},"bicycle":{"dataType":"double","required":true},"scooter":{"dataType":"double","required":true},"bike":{"dataType":"double","required":true}},"required":true},
            "byZone": {"ref":"Record_string.number_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IDeliveryBoyStats_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IDeliveryBoyStats","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAdminUpdateDeliveryBoyInput": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "email": {"dataType":"string"},
            "vehicleType": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["bike"]},{"dataType":"enum","enums":["scooter"]},{"dataType":"enum","enums":["bicycle"]},{"dataType":"enum","enums":["car"]}]},
            "vehicleNumber": {"dataType":"string"},
            "drivingLicenseNumber": {"dataType":"string"},
            "aadharNumber": {"dataType":"string"},
            "panNumber": {"dataType":"string"},
            "deliveryZone": {"dataType":"array","array":{"dataType":"string"}},
            "isActive": {"dataType":"boolean"},
            "isDocumentVerified": {"dataType":"boolean"},
            "isBackgroundCheckDone": {"dataType":"boolean"},
            "bankAccountNumber": {"dataType":"string"},
            "ifscCode": {"dataType":"string"},
            "bankAccountHolderName": {"dataType":"string"},
            "upiId": {"dataType":"string"},
            "emergencyContactName": {"dataType":"string"},
            "emergencyContactPhone": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IToggleDeliveryBoyStatusInput": {
        "dataType": "refObject",
        "properties": {
            "isActive": {"dataType":"boolean","required":true},
            "reason": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IVerifyDeliveryBoyDocumentsInput": {
        "dataType": "refObject",
        "properties": {
            "isDocumentVerified": {"dataType":"boolean","required":true},
            "isBackgroundCheckDone": {"dataType":"boolean"},
            "verificationNotes": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAssignDeliveryZonesInput": {
        "dataType": "refObject",
        "properties": {
            "deliveryZone": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDeliveryBoyPerformance": {
        "dataType": "refObject",
        "properties": {
            "deliveryBoyId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "totalDeliveries": {"dataType":"double","required":true},
            "completedDeliveries": {"dataType":"double","required":true},
            "cancelledDeliveries": {"dataType":"double","required":true},
            "averageRating": {"dataType":"double","required":true},
            "completionRate": {"dataType":"double","required":true},
            "onTimeDeliveryRate": {"dataType":"double"},
            "averageDeliveryTime": {"dataType":"double"},
            "totalEarnings": {"dataType":"double"},
            "lastDelivery": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IDeliveryBoyPerformance_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IDeliveryBoyPerformance","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IDeliveryBoy-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"IDeliveryBoy"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBulkOperationResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"double","required":true},
            "failed": {"dataType":"double","required":true},
            "errors": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true},"deliveryBoyId":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_IBulkOperationResponse_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"IBulkOperationResponse","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBulkDeliveryBoyOperation": {
        "dataType": "refObject",
        "properties": {
            "deliveryBoyIds": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "operation": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["activate"]},{"dataType":"enum","enums":["deactivate"]},{"dataType":"enum","enums":["verify"]},{"dataType":"enum","enums":["delete"]}],"required":true},
            "reason": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardStats": {
        "dataType": "refObject",
        "properties": {
            "totalRevenue": {"dataType":"nestedObjectLiteral","nestedProperties":{"label":{"dataType":"string","required":true},"percentageChange":{"dataType":"double","required":true},"previous":{"dataType":"double","required":true},"current":{"dataType":"double","required":true}},"required":true},
            "totalOrders": {"dataType":"nestedObjectLiteral","nestedProperties":{"label":{"dataType":"string","required":true},"percentageChange":{"dataType":"double","required":true},"previous":{"dataType":"double","required":true},"current":{"dataType":"double","required":true}},"required":true},
            "totalProducts": {"dataType":"nestedObjectLiteral","nestedProperties":{"label":{"dataType":"string","required":true},"percentageChange":{"dataType":"double","required":true},"activeProducts":{"dataType":"double","required":true},"current":{"dataType":"double","required":true}},"required":true},
            "newCustomers": {"dataType":"nestedObjectLiteral","nestedProperties":{"label":{"dataType":"string","required":true},"percentageChange":{"dataType":"double","required":true},"current":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_DashboardStats_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"DashboardStats","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SalesOverview": {
        "dataType": "refObject",
        "properties": {
            "labels": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "revenue": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "orders": {"dataType":"array","array":{"dataType":"double"},"required":true},
            "totalRevenue": {"dataType":"double","required":true},
            "totalOrders": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_SalesOverview_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"SalesOverview","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RecentOrder": {
        "dataType": "refObject",
        "properties": {
            "orderId": {"dataType":"string","required":true},
            "orderNumber": {"dataType":"string","required":true},
            "customerName": {"dataType":"string","required":true},
            "amount": {"dataType":"double","required":true},
            "status": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_RecentOrder-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"RecentOrder"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TopProduct": {
        "dataType": "refObject",
        "properties": {
            "productId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "totalSales": {"dataType":"double","required":true},
            "totalRevenue": {"dataType":"double","required":true},
            "orderCount": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_TopProduct-Array_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"array","array":{"dataType":"refObject","ref":"TopProduct"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CustomerInsights": {
        "dataType": "refObject",
        "properties": {
            "totalCustomers": {"dataType":"double","required":true},
            "activeCustomers": {"dataType":"double","required":true},
            "newThisMonth": {"dataType":"double","required":true},
            "topCustomers": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"totalSpent":{"dataType":"double","required":true},"totalOrders":{"dataType":"double","required":true},"name":{"dataType":"string","required":true},"customerId":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_CustomerInsights_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"CustomerInsights","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CloudinaryUsage": {
        "dataType": "refObject",
        "properties": {
            "transformations": {"dataType":"double","required":true},
            "transformationsLimit": {"dataType":"double","required":true},
            "storage": {"dataType":"double","required":true},
            "storageLimit": {"dataType":"double","required":true},
            "bandwidth": {"dataType":"double","required":true},
            "bandwidthLimit": {"dataType":"double","required":true},
            "derivedResources": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponse_CloudinaryUsage_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"CloudinaryUsage","required":true},
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
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserProfile": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "phone": {"dataType":"string"},
            "roles": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "isActive": {"dataType":"boolean","required":true},
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
    "ISettings": {
        "dataType": "refObject",
        "properties": {
            "splashScreen": {"dataType":"nestedObjectLiteral","nestedProperties":{"durationSeconds":{"dataType":"double","required":true},"imageUrl":{"dataType":"string","required":true}},"required":true},
            "maintenanceMode": {"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true},"isEnabled":{"dataType":"boolean","required":true}},"required":true},
            "forceUpdate": {"dataType":"nestedObjectLiteral","nestedProperties":{"updateMessage":{"dataType":"string","required":true},"minVersion":{"dataType":"string","required":true},"isRequired":{"dataType":"boolean","required":true}},"required":true},
            "supportInfo": {"dataType":"nestedObjectLiteral","nestedProperties":{"phone":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}},"required":true},
            "featureFlags": {"dataType":"nestedObjectLiteral","nestedProperties":{"isNewPaymentGatewayVisible":{"dataType":"boolean","required":true},"isReferralEnabled":{"dataType":"boolean","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_ISettings_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"ISettings","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseTags_INotification_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"INotification","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_INotification_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"title":{"dataType":"string"},"message":{"dataType":"string"},"targetAudience":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["all"]},{"dataType":"enum","enums":["customers"]},{"dataType":"enum","enums":["vendors"]}]},"scheduledAt":{"dataType":"datetime"},"status":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["pending"]},{"dataType":"enum","enums":["failed"]},{"dataType":"enum","enums":["sent"]}]},"imageUrl":{"dataType":"string"},"createdAt":{"dataType":"datetime"},"updatedAt":{"dataType":"datetime"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessResponseTags__message-string__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_ICoupon_": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"ICoupon","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_ICoupon.Exclude_keyofICoupon.timesUsed-or-usedBy__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"description":{"dataType":"string","required":true},"isActive":{"dataType":"boolean","required":true},"code":{"dataType":"string","required":true},"discountType":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["percentage"]},{"dataType":"enum","enums":["fixed"]}],"required":true},"discountValue":{"dataType":"double","required":true},"maxDiscountAmount":{"dataType":"double"},"minOrderValue":{"dataType":"double","required":true},"validFrom":{"dataType":"datetime","required":true},"validUntil":{"dataType":"datetime","required":true},"totalUsageLimit":{"dataType":"double","required":true},"usageLimitPerUser":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_ICoupon.timesUsed-or-usedBy_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_ICoupon.Exclude_keyofICoupon.timesUsed-or-usedBy__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICouponCreateRequest": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_ICoupon.timesUsed-or-usedBy_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_ICoupon_": {
        "dataType": "refObject",
        "properties": {
            "docs": {"dataType":"array","array":{"dataType":"refObject","ref":"ICoupon"},"required":true},
            "totalDocs": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
            "hasNextPage": {"dataType":"boolean","required":true},
            "hasPrevPage": {"dataType":"boolean","required":true},
            "nextPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "prevPage": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "pagingCounter": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse_PaginatedResponse_ICoupon__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"ref":"PaginatedResponse_ICoupon_","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_ICoupon_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"code":{"dataType":"string"},"description":{"dataType":"string"},"discountType":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["percentage"]},{"dataType":"enum","enums":["fixed"]}]},"discountValue":{"dataType":"double"},"maxDiscountAmount":{"dataType":"double"},"minOrderValue":{"dataType":"double"},"validFrom":{"dataType":"datetime"},"validUntil":{"dataType":"datetime"},"totalUsageLimit":{"dataType":"double"},"timesUsed":{"dataType":"double"},"usageLimitPerUser":{"dataType":"double"},"usedBy":{"dataType":"array","array":{"dataType":"string"}},"isActive":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessDataResponse__message-string__": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"enum","enums":[true],"required":true},
            "message": {"dataType":"string","required":true},
            "result": {"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true}},"required":true},
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

    
        const argsPublicSettingsController_getSettings: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/public/settings',
            ...(fetchMiddlewares<RequestHandler>(PublicSettingsController)),
            ...(fetchMiddlewares<RequestHandler>(PublicSettingsController.prototype.getSettings)),

            async function PublicSettingsController_getSettings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPublicSettingsController_getSettings, request, response });

                const controller = new PublicSettingsController();

              await templateService.apiHandler({
                methodName: 'getSettings',
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
        const argsDeliveryBoyAuthController_sendOtp: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"IDeliveryBoySendOtpInput"},
        };
        app.post('/delivery-boy/auth/send-otp',
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController.prototype.sendOtp)),

            async function DeliveryBoyAuthController_sendOtp(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDeliveryBoyAuthController_sendOtp, request, response });

                const controller = new DeliveryBoyAuthController();

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
        const argsDeliveryBoyAuthController_verifyOtp: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"IDeliveryBoyVerifyOtpInput"},
        };
        app.post('/delivery-boy/auth/verify-otp',
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController.prototype.verifyOtp)),

            async function DeliveryBoyAuthController_verifyOtp(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDeliveryBoyAuthController_verifyOtp, request, response });

                const controller = new DeliveryBoyAuthController();

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
        const argsDeliveryBoyAuthController_resendOtp: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"IDeliveryBoySendOtpInput"},
        };
        app.post('/delivery-boy/auth/resend-otp',
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController.prototype.resendOtp)),

            async function DeliveryBoyAuthController_resendOtp(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDeliveryBoyAuthController_resendOtp, request, response });

                const controller = new DeliveryBoyAuthController();

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
        const argsDeliveryBoyAuthController_refreshToken: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"refreshToken":{"dataType":"string","required":true}}},
        };
        app.post('/delivery-boy/auth/refresh-token',
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController.prototype.refreshToken)),

            async function DeliveryBoyAuthController_refreshToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDeliveryBoyAuthController_refreshToken, request, response });

                const controller = new DeliveryBoyAuthController();

              await templateService.apiHandler({
                methodName: 'refreshToken',
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
        const argsDeliveryBoyAuthController_getProfile: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/delivery-boy/auth/profile',
            authenticateMiddleware([{"jwt":["delivery_boy"]}]),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController.prototype.getProfile)),

            async function DeliveryBoyAuthController_getProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDeliveryBoyAuthController_getProfile, request, response });

                const controller = new DeliveryBoyAuthController();

              await templateService.apiHandler({
                methodName: 'getProfile',
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
        const argsDeliveryBoyAuthController_updateProfile: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"IUpdateDeliveryBoyProfileInput"},
        };
        app.put('/delivery-boy/auth/profile',
            authenticateMiddleware([{"jwt":["delivery_boy"]}]),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController.prototype.updateProfile)),

            async function DeliveryBoyAuthController_updateProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDeliveryBoyAuthController_updateProfile, request, response });

                const controller = new DeliveryBoyAuthController();

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
        const argsDeliveryBoyAuthController_updateLocation: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"IUpdateDeliveryBoyLocationInput"},
        };
        app.put('/delivery-boy/auth/location',
            authenticateMiddleware([{"jwt":["delivery_boy"]}]),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController.prototype.updateLocation)),

            async function DeliveryBoyAuthController_updateLocation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDeliveryBoyAuthController_updateLocation, request, response });

                const controller = new DeliveryBoyAuthController();

              await templateService.apiHandler({
                methodName: 'updateLocation',
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
        const argsDeliveryBoyAuthController_updateAvailability: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"IUpdateDeliveryBoyAvailabilityInput"},
        };
        app.put('/delivery-boy/auth/availability',
            authenticateMiddleware([{"jwt":["delivery_boy"]}]),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController)),
            ...(fetchMiddlewares<RequestHandler>(DeliveryBoyAuthController.prototype.updateAvailability)),

            async function DeliveryBoyAuthController_updateAvailability(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDeliveryBoyAuthController_updateAvailability, request, response });

                const controller = new DeliveryBoyAuthController();

              await templateService.apiHandler({
                methodName: 'updateAvailability',
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
        const argsMobileUserController_getUserProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/customer/user/profile',
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
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"IUpdateProfileRequest"},
        };
        app.put('/customer/user/profile',
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
        const argsMobileUserController_deleteProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.delete('/customer/user/profile',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController)),
            ...(fetchMiddlewares<RequestHandler>(MobileUserController.prototype.deleteProfile)),

            async function MobileUserController_deleteProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileUserController_deleteProfile, request, response });

                const controller = new MobileUserController();

              await templateService.apiHandler({
                methodName: 'deleteProfile',
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
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/customer/user/addresses',
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
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                address: {"in":"body","name":"address","required":true,"dataType":"any"},
        };
        app.post('/customer/user/addresses',
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
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"addressId":{"dataType":"string","required":true}}},
        };
        app.put('/customer/user/addresses/primary',
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
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"addressId":{"dataType":"string","required":true}}},
        };
        app.delete('/customer/user/addresses',
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
        const argsCustomerProductController_getProducts: Record<string, TsoaRoute.ParameterSchema> = {
                filters: {"in":"queries","name":"filters","required":true,"ref":"ProductFilters"},
        };
        app.get('/customer/products',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.getProducts)),

            async function CustomerProductController_getProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_getProducts, request, response });

                const controller = new CustomerProductController();

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
        const argsCustomerProductController_getProductBySlug: Record<string, TsoaRoute.ParameterSchema> = {
                slug: {"in":"path","name":"slug","required":true,"dataType":"string"},
        };
        app.get('/customer/products/slug/:slug',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.getProductBySlug)),

            async function CustomerProductController_getProductBySlug(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_getProductBySlug, request, response });

                const controller = new CustomerProductController();

              await templateService.apiHandler({
                methodName: 'getProductBySlug',
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
        const argsCustomerProductController_searchProducts: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"SearchProductFilters"},
        };
        app.get('/customer/products/search',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.searchProducts)),

            async function CustomerProductController_searchProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_searchProducts, request, response });

                const controller = new CustomerProductController();

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
        const argsCustomerProductController_getFeaturedProducts: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double"}}},
        };
        app.get('/customer/products/featured',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.getFeaturedProducts)),

            async function CustomerProductController_getFeaturedProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_getFeaturedProducts, request, response });

                const controller = new CustomerProductController();

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
        const argsCustomerProductController_getProductsByCategory: Record<string, TsoaRoute.ParameterSchema> = {
                categoryId: {"in":"path","name":"categoryId","required":true,"dataType":"string"},
                filters: {"in":"queries","name":"filters","required":true,"ref":"ProductFilters"},
        };
        app.get('/customer/products/category/:categoryId',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.getProductsByCategory)),

            async function CustomerProductController_getProductsByCategory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_getProductsByCategory, request, response });

                const controller = new CustomerProductController();

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
        const argsCustomerProductController_getSaleProducts: Record<string, TsoaRoute.ParameterSchema> = {
                filters: {"in":"queries","name":"filters","required":true,"ref":"SaleProductFilters"},
        };
        app.get('/customer/products/sale',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.getSaleProducts)),

            async function CustomerProductController_getSaleProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_getSaleProducts, request, response });

                const controller = new CustomerProductController();

              await templateService.apiHandler({
                methodName: 'getSaleProducts',
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
        const argsCustomerProductController_getNewArrivals: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"days":{"dataType":"double"},"limit":{"dataType":"double"}}},
        };
        app.get('/customer/products/new-arrivals',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.getNewArrivals)),

            async function CustomerProductController_getNewArrivals(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_getNewArrivals, request, response });

                const controller = new CustomerProductController();

              await templateService.apiHandler({
                methodName: 'getNewArrivals',
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
        const argsCustomerProductController_getProductsByPriceRange: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"queries","name":"params","required":true,"ref":"PriceRangeFilters"},
        };
        app.get('/customer/products/price-range',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.getProductsByPriceRange)),

            async function CustomerProductController_getProductsByPriceRange(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_getProductsByPriceRange, request, response });

                const controller = new CustomerProductController();

              await templateService.apiHandler({
                methodName: 'getProductsByPriceRange',
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
        const argsCustomerProductController_getRelatedProducts: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                params: {"in":"queries","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double"}}},
        };
        app.get('/customer/products/:id/related',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.getRelatedProducts)),

            async function CustomerProductController_getRelatedProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_getRelatedProducts, request, response });

                const controller = new CustomerProductController();

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
        const argsCustomerProductController_getProductById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/customer/products/:id',
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerProductController.prototype.getProductById)),

            async function CustomerProductController_getProductById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerProductController_getProductById, request, response });

                const controller = new CustomerProductController();

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
        const argsUserCartController_addToCart: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"AddToCartRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/customer/cart',
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
        app.get('/customer/cart',
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
        app.put('/customer/cart/:productId',
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
        app.delete('/customer/cart/:productId',
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
        app.delete('/customer/cart',
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
        app.post('/customer/cart/coupon',
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
        app.post('/customer/cart/delivery',
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
        app.get('/customer/cart/summary',
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
        app.get('/customer/subscriptions',
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
        app.post('/customer/subscriptions',
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
        app.get('/customer/subscriptions/:userId',
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
        app.get('/customer/subscriptions/detail/:id',
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
        app.put('/customer/subscriptions/:id',
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
        app.put('/customer/subscriptions/:id/cancel',
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
        app.delete('/customer/subscriptions/:id',
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
        const argsCustomerSettingsController_getSettings: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/customer/settings',
            ...(fetchMiddlewares<RequestHandler>(CustomerSettingsController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerSettingsController.prototype.getSettings)),

            async function CustomerSettingsController_getSettings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerSettingsController_getSettings, request, response });

                const controller = new CustomerSettingsController();

              await templateService.apiHandler({
                methodName: 'getSettings',
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
        const argsCustomerRefundController_requestRefund: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateRefundRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/customer/refunds',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerRefundController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerRefundController.prototype.requestRefund)),

            async function CustomerRefundController_requestRefund(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerRefundController_requestRefund, request, response });

                const controller = new CustomerRefundController();

              await templateService.apiHandler({
                methodName: 'requestRefund',
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
        const argsCustomerRefundController_getMyRefunds: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/customer/refunds',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerRefundController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerRefundController.prototype.getMyRefunds)),

            async function CustomerRefundController_getMyRefunds(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerRefundController_getMyRefunds, request, response });

                const controller = new CustomerRefundController();

              await templateService.apiHandler({
                methodName: 'getMyRefunds',
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
        const argsCustomerRefundController_getRefundDetails: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/customer/refunds/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerRefundController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerRefundController.prototype.getRefundDetails)),

            async function CustomerRefundController_getRefundDetails(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerRefundController_getRefundDetails, request, response });

                const controller = new CustomerRefundController();

              await templateService.apiHandler({
                methodName: 'getRefundDetails',
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
        const argsCustomerReelController_getReels: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                query: {"in":"queries","name":"query","required":true,"ref":"IFilter"},
        };
        app.get('/customer/reels',
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController.prototype.getReels)),

            async function CustomerReelController_getReels(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerReelController_getReels, request, response });

                const controller = new CustomerReelController();

              await templateService.apiHandler({
                methodName: 'getReels',
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
        const argsCustomerReelController_getReelsFeed: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                query: {"in":"queries","name":"query","required":true,"ref":"IFilter"},
        };
        app.get('/customer/reels/feed',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController.prototype.getReelsFeed)),

            async function CustomerReelController_getReelsFeed(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerReelController_getReelsFeed, request, response });

                const controller = new CustomerReelController();

              await templateService.apiHandler({
                methodName: 'getReelsFeed',
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
        const argsCustomerReelController_toggleLike: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/customer/reels/:id/like',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController.prototype.toggleLike)),

            async function CustomerReelController_toggleLike(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerReelController_toggleLike, request, response });

                const controller = new CustomerReelController();

              await templateService.apiHandler({
                methodName: 'toggleLike',
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
        const argsCustomerReelController_addComment: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"content":{"dataType":"string","required":true}}},
        };
        app.post('/customer/reels/:id/comments',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController.prototype.addComment)),

            async function CustomerReelController_addComment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerReelController_addComment, request, response });

                const controller = new CustomerReelController();

              await templateService.apiHandler({
                methodName: 'addComment',
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
        const argsCustomerReelController_getComments: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                query: {"in":"queries","name":"query","required":true,"ref":"IFilter"},
        };
        app.get('/customer/reels/:id/comments',
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerReelController.prototype.getComments)),

            async function CustomerReelController_getComments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerReelController_getComments, request, response });

                const controller = new CustomerReelController();

              await templateService.apiHandler({
                methodName: 'getComments',
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
        const argsPaymentController_createOrder: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateOrderRequest"},
        };
        app.post('/payment/create-order',
            ...(fetchMiddlewares<RequestHandler>(PaymentController)),
            ...(fetchMiddlewares<RequestHandler>(PaymentController.prototype.createOrder)),

            async function PaymentController_createOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPaymentController_createOrder, request, response });

                const controller = new PaymentController();

              await templateService.apiHandler({
                methodName: 'createOrder',
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
        const argsPaymentController_verifyPayment: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"VerifyPaymentRequest"},
        };
        app.post('/payment/verify',
            ...(fetchMiddlewares<RequestHandler>(PaymentController)),
            ...(fetchMiddlewares<RequestHandler>(PaymentController.prototype.verifyPayment)),

            async function PaymentController_verifyPayment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPaymentController_verifyPayment, request, response });

                const controller = new PaymentController();

              await templateService.apiHandler({
                methodName: 'verifyPayment',
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
        const argsPaymentController_getPaymentHistory: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double"},"page":{"dataType":"double"}}},
        };
        app.get('/payment/history/:userId',
            ...(fetchMiddlewares<RequestHandler>(PaymentController)),
            ...(fetchMiddlewares<RequestHandler>(PaymentController.prototype.getPaymentHistory)),

            async function PaymentController_getPaymentHistory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPaymentController_getPaymentHistory, request, response });

                const controller = new PaymentController();

              await templateService.apiHandler({
                methodName: 'getPaymentHistory',
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
        const argsPaymentController_handleWebhook: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"any"},
                query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"signature":{"dataType":"string","required":true}}},
        };
        app.post('/payment/webhook',
            ...(fetchMiddlewares<RequestHandler>(PaymentController)),
            ...(fetchMiddlewares<RequestHandler>(PaymentController.prototype.handleWebhook)),

            async function PaymentController_handleWebhook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPaymentController_handleWebhook, request, response });

                const controller = new PaymentController();

              await templateService.apiHandler({
                methodName: 'handleWebhook',
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
        const argsCustomerOrderController_createOrder: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                data: {"in":"body","name":"data","required":true,"ref":"ICreateOrderRequest"},
        };
        app.post('/customer/orders',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController.prototype.createOrder)),

            async function CustomerOrderController_createOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerOrderController_createOrder, request, response });

                const controller = new CustomerOrderController();

              await templateService.apiHandler({
                methodName: 'createOrder',
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
        const argsCustomerOrderController_getMyOrders: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                filter: {"in":"queries","name":"filter","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"sortOrder":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},"sortBy":{"dataType":"string"},"orderStatus":{"dataType":"string"},"limit":{"dataType":"double"},"page":{"dataType":"double"}}},
        };
        app.get('/customer/orders',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController.prototype.getMyOrders)),

            async function CustomerOrderController_getMyOrders(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerOrderController_getMyOrders, request, response });

                const controller = new CustomerOrderController();

              await templateService.apiHandler({
                methodName: 'getMyOrders',
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
        const argsCustomerOrderController_getActiveOrders: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                filter: {"in":"queries","name":"filter","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double"},"page":{"dataType":"double"}}},
        };
        app.get('/customer/orders/active',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController.prototype.getActiveOrders)),

            async function CustomerOrderController_getActiveOrders(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerOrderController_getActiveOrders, request, response });

                const controller = new CustomerOrderController();

              await templateService.apiHandler({
                methodName: 'getActiveOrders',
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
        const argsCustomerOrderController_getOrderHistory: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                filter: {"in":"queries","name":"filter","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double"},"page":{"dataType":"double"}}},
        };
        app.get('/customer/orders/history',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController.prototype.getOrderHistory)),

            async function CustomerOrderController_getOrderHistory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerOrderController_getOrderHistory, request, response });

                const controller = new CustomerOrderController();

              await templateService.apiHandler({
                methodName: 'getOrderHistory',
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
        const argsCustomerOrderController_trackOrder: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                orderNumber: {"in":"path","name":"orderNumber","required":true,"dataType":"string"},
        };
        app.get('/customer/orders/track/:orderNumber',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController.prototype.trackOrder)),

            async function CustomerOrderController_trackOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerOrderController_trackOrder, request, response });

                const controller = new CustomerOrderController();

              await templateService.apiHandler({
                methodName: 'trackOrder',
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
        const argsCustomerOrderController_getOrderById: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/customer/orders/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController.prototype.getOrderById)),

            async function CustomerOrderController_getOrderById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerOrderController_getOrderById, request, response });

                const controller = new CustomerOrderController();

              await templateService.apiHandler({
                methodName: 'getOrderById',
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
        const argsCustomerOrderController_cancelOrder: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"reason":{"dataType":"string","required":true}}},
        };
        app.post('/customer/orders/:id/cancel',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController.prototype.cancelOrder)),

            async function CustomerOrderController_cancelOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerOrderController_cancelOrder, request, response });

                const controller = new CustomerOrderController();

              await templateService.apiHandler({
                methodName: 'cancelOrder',
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
        const argsCustomerOrderController_reorder: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/customer/orders/:id/reorder',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerOrderController.prototype.reorder)),

            async function CustomerOrderController_reorder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerOrderController_reorder, request, response });

                const controller = new CustomerOrderController();

              await templateService.apiHandler({
                methodName: 'reorder',
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
        const argsCustomerNotificationController_getNotifications: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"IFilter"},
        };
        app.get('/customer/notifications',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerNotificationController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerNotificationController.prototype.getNotifications)),

            async function CustomerNotificationController_getNotifications(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerNotificationController_getNotifications, request, response });

                const controller = new CustomerNotificationController();

              await templateService.apiHandler({
                methodName: 'getNotifications',
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
        const argsCustomerNotificationController_registerDevice: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"DeviceRegistrationRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/customer/notifications/register-device',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerNotificationController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerNotificationController.prototype.registerDevice)),

            async function CustomerNotificationController_registerDevice(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerNotificationController_registerDevice, request, response });

                const controller = new CustomerNotificationController();

              await templateService.apiHandler({
                methodName: 'registerDevice',
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
        const argsCustomerNotificationController_removeDevice: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"DeviceRemovalRequest"},
        };
        app.post('/customer/notifications/remove-device',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerNotificationController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerNotificationController.prototype.removeDevice)),

            async function CustomerNotificationController_removeDevice(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerNotificationController_removeDevice, request, response });

                const controller = new CustomerNotificationController();

              await templateService.apiHandler({
                methodName: 'removeDevice',
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
        const argsLocationController_startTracking: Record<string, TsoaRoute.ParameterSchema> = {
                data: {"in":"body","name":"data","required":true,"ref":"IStartTrackingRequest"},
        };
        app.post('/location/start',
            ...(fetchMiddlewares<RequestHandler>(LocationController)),
            ...(fetchMiddlewares<RequestHandler>(LocationController.prototype.startTracking)),

            async function LocationController_startTracking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLocationController_startTracking, request, response });

                const controller = new LocationController();

              await templateService.apiHandler({
                methodName: 'startTracking',
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
        const argsLocationController_updateLocation: Record<string, TsoaRoute.ParameterSchema> = {
                data: {"in":"body","name":"data","required":true,"ref":"IUpdateLocationRequest"},
        };
        app.post('/location/update',
            ...(fetchMiddlewares<RequestHandler>(LocationController)),
            ...(fetchMiddlewares<RequestHandler>(LocationController.prototype.updateLocation)),

            async function LocationController_updateLocation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLocationController_updateLocation, request, response });

                const controller = new LocationController();

              await templateService.apiHandler({
                methodName: 'updateLocation',
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
        const argsLocationController_getCurrentLocation: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                orderId: {"in":"query","name":"orderId","dataType":"string"},
        };
        app.get('/location/current/:userId',
            ...(fetchMiddlewares<RequestHandler>(LocationController)),
            ...(fetchMiddlewares<RequestHandler>(LocationController.prototype.getCurrentLocation)),

            async function LocationController_getCurrentLocation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLocationController_getCurrentLocation, request, response });

                const controller = new LocationController();

              await templateService.apiHandler({
                methodName: 'getCurrentLocation',
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
        const argsLocationController_stopTracking: Record<string, TsoaRoute.ParameterSchema> = {
                data: {"in":"body","name":"data","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"orderId":{"dataType":"string"},"sessionId":{"dataType":"string","required":true},"userId":{"dataType":"string","required":true}}},
        };
        app.post('/location/stop',
            ...(fetchMiddlewares<RequestHandler>(LocationController)),
            ...(fetchMiddlewares<RequestHandler>(LocationController.prototype.stopTracking)),

            async function LocationController_stopTracking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLocationController_stopTracking, request, response });

                const controller = new LocationController();

              await templateService.apiHandler({
                methodName: 'stopTracking',
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
        const argsLocationController_findNearbyDeliveryPartners: Record<string, TsoaRoute.ParameterSchema> = {
                latitude: {"in":"query","name":"latitude","required":true,"dataType":"double"},
                longitude: {"in":"query","name":"longitude","required":true,"dataType":"double"},
                maxDistance: {"in":"query","name":"maxDistance","dataType":"double"},
        };
        app.get('/location/nearby',
            ...(fetchMiddlewares<RequestHandler>(LocationController)),
            ...(fetchMiddlewares<RequestHandler>(LocationController.prototype.findNearbyDeliveryPartners)),

            async function LocationController_findNearbyDeliveryPartners(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLocationController_findNearbyDeliveryPartners, request, response });

                const controller = new LocationController();

              await templateService.apiHandler({
                methodName: 'findNearbyDeliveryPartners',
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
        const argsLocationController_getLocationHistory: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                orderId: {"in":"query","name":"orderId","dataType":"string"},
        };
        app.get('/location/history/:userId',
            ...(fetchMiddlewares<RequestHandler>(LocationController)),
            ...(fetchMiddlewares<RequestHandler>(LocationController.prototype.getLocationHistory)),

            async function LocationController_getLocationHistory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLocationController_getLocationHistory, request, response });

                const controller = new LocationController();

              await templateService.apiHandler({
                methodName: 'getLocationHistory',
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
        const argsLocationController_getETA: Record<string, TsoaRoute.ParameterSchema> = {
                deliveryPartnerId: {"in":"path","name":"deliveryPartnerId","required":true,"dataType":"string"},
                destinationLat: {"in":"query","name":"destinationLat","required":true,"dataType":"double"},
                destinationLon: {"in":"query","name":"destinationLon","required":true,"dataType":"double"},
        };
        app.get('/location/eta/:deliveryPartnerId',
            ...(fetchMiddlewares<RequestHandler>(LocationController)),
            ...(fetchMiddlewares<RequestHandler>(LocationController.prototype.getETA)),

            async function LocationController_getETA(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLocationController_getETA, request, response });

                const controller = new LocationController();

              await templateService.apiHandler({
                methodName: 'getETA',
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
        const argsCustomerKisanCommunityController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"IFilter"},
        };
        app.get('/customer/kisan-community',
            ...(fetchMiddlewares<RequestHandler>(CustomerKisanCommunityController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerKisanCommunityController.prototype.getAll)),

            async function CustomerKisanCommunityController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerKisanCommunityController_getAll, request, response });

                const controller = new CustomerKisanCommunityController();

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
        const argsCustomerKisanCommunityController_getById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/customer/kisan-community/:id',
            ...(fetchMiddlewares<RequestHandler>(CustomerKisanCommunityController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerKisanCommunityController.prototype.getById)),

            async function CustomerKisanCommunityController_getById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerKisanCommunityController_getById, request, response });

                const controller = new CustomerKisanCommunityController();

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
        const argsCustomerCategoryController_getCategories: Record<string, TsoaRoute.ParameterSchema> = {
                fillter: {"in":"queries","name":"fillter","required":true,"ref":"IFilter"},
        };
        app.get('/customer/categories',
            ...(fetchMiddlewares<RequestHandler>(CustomerCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerCategoryController.prototype.getCategories)),

            async function CustomerCategoryController_getCategories(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerCategoryController_getCategories, request, response });

                const controller = new CustomerCategoryController();

              await templateService.apiHandler({
                methodName: 'getCategories',
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
        const argsCustomerCategoryController_getOne: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/customer/categories/:id',
            ...(fetchMiddlewares<RequestHandler>(CustomerCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerCategoryController.prototype.getOne)),

            async function CustomerCategoryController_getOne(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerCategoryController_getOne, request, response });

                const controller = new CustomerCategoryController();

              await templateService.apiHandler({
                methodName: 'getOne',
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
        app.post('/customer/auth/send-otp',
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
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/customer/auth/verify-otp',
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
        app.post('/customer/auth/resend-otp',
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
        const argsMobileAuthController_refreshToken: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"platform":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["mobile"]},{"dataType":"enum","enums":["web"]}]},"refreshToken":{"dataType":"string"}}},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/customer/auth/refresh-token',
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController)),
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController.prototype.refreshToken)),

            async function MobileAuthController_refreshToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileAuthController_refreshToken, request, response });

                const controller = new MobileAuthController();

              await templateService.apiHandler({
                methodName: 'refreshToken',
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
        const argsMobileAuthController_logout: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/customer/auth/logout',
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController)),
            ...(fetchMiddlewares<RequestHandler>(MobileAuthController.prototype.logout)),

            async function MobileAuthController_logout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMobileAuthController_logout, request, response });

                const controller = new MobileAuthController();

              await templateService.apiHandler({
                methodName: 'logout',
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
        const argsCustomerCouponController_getAvailableCoupons: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/customer/coupons/available',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerCouponController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerCouponController.prototype.getAvailableCoupons)),

            async function CustomerCouponController_getAvailableCoupons(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerCouponController_getAvailableCoupons, request, response });

                const controller = new CustomerCouponController();

              await templateService.apiHandler({
                methodName: 'getAvailableCoupons',
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
        const argsCustomerCouponController_applyCoupon: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"orderTotal":{"dataType":"double","required":true},"code":{"dataType":"string","required":true}}},
        };
        app.post('/customer/coupons/apply',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerCouponController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerCouponController.prototype.applyCoupon)),

            async function CustomerCouponController_applyCoupon(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerCouponController_applyCoupon, request, response });

                const controller = new CustomerCouponController();

              await templateService.apiHandler({
                methodName: 'applyCoupon',
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
        const argsCustomerBannerController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"IBannerFilter"},
        };
        app.get('/customer/banners',
            ...(fetchMiddlewares<RequestHandler>(CustomerBannerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerBannerController.prototype.getAll)),

            async function CustomerBannerController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCustomerBannerController_getAll, request, response });

                const controller = new CustomerBannerController();

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
        const argsAdminRefundController_getAllRefunds: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"queries","name":"query","required":true,"ref":"IRefundFilter"},
        };
        app.get('/admin/refunds',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminRefundController)),
            ...(fetchMiddlewares<RequestHandler>(AdminRefundController.prototype.getAllRefunds)),

            async function AdminRefundController_getAllRefunds(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminRefundController_getAllRefunds, request, response });

                const controller = new AdminRefundController();

              await templateService.apiHandler({
                methodName: 'getAllRefunds',
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
        const argsAdminRefundController_processRefund: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"rejectionReason":{"dataType":"string"},"adminNotes":{"dataType":"string"},"status":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["approved"]},{"dataType":"enum","enums":["rejected"]}],"required":true}}},
        };
        app.put('/admin/refunds/:id/process',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminRefundController)),
            ...(fetchMiddlewares<RequestHandler>(AdminRefundController.prototype.processRefund)),

            async function AdminRefundController_processRefund(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminRefundController_processRefund, request, response });

                const controller = new AdminRefundController();

              await templateService.apiHandler({
                methodName: 'processRefund',
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
        const argsAdminMarketingController_createCampaign: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"scheduleTime":{"dataType":"datetime","required":true},"context":{"dataType":"string"},"imageUrl":{"dataType":"string"},"message":{"dataType":"string","required":true},"title":{"dataType":"string","required":true}}},
        };
        app.post('/admin/marketing',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminMarketingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminMarketingController.prototype.createCampaign)),

            async function AdminMarketingController_createCampaign(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminMarketingController_createCampaign, request, response });

                const controller = new AdminMarketingController();

              await templateService.apiHandler({
                methodName: 'createCampaign',
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
        const argsAdminMarketingController_getCampaigns: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"queries","name":"query","required":true,"ref":"IFilter"},
        };
        app.get('/admin/marketing',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminMarketingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminMarketingController.prototype.getCampaigns)),

            async function AdminMarketingController_getCampaigns(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminMarketingController_getCampaigns, request, response });

                const controller = new AdminMarketingController();

              await templateService.apiHandler({
                methodName: 'getCampaigns',
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
        const argsAdminUsersController_getUsers: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                status: {"in":"query","name":"status","dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["inactive"]}]},
        };
        app.get('/admin/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController)),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController.prototype.getUsers)),

            async function AdminUsersController_getUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminUsersController_getUsers, request, response });

                const controller = new AdminUsersController();

              await templateService.apiHandler({
                methodName: 'getUsers',
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
        const argsAdminUsersController_deleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.delete('/admin/users/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController)),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController.prototype.deleteUser)),

            async function AdminUsersController_deleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminUsersController_deleteUser, request, response });

                const controller = new AdminUsersController();

              await templateService.apiHandler({
                methodName: 'deleteUser',
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
        const argsAdminUsersController_hardDeleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.delete('/admin/users/:userId/force',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController)),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController.prototype.hardDeleteUser)),

            async function AdminUsersController_hardDeleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminUsersController_hardDeleteUser, request, response });

                const controller = new AdminUsersController();

              await templateService.apiHandler({
                methodName: 'hardDeleteUser',
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
        const argsAdminUsersController_getUserById: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.get('/admin/users/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController)),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController.prototype.getUserById)),

            async function AdminUsersController_getUserById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminUsersController_getUserById, request, response });

                const controller = new AdminUsersController();

              await templateService.apiHandler({
                methodName: 'getUserById',
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
        const argsAdminUsersController_activateUser: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.post('/admin/users/:userId/activate',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController)),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController.prototype.activateUser)),

            async function AdminUsersController_activateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminUsersController_activateUser, request, response });

                const controller = new AdminUsersController();

              await templateService.apiHandler({
                methodName: 'activateUser',
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
        const argsAdminUsersController_deactivateUser: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.post('/admin/users/:userId/deactivate',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController)),
            ...(fetchMiddlewares<RequestHandler>(AdminUsersController.prototype.deactivateUser)),

            async function AdminUsersController_deactivateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminUsersController_deactivateUser, request, response });

                const controller = new AdminUsersController();

              await templateService.apiHandler({
                methodName: 'deactivateUser',
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
        const argsAdminReelController_create: Record<string, TsoaRoute.ParameterSchema> = {
                title: {"in":"formData","name":"title","required":true,"dataType":"string"},
                description: {"in":"formData","name":"description","dataType":"string"},
                isActive: {"in":"formData","name":"isActive","dataType":"string"},
                video: {"in":"formData","name":"video","dataType":"file"},
        };
        app.post('/admin/reels',
            authenticateMiddleware([{"jwt":[]}]),
            upload.fields([
                {
                    name: "video",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController)),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController.prototype.create)),

            async function AdminReelController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminReelController_create, request, response });

                const controller = new AdminReelController();

              await templateService.apiHandler({
                methodName: 'create',
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
        const argsAdminReelController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                filter: {"in":"queries","name":"filter","required":true,"ref":"IFilter"},
        };
        app.get('/admin/reels',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController)),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController.prototype.getAll)),

            async function AdminReelController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminReelController_getAll, request, response });

                const controller = new AdminReelController();

              await templateService.apiHandler({
                methodName: 'getAll',
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
        const argsAdminReelController_getById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/admin/reels/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController)),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController.prototype.getById)),

            async function AdminReelController_getById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminReelController_getById, request, response });

                const controller = new AdminReelController();

              await templateService.apiHandler({
                methodName: 'getById',
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
        const argsAdminReelController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                title: {"in":"formData","name":"title","dataType":"string"},
                description: {"in":"formData","name":"description","dataType":"string"},
                isActive: {"in":"formData","name":"isActive","dataType":"string"},
                video: {"in":"formData","name":"video","dataType":"file"},
        };
        app.put('/admin/reels/:id',
            authenticateMiddleware([{"jwt":[]}]),
            upload.fields([
                {
                    name: "video",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController)),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController.prototype.update)),

            async function AdminReelController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminReelController_update, request, response });

                const controller = new AdminReelController();

              await templateService.apiHandler({
                methodName: 'update',
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
        const argsAdminReelController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/reels/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController)),
            ...(fetchMiddlewares<RequestHandler>(AdminReelController.prototype.delete)),

            async function AdminReelController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminReelController_delete, request, response });

                const controller = new AdminReelController();

              await templateService.apiHandler({
                methodName: 'delete',
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
                description: {"in":"formData","name":"description","required":true,"dataType":"string"},
                mrp: {"in":"formData","name":"mrp","required":true,"dataType":"string"},
                sellingPrice: {"in":"formData","name":"sellingPrice","required":true,"dataType":"string"},
                unit: {"in":"formData","name":"unit","required":true,"dataType":"string"},
                category: {"in":"formData","name":"category","required":true,"dataType":"string"},
                quantity: {"in":"formData","name":"quantity","required":true,"dataType":"string"},
                productType: {"in":"formData","name":"productType","required":true,"dataType":"string"},
                brand: {"in":"formData","name":"brand","dataType":"string"},
                sku: {"in":"formData","name":"sku","dataType":"string"},
                isActive: {"in":"formData","name":"isActive","dataType":"string"},
                isFeatured: {"in":"formData","name":"isFeatured","dataType":"string"},
                productDetails: {"in":"formData","name":"productDetails","dataType":"string"},
                images: {"in":"formData","name":"images","dataType":"array","array":{"dataType":"file"}},
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
                name: {"in":"formData","name":"name","dataType":"string"},
                description: {"in":"formData","name":"description","dataType":"string"},
                mrp: {"in":"formData","name":"mrp","dataType":"string"},
                sellingPrice: {"in":"formData","name":"sellingPrice","dataType":"string"},
                unit: {"in":"formData","name":"unit","dataType":"string"},
                category: {"in":"formData","name":"category","dataType":"string"},
                quantity: {"in":"formData","name":"quantity","dataType":"string"},
                productType: {"in":"formData","name":"productType","dataType":"string"},
                brand: {"in":"formData","name":"brand","dataType":"string"},
                sku: {"in":"formData","name":"sku","dataType":"string"},
                isActive: {"in":"formData","name":"isActive","dataType":"string"},
                isFeatured: {"in":"formData","name":"isFeatured","dataType":"string"},
                productDetails: {"in":"formData","name":"productDetails","dataType":"string"},
                images: {"in":"formData","name":"images","dataType":"array","array":{"dataType":"file"}},
        };
        app.put('/admin/products/:id',
            upload.fields([
                {
                    name: "images",
                }
            ]),
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
        const argsAdminProductController_getAllProducts: Record<string, TsoaRoute.ParameterSchema> = {
                filter: {"in":"queries","name":"filter","required":true,"ref":"ProductFilterQueryParams"},
        };
        app.get('/admin/products',
            ...(fetchMiddlewares<RequestHandler>(AdminProductController)),
            ...(fetchMiddlewares<RequestHandler>(AdminProductController.prototype.getAllProducts)),

            async function AdminProductController_getAllProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminProductController_getAllProducts, request, response });

                const controller = new AdminProductController();

              await templateService.apiHandler({
                methodName: 'getAllProducts',
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
        const argsAdminProductController_getProductBySlug: Record<string, TsoaRoute.ParameterSchema> = {
                slug: {"in":"path","name":"slug","required":true,"dataType":"string"},
        };
        app.get('/admin/products/slug/:slug',
            ...(fetchMiddlewares<RequestHandler>(AdminProductController)),
            ...(fetchMiddlewares<RequestHandler>(AdminProductController.prototype.getProductBySlug)),

            async function AdminProductController_getProductBySlug(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminProductController_getProductBySlug, request, response });

                const controller = new AdminProductController();

              await templateService.apiHandler({
                methodName: 'getProductBySlug',
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
        const argsAdminOrderController_getAllOrders: Record<string, TsoaRoute.ParameterSchema> = {
                filter: {"in":"queries","name":"filter","required":true,"ref":"OrderFilterQueryParams"},
        };
        app.get('/admin/orders',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.getAllOrders)),

            async function AdminOrderController_getAllOrders(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_getAllOrders, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'getAllOrders',
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
        const argsAdminOrderController_getOrderById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/admin/orders/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.getOrderById)),

            async function AdminOrderController_getOrderById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_getOrderById, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'getOrderById',
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
        const argsAdminOrderController_getOrderByOrderNumber: Record<string, TsoaRoute.ParameterSchema> = {
                orderNumber: {"in":"path","name":"orderNumber","required":true,"dataType":"string"},
        };
        app.get('/admin/orders/order-number/:orderNumber',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.getOrderByOrderNumber)),

            async function AdminOrderController_getOrderByOrderNumber(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_getOrderByOrderNumber, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'getOrderByOrderNumber',
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
        const argsAdminOrderController_updateOrder: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                data: {"in":"body","name":"data","required":true,"ref":"IUpdateOrderRequest"},
        };
        app.put('/admin/orders/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.updateOrder)),

            async function AdminOrderController_updateOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_updateOrder, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'updateOrder',
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
        const argsAdminOrderController_confirmOrder: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"estimatedDelivery":{"dataType":"datetime"}}},
        };
        app.post('/admin/orders/:id/confirm',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.confirmOrder)),

            async function AdminOrderController_confirmOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_confirmOrder, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'confirmOrder',
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
        const argsAdminOrderController_dispatchOrder: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"deliveryPartner":{"dataType":"string"},"estimatedDelivery":{"dataType":"datetime"},"trackingNumber":{"dataType":"string"}}},
        };
        app.post('/admin/orders/:id/dispatch',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.dispatchOrder)),

            async function AdminOrderController_dispatchOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_dispatchOrder, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'dispatchOrder',
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
        const argsAdminOrderController_outForDelivery: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/admin/orders/:id/out-for-delivery',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.outForDelivery)),

            async function AdminOrderController_outForDelivery(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_outForDelivery, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'outForDelivery',
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
        const argsAdminOrderController_deliverOrder: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"deliveryNotes":{"dataType":"string"}}},
        };
        app.post('/admin/orders/:id/deliver',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.deliverOrder)),

            async function AdminOrderController_deliverOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_deliverOrder, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'deliverOrder',
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
        const argsAdminOrderController_cancelOrder: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"reason":{"dataType":"string","required":true}}},
        };
        app.post('/admin/orders/:id/cancel',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.cancelOrder)),

            async function AdminOrderController_cancelOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_cancelOrder, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'cancelOrder',
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
        const argsAdminOrderController_refundOrder: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"refundAmount":{"dataType":"double"},"reason":{"dataType":"string","required":true}}},
        };
        app.post('/admin/orders/:id/refund',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.refundOrder)),

            async function AdminOrderController_refundOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_refundOrder, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'refundOrder',
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
        const argsAdminOrderController_deleteOrder: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/orders/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.deleteOrder)),

            async function AdminOrderController_deleteOrder(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_deleteOrder, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'deleteOrder',
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
        const argsAdminOrderController_getOrderStats: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/orders/analytics/stats',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.getOrderStats)),

            async function AdminOrderController_getOrderStats(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_getOrderStats, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'getOrderStats',
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
        const argsAdminOrderController_getPendingDispatchOrders: Record<string, TsoaRoute.ParameterSchema> = {
                filter: {"in":"queries","name":"filter","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double"},"page":{"dataType":"double"}}},
        };
        app.get('/admin/orders/pending-dispatch',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.getPendingDispatchOrders)),

            async function AdminOrderController_getPendingDispatchOrders(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_getPendingDispatchOrders, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'getPendingDispatchOrders',
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
        const argsAdminOrderController_getActiveDeliveries: Record<string, TsoaRoute.ParameterSchema> = {
                filter: {"in":"queries","name":"filter","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double"},"page":{"dataType":"double"}}},
        };
        app.get('/admin/orders/active-deliveries',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.getActiveDeliveries)),

            async function AdminOrderController_getActiveDeliveries(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_getActiveDeliveries, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'getActiveDeliveries',
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
        const argsAdminOrderController_bulkUpdateStatus: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"orderStatus":{"ref":"OrderStatus","required":true},"orderIds":{"dataType":"array","array":{"dataType":"string"},"required":true}}},
        };
        app.put('/admin/orders/bulk/update-status',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController)),
            ...(fetchMiddlewares<RequestHandler>(AdminOrderController.prototype.bulkUpdateStatus)),

            async function AdminOrderController_bulkUpdateStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminOrderController_bulkUpdateStatus, request, response });

                const controller = new AdminOrderController();

              await templateService.apiHandler({
                methodName: 'bulkUpdateStatus',
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
        const argsAdminDeliveryBoyController_createDeliveryBoy: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"IAdminCreateDeliveryBoyInput"},
        };
        app.post('/admin/delivery-boys',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.createDeliveryBoy)),

            async function AdminDeliveryBoyController_createDeliveryBoy(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_createDeliveryBoy, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'createDeliveryBoy',
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
        const argsAdminDeliveryBoyController_getDeliveryBoysList: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                search: {"in":"query","name":"search","dataType":"string"},
                isActive: {"in":"query","name":"isActive","dataType":"boolean"},
                isAvailable: {"in":"query","name":"isAvailable","dataType":"boolean"},
                isDocumentVerified: {"in":"query","name":"isDocumentVerified","dataType":"boolean"},
                vehicleType: {"in":"query","name":"vehicleType","dataType":"union","subSchemas":[{"dataType":"enum","enums":["bike"]},{"dataType":"enum","enums":["scooter"]},{"dataType":"enum","enums":["bicycle"]},{"dataType":"enum","enums":["car"]}]},
                deliveryZone: {"in":"query","name":"deliveryZone","dataType":"string"},
                sortBy: {"in":"query","name":"sortBy","dataType":"union","subSchemas":[{"dataType":"enum","enums":["name"]},{"dataType":"enum","enums":["createdAt"]},{"dataType":"enum","enums":["totalDeliveries"]},{"dataType":"enum","enums":["averageRating"]}]},
                sortOrder: {"in":"query","name":"sortOrder","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
        };
        app.get('/admin/delivery-boys',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.getDeliveryBoysList)),

            async function AdminDeliveryBoyController_getDeliveryBoysList(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_getDeliveryBoysList, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'getDeliveryBoysList',
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
        const argsAdminDeliveryBoyController_getStatistics: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/delivery-boys/stats',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.getStatistics)),

            async function AdminDeliveryBoyController_getStatistics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_getStatistics, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'getStatistics',
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
        const argsAdminDeliveryBoyController_getDeliveryBoy: Record<string, TsoaRoute.ParameterSchema> = {
                deliveryBoyId: {"in":"path","name":"deliveryBoyId","required":true,"dataType":"string"},
        };
        app.get('/admin/delivery-boys/:deliveryBoyId',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.getDeliveryBoy)),

            async function AdminDeliveryBoyController_getDeliveryBoy(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_getDeliveryBoy, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'getDeliveryBoy',
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
        const argsAdminDeliveryBoyController_updateDeliveryBoy: Record<string, TsoaRoute.ParameterSchema> = {
                deliveryBoyId: {"in":"path","name":"deliveryBoyId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"IAdminUpdateDeliveryBoyInput"},
        };
        app.put('/admin/delivery-boys/:deliveryBoyId',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.updateDeliveryBoy)),

            async function AdminDeliveryBoyController_updateDeliveryBoy(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_updateDeliveryBoy, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'updateDeliveryBoy',
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
        const argsAdminDeliveryBoyController_deleteDeliveryBoy: Record<string, TsoaRoute.ParameterSchema> = {
                deliveryBoyId: {"in":"path","name":"deliveryBoyId","required":true,"dataType":"string"},
        };
        app.delete('/admin/delivery-boys/:deliveryBoyId',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.deleteDeliveryBoy)),

            async function AdminDeliveryBoyController_deleteDeliveryBoy(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_deleteDeliveryBoy, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'deleteDeliveryBoy',
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
        const argsAdminDeliveryBoyController_toggleStatus: Record<string, TsoaRoute.ParameterSchema> = {
                deliveryBoyId: {"in":"path","name":"deliveryBoyId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"IToggleDeliveryBoyStatusInput"},
        };
        app.put('/admin/delivery-boys/:deliveryBoyId/status',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.toggleStatus)),

            async function AdminDeliveryBoyController_toggleStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_toggleStatus, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'toggleStatus',
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
        const argsAdminDeliveryBoyController_verifyDocuments: Record<string, TsoaRoute.ParameterSchema> = {
                deliveryBoyId: {"in":"path","name":"deliveryBoyId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"IVerifyDeliveryBoyDocumentsInput"},
        };
        app.put('/admin/delivery-boys/:deliveryBoyId/verify-documents',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.verifyDocuments)),

            async function AdminDeliveryBoyController_verifyDocuments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_verifyDocuments, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'verifyDocuments',
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
        const argsAdminDeliveryBoyController_assignZones: Record<string, TsoaRoute.ParameterSchema> = {
                deliveryBoyId: {"in":"path","name":"deliveryBoyId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"IAssignDeliveryZonesInput"},
        };
        app.put('/admin/delivery-boys/:deliveryBoyId/assign-zones',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.assignZones)),

            async function AdminDeliveryBoyController_assignZones(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_assignZones, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'assignZones',
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
        const argsAdminDeliveryBoyController_getPerformance: Record<string, TsoaRoute.ParameterSchema> = {
                deliveryBoyId: {"in":"path","name":"deliveryBoyId","required":true,"dataType":"string"},
        };
        app.get('/admin/delivery-boys/:deliveryBoyId/performance',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.getPerformance)),

            async function AdminDeliveryBoyController_getPerformance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_getPerformance, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'getPerformance',
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
        const argsAdminDeliveryBoyController_getAvailableDeliveryBoys: Record<string, TsoaRoute.ParameterSchema> = {
                zone: {"in":"query","name":"zone","dataType":"string"},
        };
        app.get('/admin/delivery-boys/available/list',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.getAvailableDeliveryBoys)),

            async function AdminDeliveryBoyController_getAvailableDeliveryBoys(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_getAvailableDeliveryBoys, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'getAvailableDeliveryBoys',
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
        const argsAdminDeliveryBoyController_bulkOperation: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"IBulkDeliveryBoyOperation"},
        };
        app.post('/admin/delivery-boys/bulk-operation',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDeliveryBoyController.prototype.bulkOperation)),

            async function AdminDeliveryBoyController_bulkOperation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDeliveryBoyController_bulkOperation, request, response });

                const controller = new AdminDeliveryBoyController();

              await templateService.apiHandler({
                methodName: 'bulkOperation',
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
        const argsAdminDashboardController_getDashboardStats: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/dashboard/stats',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController.prototype.getDashboardStats)),

            async function AdminDashboardController_getDashboardStats(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDashboardController_getDashboardStats, request, response });

                const controller = new AdminDashboardController();

              await templateService.apiHandler({
                methodName: 'getDashboardStats',
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
        const argsAdminDashboardController_getSalesOverview: Record<string, TsoaRoute.ParameterSchema> = {
                period: {"default":"30days","in":"query","name":"period","dataType":"union","subSchemas":[{"dataType":"enum","enums":["7days"]},{"dataType":"enum","enums":["30days"]},{"dataType":"enum","enums":["90days"]},{"dataType":"enum","enums":["1year"]}]},
        };
        app.get('/admin/dashboard/sales-overview',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController.prototype.getSalesOverview)),

            async function AdminDashboardController_getSalesOverview(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDashboardController_getSalesOverview, request, response });

                const controller = new AdminDashboardController();

              await templateService.apiHandler({
                methodName: 'getSalesOverview',
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
        const argsAdminDashboardController_getRecentOrders: Record<string, TsoaRoute.ParameterSchema> = {
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/admin/dashboard/recent-orders',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController.prototype.getRecentOrders)),

            async function AdminDashboardController_getRecentOrders(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDashboardController_getRecentOrders, request, response });

                const controller = new AdminDashboardController();

              await templateService.apiHandler({
                methodName: 'getRecentOrders',
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
        const argsAdminDashboardController_getTopProducts: Record<string, TsoaRoute.ParameterSchema> = {
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/admin/dashboard/top-products',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController.prototype.getTopProducts)),

            async function AdminDashboardController_getTopProducts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDashboardController_getTopProducts, request, response });

                const controller = new AdminDashboardController();

              await templateService.apiHandler({
                methodName: 'getTopProducts',
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
        const argsAdminDashboardController_getCustomerInsights: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/dashboard/customer-insights',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController.prototype.getCustomerInsights)),

            async function AdminDashboardController_getCustomerInsights(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDashboardController_getCustomerInsights, request, response });

                const controller = new AdminDashboardController();

              await templateService.apiHandler({
                methodName: 'getCustomerInsights',
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
        const argsAdminDashboardController_getOrderStatusDistribution: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/dashboard/order-status-distribution',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController.prototype.getOrderStatusDistribution)),

            async function AdminDashboardController_getOrderStatusDistribution(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDashboardController_getOrderStatusDistribution, request, response });

                const controller = new AdminDashboardController();

              await templateService.apiHandler({
                methodName: 'getOrderStatusDistribution',
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
        const argsAdminDashboardController_getRevenueByPaymentMethod: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/dashboard/revenue-by-payment-method',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController.prototype.getRevenueByPaymentMethod)),

            async function AdminDashboardController_getRevenueByPaymentMethod(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDashboardController_getRevenueByPaymentMethod, request, response });

                const controller = new AdminDashboardController();

              await templateService.apiHandler({
                methodName: 'getRevenueByPaymentMethod',
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
        const argsAdminDashboardController_getCloudinaryUsageStats: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/dashboard/cloudinary-usage',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController.prototype.getCloudinaryUsageStats)),

            async function AdminDashboardController_getCloudinaryUsageStats(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDashboardController_getCloudinaryUsageStats, request, response });

                const controller = new AdminDashboardController();

              await templateService.apiHandler({
                methodName: 'getCloudinaryUsageStats',
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
        const argsAdminCategoryController_create: Record<string, TsoaRoute.ParameterSchema> = {
                name: {"in":"formData","name":"name","required":true,"dataType":"string"},
                description: {"in":"formData","name":"description","dataType":"string"},
                parentId: {"in":"formData","name":"parentId","dataType":"string"},
                backgroundColor: {"in":"formData","name":"backgroundColor","dataType":"string"},
                textColor: {"in":"formData","name":"textColor","dataType":"string"},
                deepLink: {"in":"formData","name":"deepLink","dataType":"string"},
                slug: {"in":"formData","name":"slug","dataType":"string"},
                categoryImage: {"in":"formData","name":"categoryImage","dataType":"file"},
        };
        app.post('/admin/categories',
            authenticateMiddleware([{"jwt":[]}]),
            upload.fields([
                {
                    name: "categoryImage",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.create)),

            async function AdminCategoryController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_create, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'create',
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
                filter: {"in":"queries","name":"filter","required":true,"ref":"IFilter"},
        };
        app.get('/admin/categories',
            authenticateMiddleware([{"jwt":[]}]),
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
            authenticateMiddleware([{"jwt":[]}]),
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
        const argsAdminCategoryController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                name: {"in":"formData","name":"name","dataType":"string"},
                description: {"in":"formData","name":"description","dataType":"string"},
                parentId: {"in":"formData","name":"parentId","dataType":"string"},
                backgroundColor: {"in":"formData","name":"backgroundColor","dataType":"string"},
                textColor: {"in":"formData","name":"textColor","dataType":"string"},
                deepLink: {"in":"formData","name":"deepLink","dataType":"string"},
                slug: {"in":"formData","name":"slug","dataType":"string"},
                categoryImage: {"in":"formData","name":"categoryImage","dataType":"file"},
        };
        app.put('/admin/categories/:id',
            authenticateMiddleware([{"jwt":[]}]),
            upload.fields([
                {
                    name: "categoryImage",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.update)),

            async function AdminCategoryController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_update, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'update',
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
        const argsAdminCategoryController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/categories/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.delete)),

            async function AdminCategoryController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_delete, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'delete',
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
        const argsAdminCategoryController_deleteMultiple: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.delete('/admin/categories/bulk/delete-all',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCategoryController.prototype.deleteMultiple)),

            async function AdminCategoryController_deleteMultiple(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCategoryController_deleteMultiple, request, response });

                const controller = new AdminCategoryController();

              await templateService.apiHandler({
                methodName: 'deleteMultiple',
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
        const argsAdminCartController_getCarts: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":20,"in":"query","name":"limit","dataType":"double"},
                status: {"in":"query","name":"status","dataType":"string"},
                userId: {"in":"query","name":"userId","dataType":"string"},
                startDate: {"in":"query","name":"startDate","dataType":"string"},
                endDate: {"in":"query","name":"endDate","dataType":"string"},
                sortBy: {"default":"createdAt","in":"query","name":"sortBy","dataType":"union","subSchemas":[{"dataType":"enum","enums":["createdAt"]},{"dataType":"enum","enums":["totalAmount"]},{"dataType":"enum","enums":["totalItems"]}]},
                sortOrder: {"default":"desc","in":"query","name":"sortOrder","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
        };
        app.get('/admin/carts',
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
        const argsBannerController_createBanner: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/admin/banners',
            ...(fetchMiddlewares<RequestHandler>(BannerController)),
            ...(fetchMiddlewares<RequestHandler>(BannerController.prototype.createBanner)),

            async function BannerController_createBanner(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBannerController_createBanner, request, response });

                const controller = new BannerController();

              await templateService.apiHandler({
                methodName: 'createBanner',
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
        const argsBannerController_getAllBanners: Record<string, TsoaRoute.ParameterSchema> = {
                filter: {"in":"queries","name":"filter","required":true,"ref":"IBannerFilter"},
        };
        app.get('/admin/banners',
            ...(fetchMiddlewares<RequestHandler>(BannerController)),
            ...(fetchMiddlewares<RequestHandler>(BannerController.prototype.getAllBanners)),

            async function BannerController_getAllBanners(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBannerController_getAllBanners, request, response });

                const controller = new BannerController();

              await templateService.apiHandler({
                methodName: 'getAllBanners',
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
        const argsBannerController_getBannerById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/admin/banners/:id',
            ...(fetchMiddlewares<RequestHandler>(BannerController)),
            ...(fetchMiddlewares<RequestHandler>(BannerController.prototype.getBannerById)),

            async function BannerController_getBannerById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBannerController_getBannerById, request, response });

                const controller = new BannerController();

              await templateService.apiHandler({
                methodName: 'getBannerById',
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
        const argsBannerController_deleteBanner: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/banners/:id',
            ...(fetchMiddlewares<RequestHandler>(BannerController)),
            ...(fetchMiddlewares<RequestHandler>(BannerController.prototype.deleteBanner)),

            async function BannerController_deleteBanner(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBannerController_deleteBanner, request, response });

                const controller = new BannerController();

              await templateService.apiHandler({
                methodName: 'deleteBanner',
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
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"IFilter"},
        };
        app.get('/admin/customer-list',
            authenticateMiddleware([{"jwt":[]}]),
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
            authenticateMiddleware([{"jwt":[]}]),
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
        const argsAdminController_refreshToken: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"refreshToken":{"dataType":"string","required":true}}},
        };
        app.post('/admin/refresh-token',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.refreshToken)),

            async function AdminController_refreshToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_refreshToken, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'refreshToken',
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
        const argsAdminSettingsController_updateSettings: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_ISettings_"},
        };
        app.put('/admin/settings',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminSettingsController)),
            ...(fetchMiddlewares<RequestHandler>(AdminSettingsController.prototype.updateSettings)),

            async function AdminSettingsController_updateSettings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminSettingsController_updateSettings, request, response });

                const controller = new AdminSettingsController();

              await templateService.apiHandler({
                methodName: 'updateSettings',
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
        const argsAdminSettingsController_getSettings: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/admin/settings',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminSettingsController)),
            ...(fetchMiddlewares<RequestHandler>(AdminSettingsController.prototype.getSettings)),

            async function AdminSettingsController_getSettings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminSettingsController_getSettings, request, response });

                const controller = new AdminSettingsController();

              await templateService.apiHandler({
                methodName: 'getSettings',
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
        const argsAdminNotificationController_createNotification: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"imageUrl":{"dataType":"string"},"scheduledAt":{"dataType":"datetime"},"targetAudience":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["all"]},{"dataType":"enum","enums":["customers"]},{"dataType":"enum","enums":["vendors"]}],"required":true},"message":{"dataType":"string","required":true},"title":{"dataType":"string","required":true}}},
        };
        app.post('/admin/cms/notifications',
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController)),
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController.prototype.createNotification)),

            async function AdminNotificationController_createNotification(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminNotificationController_createNotification, request, response });

                const controller = new AdminNotificationController();

              await templateService.apiHandler({
                methodName: 'createNotification',
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
        const argsAdminNotificationController_getAllNotifications: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"IFilter"},
        };
        app.get('/admin/cms/notifications',
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController)),
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController.prototype.getAllNotifications)),

            async function AdminNotificationController_getAllNotifications(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminNotificationController_getAllNotifications, request, response });

                const controller = new AdminNotificationController();

              await templateService.apiHandler({
                methodName: 'getAllNotifications',
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
        const argsAdminNotificationController_getNotificationById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/admin/cms/notifications/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController)),
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController.prototype.getNotificationById)),

            async function AdminNotificationController_getNotificationById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminNotificationController_getNotificationById, request, response });

                const controller = new AdminNotificationController();

              await templateService.apiHandler({
                methodName: 'getNotificationById',
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
        const argsAdminNotificationController_updateNotification: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_INotification_"},
        };
        app.put('/admin/cms/notifications/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController)),
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController.prototype.updateNotification)),

            async function AdminNotificationController_updateNotification(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminNotificationController_updateNotification, request, response });

                const controller = new AdminNotificationController();

              await templateService.apiHandler({
                methodName: 'updateNotification',
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
        const argsAdminNotificationController_deleteNotification: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/cms/notifications/:id',
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController)),
            ...(fetchMiddlewares<RequestHandler>(AdminNotificationController.prototype.deleteNotification)),

            async function AdminNotificationController_deleteNotification(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminNotificationController_deleteNotification, request, response });

                const controller = new AdminNotificationController();

              await templateService.apiHandler({
                methodName: 'deleteNotification',
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
        const argsKisanCommunityController_create: Record<string, TsoaRoute.ParameterSchema> = {
                farmerName: {"in":"formData","name":"farmerName","required":true,"dataType":"string"},
                farmName: {"in":"formData","name":"farmName","required":true,"dataType":"string"},
                farmLocation: {"in":"formData","name":"farmLocation","required":true,"dataType":"string"},
                mobile: {"in":"formData","name":"mobile","required":true,"dataType":"string"},
                products: {"in":"formData","name":"products","required":true,"dataType":"string"},
                description: {"in":"formData","name":"description","required":true,"dataType":"string"},
                email: {"in":"formData","name":"email","dataType":"string"},
                profileImage: {"in":"formData","name":"profileImage","dataType":"file"},
        };
        app.post('/admin/cms/kisan-community',
            upload.fields([
                {
                    name: "profileImage",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController)),
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController.prototype.create)),

            async function KisanCommunityController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsKisanCommunityController_create, request, response });

                const controller = new KisanCommunityController();

              await templateService.apiHandler({
                methodName: 'create',
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
        const argsKisanCommunityController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"IFilter"},
        };
        app.get('/admin/cms/kisan-community',
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController)),
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController.prototype.getAll)),

            async function KisanCommunityController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsKisanCommunityController_getAll, request, response });

                const controller = new KisanCommunityController();

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
        const argsKisanCommunityController_getById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/admin/cms/kisan-community/:id',
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController)),
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController.prototype.getById)),

            async function KisanCommunityController_getById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsKisanCommunityController_getById, request, response });

                const controller = new KisanCommunityController();

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
        const argsKisanCommunityController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                farmerName: {"in":"formData","name":"farmerName","dataType":"string"},
                farmName: {"in":"formData","name":"farmName","dataType":"string"},
                farmLocation: {"in":"formData","name":"farmLocation","dataType":"string"},
                mobile: {"in":"formData","name":"mobile","dataType":"string"},
                products: {"in":"formData","name":"products","dataType":"string"},
                description: {"in":"formData","name":"description","dataType":"string"},
                email: {"in":"formData","name":"email","dataType":"string"},
                profileImage: {"in":"formData","name":"profileImage","dataType":"file"},
        };
        app.put('/admin/cms/kisan-community/:id',
            upload.fields([
                {
                    name: "profileImage",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController)),
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController.prototype.update)),

            async function KisanCommunityController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsKisanCommunityController_update, request, response });

                const controller = new KisanCommunityController();

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
        const argsKisanCommunityController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/cms/kisan-community/:id',
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController)),
            ...(fetchMiddlewares<RequestHandler>(KisanCommunityController.prototype.delete)),

            async function KisanCommunityController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsKisanCommunityController_delete, request, response });

                const controller = new KisanCommunityController();

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
        const argsAdminCouponController_create: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ICouponCreateRequest"},
        };
        app.post('/admin/coupons',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController.prototype.create)),

            async function AdminCouponController_create(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCouponController_create, request, response });

                const controller = new AdminCouponController();

              await templateService.apiHandler({
                methodName: 'create',
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
        const argsAdminCouponController_getAll: Record<string, TsoaRoute.ParameterSchema> = {
                queryParams: {"in":"queries","name":"queryParams","required":true,"ref":"IFilter"},
        };
        app.get('/admin/coupons',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController.prototype.getAll)),

            async function AdminCouponController_getAll(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCouponController_getAll, request, response });

                const controller = new AdminCouponController();

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
        const argsAdminCouponController_getById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/admin/coupons/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController.prototype.getById)),

            async function AdminCouponController_getById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCouponController_getById, request, response });

                const controller = new AdminCouponController();

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
        const argsAdminCouponController_update: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"Partial_ICoupon_"},
        };
        app.put('/admin/coupons/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController.prototype.update)),

            async function AdminCouponController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCouponController_update, request, response });

                const controller = new AdminCouponController();

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
        const argsAdminCouponController_delete: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/admin/coupons/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCouponController.prototype.delete)),

            async function AdminCouponController_delete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCouponController_delete, request, response });

                const controller = new AdminCouponController();

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
