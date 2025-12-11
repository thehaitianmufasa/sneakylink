/**
 * NeverMissLead - Twilio Dial Status Callback
 *
 * Handles the outcome of auto-connect call attempts.
 * Determines if owner answered, and sends auto-SMS if they didn't.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, sendSMS } from '@backend/lib/twilio/client';
import { supabase, supabaseAdmin, setClientContext, getClientBySlug } from '@backend/lib/supabase/client';

const DIAL_STATUSES = ['completed', 'no-answer', 'busy', 'failed', 'canceled'] as const;
type DialStatus = (typeof DIAL_STATUSES)[number];

function isDialStatus(value: string): value is DialStatus {
  return DIAL_STATUSES.includes(value as DialStatus);
}

function normalizeDialStatus(status?: string | null): DialStatus {
  if (!status) {
    return 'no-answer';
  }

  const normalized = status.toLowerCase();
  return isDialStatus(normalized) ? normalized : 'no-answer';
}

// ============================================================================
// POST /api/twilio/dial-status
// ============================================================================
// Twilio calls this webhook after the <Dial> attempt completes

export async function POST(request: NextRequest) {
  try {
    // Get Twilio request parameters
    const formData = await request.formData();
    const params: Record<string, string> = {};

    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Extract dial outcome details
    const callSid = params.CallSid;
    const dialCallStatus = params.DialCallStatus;
    const dialCallDuration = params.DialCallDuration ? Number.parseInt(params.DialCallDuration, 10) : 0;
    const from = params.From; // Lead's phone number
    const to = params.To; // Business Twilio number

    console.log('[Twilio/DialStatus] Dial attempt completed:', {
      callSid,
      dialCallStatus,
      dialCallDuration,
      from,
      to,
    });

    if (!callSid) {
      console.error('[Twilio/DialStatus] Missing CallSid');
      return new NextResponse('Bad Request', { status: 400 });
    }

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
        console.error('[Twilio/DialStatus] Invalid Twilio signature');
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    if (!supabaseAdmin) {
      console.error('[Twilio/DialStatus] Supabase admin client not available');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    // Look up the call log record
    const { data: callLog, error: fetchError } = await supabaseAdmin
      .from('call_logs')
      .select('id, client_id, from_number, auto_sms_sent')
      .eq('twilio_call_sid', callSid)
      .maybeSingle();

    if (fetchError || !callLog) {
      console.error('[Twilio/DialStatus] Call log not found:', callSid);
      // Don't fail the request, just log error and continue to voicemail
    }

    // Normalize dial status
    const normalizedDialStatus = normalizeDialStatus(dialCallStatus);

    // Consider it "answered" only if completed AND duration is reasonable
    // If duration < 5 seconds, it probably went to voicemail or auto-reject
    const ownerAnswered = normalizedDialStatus === 'completed' && dialCallDuration >= 5;

    // Update call log with dial outcome
    if (callLog) {
      await setClientContext(callLog.client_id);

      await supabase
        .from('call_logs')
        .update({
          dial_status: normalizedDialStatus,
          connected_to_owner: ownerAnswered,
          owner_answered_at: ownerAnswered ? new Date().toISOString() : null,
          forwarded_to: process.env.OWNER_PHONE_NUMBER || null,
          updated_at: new Date().toISOString(),
        })
        .eq('twilio_call_sid', callSid);

      console.log(`[Twilio/DialStatus] Call log updated: ${callSid} - ${normalizedDialStatus}`);
    }

    // ============================================================================
    // AUTO-SMS TO LEAD (if owner didn't answer)
    // ============================================================================
    // Check if SMS was already sent for this call (prevent duplicates)
    const alreadySentSMS = callLog?.auto_sms_sent || false;

    if (!ownerAnswered && from && !alreadySentSMS) {
      console.log(`[Twilio/DialStatus] Owner didn't answer. Sending auto-SMS to: ${from}`);

      try {
        // Get client config for business name
        const client = await getClientBySlug('nevermisslead');

        // Check for SMS-specific business name override in env, then database, then fallback
        const businessName = process.env.SMS_BUSINESS_NAME || client?.business_name || 'our team';

        // Get custom SMS template from env or use default
        const smsTemplate = process.env.AUTO_SMS_TEMPLATE ||
          "Thanks for calling {business_name}. Sorry I couldn't pick up right now. I'll call you back today. Thanks again!";

        const smsBody = smsTemplate.replace('{business_name}', businessName);

        // Send SMS to lead
        await sendSMS(from, smsBody, to);

        // Update call log to mark SMS sent
        if (callLog) {
          await supabase
            .from('call_logs')
            .update({
              auto_sms_sent: true,
              updated_at: new Date().toISOString(),
            })
            .eq('twilio_call_sid', callSid);
        }

        console.log(`[Twilio/DialStatus] Auto-SMS sent successfully to: ${from}`);
      } catch (smsError) {
        console.error('[Twilio/DialStatus] Failed to send auto-SMS:', smsError);
        // Don't block the call flow if SMS fails
      }
    } else if (alreadySentSMS) {
      console.log(`[Twilio/DialStatus] Auto-SMS already sent for call: ${callSid}, skipping duplicate`);
    }

    // ============================================================================
    // RETURN TWIML
    // ============================================================================
    // If owner answered, just end the call (they're connected)
    if (ownerAnswered) {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Hangup/>
</Response>`;

      return new NextResponse(twiml, {
        status: 200,
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    }

    // If owner didn't answer, go to voicemail
    const statusCallbackUrl = 'https://www.nevermisslead.com/api/twilio/status';

    const voicemailScript = `
      Hey, thanks for calling — you've reached our team. Leave your name, number, and a brief message, and we'll return your call at our earliest convenience. Thank you.
    `;

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
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

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('[Twilio/DialStatus] Error handling dial status:', error);

    // Return fallback voicemail TwiML (don't fail the call)
    const statusCallbackUrl = 'https://www.nevermisslead.com/api/twilio/status';

    const voicemailScript = `
      Hey, thanks for calling — you've reached our team. Leave your name, number, and a brief message, and we'll return your call at our earliest convenience. Thank you.
    `;

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
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

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

// ============================================================================
// GET /api/twilio/dial-status (for testing)
// ============================================================================

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Twilio Dial Status Callback',
      endpoint: '/api/twilio/dial-status',
      method: 'POST',
      description: 'Handles outcome of auto-connect dial attempts',
    },
    { status: 200 }
  );
}
