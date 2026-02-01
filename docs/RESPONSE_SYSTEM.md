# Response Messages & Decorators System

A comprehensive, reusable system for managing API response messages and TSOA decorators across the application.

## 📁 Files

- `src/constants/response-messages.ts` - Centralized response message constants
- `src/constants/response-decorators.ts` - Reusable response decorator helpers

## 🎯 Purpose

This system provides:
1. **Centralized Messages**: All success/error messages in one place
2. **Reusable Decorators**: Eliminate repetitive `@Response` decorators
3. **Consistency**: Uniform response messages across the API
4. **Maintainability**: Easy to update messages project-wide

---

## 📚 Response Messages

### Available Constants

#### 1. HTTP_STATUS_MESSAGES
Standard HTTP status code messages:
```typescript
import { HTTP_STATUS_MESSAGES } from '../constants/response-messages';

HTTP_STATUS_MESSAGES[200] // 'Success'
HTTP_STATUS_MESSAGES[404] // 'Not Found'
HTTP_STATUS_MESSAGES[500] // 'Internal Server Error'
```

#### 2. SUCCESS_MESSAGES
Common success messages organized by operation type:
```typescript
import { SUCCESS_MESSAGES } from '../constants/response-messages';

// Generic
SUCCESS_MESSAGES.SUCCESS
SUCCESS_MESSAGES.OPERATION_SUCCESSFUL

// CRUD Operations
SUCCESS_MESSAGES.CREATED
SUCCESS_MESSAGES.UPDATED
SUCCESS_MESSAGES.DELETED
SUCCESS_MESSAGES.RETRIEVED

// Authentication
SUCCESS_MESSAGES.LOGIN_SUCCESS
SUCCESS_MESSAGES.LOGOUT_SUCCESS
SUCCESS_MESSAGES.OTP_SENT
SUCCESS_MESSAGES.OTP_VERIFIED
SUCCESS_MESSAGES.TOKEN_REFRESHED

// User Operations
SUCCESS_MESSAGES.PROFILE_UPDATED
SUCCESS_MESSAGES.PROFILE_RETRIEVED
SUCCESS_MESSAGES.USER_CREATED

// Order Operations
SUCCESS_MESSAGES.ORDER_PLACED
SUCCESS_MESSAGES.ORDER_UPDATED
SUCCESS_MESSAGES.ORDER_CANCELLED

// Cart Operations
SUCCESS_MESSAGES.ITEM_ADDED_TO_CART
SUCCESS_MESSAGES.ITEM_REMOVED_FROM_CART
SUCCESS_MESSAGES.CART_UPDATED
SUCCESS_MESSAGES.CART_CLEARED

// Payment Operations
SUCCESS_MESSAGES.PAYMENT_SUCCESSFUL
SUCCESS_MESSAGES.PAYMENT_VERIFIED
SUCCESS_MESSAGES.REFUND_INITIATED

// ... and many more!
```

#### 3. ERROR_MESSAGES
Common error messages organized by error type:
```typescript
import { ERROR_MESSAGES } from '../constants/response-messages';

// Generic Errors
ERROR_MESSAGES.BAD_REQUEST
ERROR_MESSAGES.UNAUTHORIZED
ERROR_MESSAGES.FORBIDDEN
ERROR_MESSAGES.NOT_FOUND
ERROR_MESSAGES.INTERNAL_SERVER_ERROR

// Authentication Errors
ERROR_MESSAGES.INVALID_CREDENTIALS
ERROR_MESSAGES.TOKEN_EXPIRED
ERROR_MESSAGES.SESSION_EXPIRED
ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS

// Validation Errors
ERROR_MESSAGES.REQUIRED_FIELD_MISSING
ERROR_MESSAGES.INVALID_EMAIL
ERROR_MESSAGES.PASSWORD_TOO_WEAK

// Resource Errors
ERROR_MESSAGES.RESOURCE_NOT_FOUND
ERROR_MESSAGES.RESOURCE_ALREADY_EXISTS

// User Errors
ERROR_MESSAGES.USER_NOT_FOUND
ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED

// ... and many more!
```

---

## 🎨 Response Decorators

### Available Decorators

#### 1. @CustomerControllerResponses()
For customer-facing endpoints with full error responses:
```typescript
import { CustomerControllerResponses } from '../constants/response-decorators';

@Route('customer/auth')
@Tags('Customer Authentication')
@CustomerControllerResponses()  // ✅ Replaces 5+ @Response decorators
export class MobileAuthController extends BaseController {
    // ... methods
}
```

**Includes:**
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Error
- 500 Internal Server Error

#### 2. @AdminControllerResponses()
For admin endpoints (includes conflict responses):
```typescript
import { AdminControllerResponses } from '../constants/response-decorators';

@Route('admin/users')
@Tags('Admin - Users')
@AdminControllerResponses()
export class AdminUsersController extends BaseController {
    // ... methods
}
```

**Includes:**
- All standard error responses
- 409 Conflict (for duplicate resources)

#### 3. @ApiErrorResponses()
For simpler controllers using `ErrorResponse` type:
```typescript
import { ApiErrorResponses } from '../constants/response-decorators';

@Route('customer/products')
@Tags('Products')
@ApiErrorResponses()
export class ProductController extends BaseController {
    // ... methods
}
```

#### 4. @PublicControllerResponses()
For public endpoints with minimal error responses:
```typescript
import { PublicControllerResponses } from '../constants/response-decorators';

@Route('public/categories')
@Tags('Public Categories')
@PublicControllerResponses()
export class PublicCategoryController extends BaseController {
    // ... methods
}
```

#### 5. @StandardErrorResponses()
Generic standard error responses:
```typescript
import { StandardErrorResponses } from '../constants/response-decorators';

@Route('generic/endpoint')
@StandardErrorResponses()
export class GenericController extends BaseController {
    // ... methods
}
```

#### 6. @ConflictResponse()
Add conflict response to any controller:
```typescript
import { ConflictResponse } from '../constants/response-decorators';

@Route('resources')
@StandardErrorResponses()
@ConflictResponse()
export class ResourceController extends BaseController {
    // ... methods
}
```

---

## 🚀 Usage Examples

### Example 1: Customer Authentication Controller
**Before:**
```typescript
@Route('customer/auth')
@Tags('Customer Authentication')
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found', NOT_FOUND_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
export class MobileAuthController extends BaseController {
  @Post('send-otp')
  public async sendOtp(@Body() body: ISendOtpInput) {
    const result = await authService.sendLoginOtp(body.phone);
    return this.sendSuccess(result, 'OTP sent successfully');
  }
}
```

**After:**
```typescript
import { CustomerControllerResponses } from '../constants/response-decorators';
import { SUCCESS_MESSAGES } from '../constants/response-messages';

@Route('customer/auth')
@Tags('Customer Authentication')
@CustomerControllerResponses()  // ✅ Clean!
export class MobileAuthController extends BaseController {
  @Post('send-otp')
  public async sendOtp(@Body() body: ISendOtpInput) {
    const result = await authService.sendLoginOtp(body.phone);
    return this.sendSuccess(result, SUCCESS_MESSAGES.OTP_SENT);  // ✅ Consistent!
  }
}
```

### Example 2: Admin User Controller
```typescript
import { AdminControllerResponses } from '../constants/response-decorators';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/response-messages';

@Route('admin/users')
@Tags('Admin - Users')
@Security('jwt', ['admin'])
@AdminControllerResponses()
export class AdminUsersController extends BaseController {
  
  @Post()
  public async createUser(@Body() body: ICreateUserInput) {
    const user = await userService.createUser(body);
    return this.sendCreated(user, SUCCESS_MESSAGES.USER_CREATED);
  }
  
  @Get('{id}')
  public async getUser(@Path() id: string) {
    const user = await userService.findById(id);
    if (!user) {
      throw new APIError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    }
    return this.sendSuccess(user, SUCCESS_MESSAGES.USER_RETRIEVED);
  }
  
  @Put('{id}')
  public async updateUser(@Path() id: string, @Body() body: IUpdateUserInput) {
    const user = await userService.updateUser(id, body);
    return this.sendSuccess(user, SUCCESS_MESSAGES.USER_UPDATED);
  }
  
  @Delete('{id}')
  public async deleteUser(@Path() id: string) {
    await userService.deleteUser(id);
    return this.sendSuccess(null, SUCCESS_MESSAGES.USER_DELETED);
  }
}
```

### Example 3: Order Controller
```typescript
import { CustomerControllerResponses } from '../constants/response-decorators';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/response-messages';

@Route('customer/orders')
@Tags('Orders')
@Security('jwt')
@CustomerControllerResponses()
export class OrderController extends BaseController {
  
  @Post()
  public async createOrder(@Body() body: ICreateOrderInput, @Request() req: any) {
    const order = await orderService.createOrder(req.user.userId, body);
    return this.sendCreated(order, SUCCESS_MESSAGES.ORDER_PLACED);
  }
  
  @Get('{id}')
  public async getOrder(@Path() id: string) {
    const order = await orderService.findById(id);
    if (!order) {
      throw new APIError(ERROR_MESSAGES.ORDER_NOT_FOUND, 404);
    }
    return this.sendSuccess(order, SUCCESS_MESSAGES.ORDER_RETRIEVED);
  }
  
  @Put('{id}/cancel')
  public async cancelOrder(@Path() id: string) {
    const order = await orderService.cancelOrder(id);
    return this.sendSuccess(order, SUCCESS_MESSAGES.ORDER_CANCELLED);
  }
}
```

---

## 📖 Best Practices

### 1. Always Use Constants for Messages
❌ **Don't:**
```typescript
return this.sendSuccess(user, 'User profile updated successfully');
```

✅ **Do:**
```typescript
return this.sendSuccess(user, SUCCESS_MESSAGES.PROFILE_UPDATED);
```

### 2. Use Appropriate Decorator for Controller Type
```typescript
// Customer controllers
@CustomerControllerResponses()

// Admin controllers
@AdminControllerResponses()

// Public endpoints
@PublicControllerResponses()
```

### 3. Combine with BaseController Methods
```typescript
// For standard responses
return this.sendSuccess(data, SUCCESS_MESSAGES.RETRIEVED);

// For created resources
return this.sendCreated(data, SUCCESS_MESSAGES.CREATED);

// For paginated data
return this.sendPaginated(data, SUCCESS_MESSAGES.FETCHED);

// For responses without data
return this.sendResponse(SUCCESS_MESSAGES.DELETED);
```

### 4. Throw Errors with Consistent Messages
```typescript
// Use ERROR_MESSAGES for throwing errors
if (!user) {
  throw new APIError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
}

if (password !== confirmPassword) {
  throw new APIError(ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH, 400);
}
```

---

## 🔧 Adding New Messages

### Add a New Success Message
Edit `src/constants/response-messages.ts`:
```typescript
export const SUCCESS_MESSAGES = {
  // ... existing messages
  
  // Your new category
  SUBSCRIPTION_RENEWED: 'Subscription renewed successfully',
  INVOICE_GENERATED: 'Invoice generated successfully',
} as const;
```

### Add a New Error Message
```typescript
export const ERROR_MESSAGES = {
  // ... existing messages
  
  // Your new error
  SUBSCRIPTION_EXPIRED: 'Subscription has expired',
  INVOICE_NOT_FOUND: 'Invoice not found',
} as const;
```

---

## 🎯 Benefits

1. **DRY Principle**: Don't Repeat Yourself - write less, do more
2. **Consistency**: Same messages across the entire API
3. **Maintainability**: Update one place, changes everywhere
4. **Type Safety**: TypeScript autocomplete for all messages
5. **Clean Code**: Controllers are cleaner and more readable
6. **Easy Refactoring**: Change message text without touching controller code

---

## 📊 Impact

**Before this system:**
- 5-8 repetitive `@Response` decorators per controller
- Hard-coded strings scattered throughout
- Inconsistent error messages

**After this system:**
- 1 decorator per controller
- Centralized, consistent messages
- TypeScript autocomplete support
- 70% less boilerplate code

---

## 🔍 Migration Guide

### Step 1: Import the Decorator and Messages
```typescript
import { CustomerControllerResponses } from '../constants/response-decorators';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/response-messages';
```

### Step 2: Replace Response Decorators
```typescript
// Remove these:
// @Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
// @Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
// @Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
// ... etc

// Add this:
@CustomerControllerResponses()
```

### Step 3: Replace Hard-coded Messages
```typescript
// Replace:
return this.sendSuccess(data, 'Data fetched successfully');

// With:
return this.sendSuccess(data, SUCCESS_MESSAGES.FETCHED);
```

---

## 🤝 Contributing

When adding new features:
1. Add appropriate success/error messages to `response-messages.ts`
2. Use the decorator system for new controllers
3. Follow the established patterns for consistency

---

## 📝 Notes

- All decorators are TypeScript class decorators
- Messages are type-safe with `as const` assertion
- Compatible with TSOA route generation
- Works seamlessly with BaseController helper methods

---

**Happy coding! 🚀**
