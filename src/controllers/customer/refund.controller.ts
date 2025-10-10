// import {
//     Route, Tags, Controller, Get, SuccessResponse, Security, Request
//   } from 'tsoa';
//   import { success, SuccessResponse as SuccessDataResponse } from '../../utils/SuccessResponse';
//   import { IRefund } from '../../types/refund.types';
//   import RefundService from '../../services/refund.service';
// //   import { IRequest } from '../../types/request.types';
  
//   @Route("refunds")
//   @Tags("Customer Refunds")
//   @Security("jwt")
//   export class CustomerRefundController extends Controller {
//     // private refundService = new RefundService();
  
//     // @Get("/")
//     // @SuccessResponse(200, "Success")
//     // public async getMyRefunds(
//     //   @Request() req: IRequest
//     // ): Promise<SuccessDataResponse<IRefund[]>> {
//     //   const userId = req.user._id;
//     //   const result = await this.refundService.getRefundsForUser(userId);
//     //   return success(result);
//     // }


//     @Get("/")
//     @SuccessResponse(200, "Success")
//     public async getMyRefunds(
    
//     ): Promise<SuccessDataResponse<[]>> {
      
//       return success([]);
//     }
//   }