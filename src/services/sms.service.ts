import { logger } from '../config/logger';

/**
 * Service for sending SMS messages
 * This implementation provides a framework for integrating with various SMS providers
 */
export class SmsService {
  /**
   * Send OTP via SMS to the provided phone number
   * 
   * @param phone - Phone number in E.164 format (e.g., +919876543210)
   * @param otp - The OTP code to send
   * @returns Promise resolving when SMS is sent
   */
  static async sendOtp(phone: string, otp: string): Promise<void> {
    try {
      // Create message with the OTP
      const message = `Your MilqIt verification code is: ${otp}. Valid for 10 minutes.`;
      
      // Log sending attempt (without revealing full OTP in logs)
    //   logger.info(`Sending OTP to ${phone}`, { 
    //     phone,
    //     // Only log first and last digit for security
    //     otpHint: `${otp.charAt(0)}****${otp.charAt(otp.length - 1)}`
    //   });
      
      // Integration with SMS provider
      // UNCOMMENT AND CONFIGURE FOR PRODUCTION USE
      /*
      const smsProvider = await this.getSmsProvider();
      
      const result = await smsProvider.send({
        to: phone,
        body: message,
        from: process.env.SMS_FROM_NUMBER
      });
      
      logger.info(`SMS sent successfully to ${phone}`, { 
        messageId: result.messageId,
        provider: process.env.SMS_PROVIDER
      });
      */
      
      // FOR DEVELOPMENT ONLY - Log the OTP to console
      // Remove this in production!
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV ONLY] OTP for ${phone}: ${otp}`);
      }
      
      logger.info(`Successfully sent OTP to ${phone}`);
    } catch (error: any) {
      // Log error details
    //   logger.error(`SMS sending failed to ${phone}`, { 
    //     phone,
    //     errorMessage: error.message,
    //     provider: process.env.SMS_PROVIDER
    //   });
      
      // Rethrow with a clean message
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  /**
   * Get the appropriate SMS provider based on configuration
   * Factory method to allow multiple provider integrations
   * 
   * @returns The configured SMS provider client
   */
  private static async getSmsProvider() {
    // Switch between different SMS providers based on configuration
    const provider = process.env.SMS_PROVIDER?.toLowerCase() || 'none';
    
    switch (provider) {
      case 'twilio':
        return this.getTwilioProvider();
      
      case 'aws-sns':
        return this.getAwsSnsProvider();
        
      case 'msg91':
        return this.getMsg91Provider();
        
      case 'none':
      default:
        // Mock provider for development/testing
        return this.getMockProvider();
    }
  }

  /**
   * Initialize Twilio SMS provider
   */
  private static getTwilioProvider() {
    try {
      // Dynamically import Twilio to avoid dependency if not used
      // const twilio = require('twilio');
      // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      // Return a standardized interface
      return {
        send: async ({ to, body, from }: { to: string; body: string; from: string }) => {
          // const message = await client.messages.create({
          //   body,
          //   to,
          //   from
          // });
          // return { messageId: message.sid, status: message.status };
          
          // Placeholder for actual implementation
          return { messageId: 'mock-id', status: 'sent' };
        }
      };
    } catch (error: any) {
    //   logger.error('Failed to initialize Twilio provider', { error: error.message });
      throw new Error(`SMS provider initialization failed: ${error.message}`);
    }
  }

  /**
   * Initialize AWS SNS provider
   */
  private static getAwsSnsProvider() {
    try {
      // Dynamically import AWS SDK to avoid dependency if not used
      // const AWS = require('aws-sdk');
      // const sns = new AWS.SNS({
      //   region: process.env.AWS_REGION,
      //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      // });
      
      // Return a standardized interface
      return {
        send: async ({ to, body }: { to: string; body: string; from?: string }) => {
          // const params = {
          //   Message: body,
          //   PhoneNumber: to
          // };
          // const result = await sns.publish(params).promise();
          // return { messageId: result.MessageId, status: 'sent' };
          
          // Placeholder for actual implementation
          return { messageId: 'mock-id', status: 'sent' };
        }
      };
    } catch (error: any) {
    //   logger.error('Failed to initialize AWS SNS provider', { error: error.message });
      throw new Error(`SMS provider initialization failed: ${error.message}`);
    }
  }

  /**
   * Initialize MSG91 provider
   */
  private static getMsg91Provider() {
    try {
      // MSG91 implementation
      return {
        send: async ({ to, body }: { to: string; body: string; from?: string }) => {
          // MSG91 implementation here
          
          // Placeholder for actual implementation
          return { messageId: 'mock-id', status: 'sent' };
        }
      };
    } catch (error: any) {
    //   logger.error('Failed to initialize MSG91 provider', { error: error.message });
      throw new Error(`SMS provider initialization failed: ${error.message}`);
    }
  }

  /**
   * Mock provider for development/testing
   */
  private static getMockProvider() {
    logger.warn('Using mock SMS provider - messages will not be sent');
    return {
      send: async ({ to, body }: { to: string; body: string; from?: string }) => {
        logger.info(`[MOCK SMS] To: ${to}, Message: ${body}`);
        return { messageId: `mock-${Date.now()}`, status: 'sent' };
      }
    };
  }
}

// Export an instance for backwards compatibility
export const smsService = SmsService;