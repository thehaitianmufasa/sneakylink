/**
 * NeverMissLead - Twilio SMS Webhook
 *
 * Handles incoming SMS messages via Twilio.
 * Sends auto-response and logs all messages.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendAutoResponse, validateRequest } from '@backend/lib/twilio/client';
import { getClientBySlug, logSMS, setClientContext } from '@backend/lib/supabase/client';
import { getClientConfig } from '@shared/config/config-loader';

const SMS_LOG_STATUSES = [
  'queued',
  'sending',
  'sent',
  'delivered',
  'undelivered',
  'failed',
  'received',
] as const;

type SmsLogStatus = (typeof SMS_LOG_STATUSES)[number];

function isSmsLogStatus(value: string): value is SmsLogStatus {
  return SMS_LOG_STATUSES.includes(value as SmsLogStatus);
}

function normalizeSmsStatus(status?: string | null): SmsLogStatus {
  if (!status) {
    return 'received';
  }

  const lowerStatus = status.toLowerCase();
  return isSmsLogStatus(lowerStatus) ? lowerStatus : 'received';
}

// ============================================================================
// POST /api/twilio/sms
// ============================================================================
// Twilio calls this webhook when an SMS is received

export async function POST(request: NextRequest) {
  try {
    // Get Twilio request parameters
    const formData = await request.formData();
    const params: Record<string, string> = {};

    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Extract SMS details
    const messageSid = params.MessageSid;
    const accountSid = params.AccountSid;
    const from = params.From;
    const to = params.To;
    const body = params.Body;
    const messageStatus = params.SmsStatus;

    if (!messageSid || !accountSid || !from || !to) {
      console.error('[Twilio/SMS] Missing required Twilio parameters', {
        messageSid,
        accountSid,
        from,
        to,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Missing required Twilio parameters',
        },
        { status: 400 }
      );
    }

    console.log(`[Twilio/SMS] Incoming message: ${messageSid} from ${from} to ${to}`);
    console.log(`[Twilio/SMS] Message body: ${body}`);

    // Validate Twilio signature (security)
    const twilioSignature = request.headers.get('x-twilio-signature');
    const url = request.url;

    if (twilioSignature && process.env.TWILIO_AUTH_TOKEN) {
      const isValid = validateRequest(
        process.env.TWILIO_AUTH_TOKEN,
        twilioSignature,
        url,
        params
      );

      if (!isValid) {
        console.error('[Twilio/SMS] Invalid Twilio signature');
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // Determine which client this SMS is for
    // In production, you'd look up by the 'To' number in the database
    let clientId: string | null = null;
    let clientSlug: string | null = null;
    let autoResponseEnabled = false;
    let autoResponseMessage = '';

    // For now, use nevermisslead demo client
    const client = await getClientBySlug('nevermisslead');

    if (client) {
      clientId = client.id;
      clientSlug = client.slug;

      if (clientSlug) {
        // Load client config to get SMS auto-response settings
        try {
          const config = await getClientConfig(clientSlug);
          autoResponseEnabled = config.sms.enabled;
          autoResponseMessage = config.sms.autoResponse;
        } catch (error) {
          console.error('[Twilio/SMS] Error loading client config:', error);
        }
      }
    }

    // Log the incoming SMS to database
    if (clientId) {
      await setClientContext(clientId);

      const normalizedStatus = normalizeSmsStatus(messageStatus);

      await logSMS({
        client_id: clientId,
        twilio_message_sid: messageSid,
        twilio_account_sid: accountSid,
        from_number: from,
        to_number: to,
        body: body,
        status: normalizedStatus,
        direction: 'inbound',
        is_auto_response: false,
        triggered_by_message_sid: null,
        sent_at: new Date().toISOString(),
      });

      console.log(`[Twilio/SMS] Incoming SMS logged for client: ${clientId}`);
    }

    // Send auto-response if enabled
    let autoResponseSid: string | null = null;

    if (autoResponseEnabled && autoResponseMessage && clientId) {
      try {
        autoResponseSid = await sendAutoResponse(from, autoResponseMessage, to);

        if (autoResponseSid) {
          // Log the auto-response SMS
          await logSMS({
            client_id: clientId,
            twilio_message_sid: autoResponseSid,
            twilio_account_sid: accountSid,
            from_number: to,
            to_number: from,
            body: autoResponseMessage,
            status: 'sent',
            direction: 'outbound',
            is_auto_response: true,
            triggered_by_message_sid: messageSid,
            sent_at: new Date().toISOString(),
          });

          console.log(`[Twilio/SMS] Auto-response sent: ${autoResponseSid}`);
        }
      } catch (error) {
        console.error('[Twilio/SMS] Error sending auto-response:', error);
        // Don't fail the request if auto-response fails
      }
    }

    // Return success response (Twilio expects 200 OK)
    return NextResponse.json(
      {
        success: true,
        message: 'SMS received',
        messageSid: messageSid,
        autoResponseSent: !!autoResponseSid,
        autoResponseSid: autoResponseSid,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Twilio/SMS] Error handling SMS:', error);

    // Return 200 OK even on error (Twilio requirement)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process SMS',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}

// ============================================================================
// GET /api/twilio/sms (for testing)
// ============================================================================

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Twilio SMS Webhook',
      endpoint: '/api/twilio/sms',
      method: 'POST',
      description: 'Handles incoming SMS messages and sends auto-responses',
    },
    { status: 200 }
  );
}
