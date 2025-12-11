/**
 * NeverMissLead - Twilio Voice Webhook
 *
 * Handles incoming phone calls via Twilio.
 * Forwards calls to client's business phone and logs all activity.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@backend/lib/twilio/client';
import { getClientBySlug, logCall, setClientContext, supabase } from '@backend/lib/supabase/client';

const CALL_LOG_STATUSES = [
  'ringing',
  'in-progress',
  'completed',
  'busy',
  'no-answer',
  'failed',
  'canceled',
] as const;

type CallLogStatus = (typeof CALL_LOG_STATUSES)[number];

function isCallLogStatus(value: string): value is CallLogStatus {
  return CALL_LOG_STATUSES.includes(value as CallLogStatus);
}

function normalizeCallStatus(status?: string | null): CallLogStatus {
  if (!status) {
    return 'ringing';
  }

  const normalized = status.toLowerCase();
  return isCallLogStatus(normalized) ? normalized : 'ringing';
}

function normalizeCallDirection(direction?: string | null): 'inbound' | 'outbound' {
  if (!direction) {
    return 'inbound';
  }

  const lowerDirection = direction.toLowerCase();
  return lowerDirection.startsWith('in') ? 'inbound' : 'outbound';
}

// ============================================================================
// POST /api/twilio/voice
// ============================================================================
// Twilio calls this webhook when a call comes in to a tracking number

export async function POST(request: NextRequest) {
  try {
    // Get Twilio request parameters
    const formData = await request.formData();
    const params: Record<string, string> = {};

    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Extract call details
    const callSid = params.CallSid;
    const accountSid = params.AccountSid || 'unknown';
    const from = params.From;
    const to = params.To;
    const callStatus = params.CallStatus;
    const direction = params.Direction;
    const callerCity = params.CallerCity || null;
    const callerState = params.CallerState || null;
    const callerZip = params.CallerZip || null;
    const callerCountry = params.CallerCountry || null;

    console.log('[Twilio/Voice] Received parameters:', {
      callSid,
      accountSid,
      from,
      to,
      callStatus,
      direction,
    });

    if (!callSid || !from || !to) {
      console.error('[Twilio/Voice] Missing required Twilio parameters', {
        callSid,
        accountSid,
        from,
        to,
      });

      return new NextResponse('Bad Request', { status: 400 });
    }

    console.log(`[Twilio/Voice] Incoming call: ${callSid} from ${from} to ${to}`);

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
        console.error('[Twilio/Voice] Invalid Twilio signature');
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // Determine which client this call is for
    let clientId: string | null = null;

    // For now, use nevermisslead demo client
    const client = await getClientBySlug('nevermisslead');

    if (client) {
      clientId = client.id;
    }

    // Log the call to database
    if (clientId) {
      await setClientContext(clientId);

      const normalizedStatus = normalizeCallStatus(callStatus);
      const normalizedDirection = normalizeCallDirection(direction);

      // Check if call already exists
      const { data: existingCall } = await supabase
        .from('call_logs')
        .select('id')
        .eq('twilio_call_sid', callSid)
        .maybeSingle();

      if (existingCall) {
        // Call already logged, just update status
        await supabase
          .from('call_logs')
          .update({
            status: normalizedStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('twilio_call_sid', callSid);

        console.log(`[Twilio/Voice] Call status updated: ${callSid} - ${normalizedStatus}`);
      } else {
        // New call, insert it
        await logCall({
          client_id: clientId,
          twilio_call_sid: callSid,
          twilio_account_sid: accountSid,
          from_number: from,
          to_number: to,
          forwarded_to: null, // No forwarding, using voicemail
          status: normalizedStatus,
          direction: normalizedDirection,
          caller_city: callerCity,
          caller_state: callerState,
          caller_zip: callerZip,
          caller_country: callerCountry,
          started_at: new Date().toISOString(),
        });

        console.log(`[Twilio/Voice] Call logged for client: ${clientId}`);
      }
    }

    // Check if auto-connect is enabled (OWNER_PHONE_NUMBER configured)
    const ownerPhoneNumber = process.env.OWNER_PHONE_NUMBER;
    const enableAutoConnect = !!ownerPhoneNumber;

    // Use www subdomain to match voice webhook and avoid redirects
    const statusCallbackUrl = 'https://www.nevermisslead.com/api/twilio/status';
    const dialStatusUrl = 'https://www.nevermisslead.com/api/twilio/dial-status';

    let twiml = '';

    // If auto-connect enabled, try to dial owner first
    if (enableAutoConnect) {
      console.log(`[Twilio/Voice] Auto-connect enabled. Dialing owner: ${ownerPhoneNumber}`);

      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="20" action="${dialStatusUrl}">
    <Number>${ownerPhoneNumber}</Number>
  </Dial>
</Response>`;
    } else {
      // No auto-connect configured, go straight to voicemail
      console.log('[Twilio/Voice] Auto-connect not configured. Going to voicemail.');

      const voicemailScript = `
        Hey, thanks for calling — you've reached our team. Leave your name, number, and a brief message, and we'll return your call at our earliest convenience. Thank you.
      `;

      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${voicemailScript.trim()}</Say>
  <Record
    maxLength="60"
    transcribe="true"
    transcribeCallback="${statusCallbackUrl}"
    recordingStatusCallback="${statusCallbackUrl}"
  />
  <Say voice="Polly.Joanna">Thank you. We'll be in touch soon.</Say>
</Response>`;
    }

    // Return TwiML response
    return new NextResponse(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('[Twilio/Voice] Error handling call:', error);

    // Return error TwiML
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>We're sorry, but we're unable to connect your call at this time. Please try again later.</Say>
  <Hangup/>
</Response>`;

    return new NextResponse(errorTwiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

// ============================================================================
// GET /api/twilio/voice (for testing)
// ============================================================================

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Twilio Voice Webhook',
      endpoint: '/api/twilio/voice',
      method: 'POST',
      description: 'Handles incoming phone calls and forwards to business number',
    },
    { status: 200 }
  );
}
