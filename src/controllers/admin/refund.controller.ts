// import {
//     Route, Tags, Controller, Post, Body, Middlewares,
//     SuccessResponse, Response, Security, Request
//   } from 'tsoa';
//   import { validateSchemaMiddleware } from '../../middleware/common-validate';
//   import { success, SuccessResponse as SuccessDataResponse } from '../../utils/SuccessResponse';
// //   import { IRefund } from '../../types/refund.types';
// //   import RefundService from '../../services/refund.service';
//   import { initiateRefundSchema } from '../../validations/refund.validator';
// //   import { IRequest } from '../../types/request.types';
// // import refundService from '../../services/refund.service';
  
//   @Route("admin/refunds")
//   @Tags("Admin Refunds")
//   @Security("jwt")
//   export class AdminRefundController extends Controller {
//     // private refundService = new refundService();
  
//     @Post("/initiate")
//     @SuccessResponse(201, "Created")
//     @Response(400, "Validation Failed")
//     @Response(404, "Not Found")
//     @Response(500, "Gateway Error")
//     @Middlewares(validateSchemaMiddleware(initiateRefundSchema))
//     public async initiateRefund(
//     //   @Request() req: IRequest,
//       @Body() body: { orderId: string; amount: number; reason: string; adminNotes?: string }
//     ): Promise<SuccessDataResponse<{}>> {
//     //   const adminId = req.user._id; // Get admin ID from authenticated request
//     //   const result = await this.refundService.initiateRefund(body, adminId);
//     //   this.setStatus(201);
//       return success({}, 'Refund initiated successfully and is now processing.');
//     }
//   }