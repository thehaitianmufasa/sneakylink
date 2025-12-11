/**
 * NeverMissLead - Admin Click-to-Call API
 *
 * Allows admins to initiate calls to leads from the CRM dashboard.
 * Uses Twilio to connect admin phone to lead phone.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySession, getSessionFromCookie } from '@backend/lib/admin/auth';
import { supabase, setClientContext } from '@backend/lib/supabase/client';
import { twilioClient } from '@backend/lib/twilio/client';

// ============================================================================
// POST /api/admin/call - Initiate Click-to-Call
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieHeader = request.headers.get('cookie');
    const sessionToken = getSessionFromCookie(cookieHeader);

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const clientId = await verifySession(sessionToken);
    if (!clientId) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Set client context for RLS
    await setClientContext(clientId);

    // Get request body
    const body = await request.json();
    const { leadId, leadPhone } = body;

    if (!leadId || !leadPhone) {
      return NextResponse.json(
        { error: 'Lead ID and phone number are required' },
        { status: 400 }
      );
    }

    // Get owner phone number from environment
    const ownerPhone = process.env.OWNER_PHONE_NUMBER;
    if (!ownerPhone) {
      console.error('[Admin/Call] OWNER_PHONE_NUMBER not configured');
      return NextResponse.json(
        { error: 'Owner phone number not configured' },
        { status: 500 }
      );
    }

    // Get business Twilio number
    const businessPhone = process.env.TWILIO_PHONE_NUMBER;
    if (!businessPhone) {
      console.error('[Admin/Call] TWILIO_PHONE_NUMBER not configured');
      return NextResponse.json(
        { error: 'Twilio phone number not configured' },
        { status: 500 }
      );
    }

    // Check Twilio client
    if (!twilioClient) {
      console.error('[Admin/Call] Twilio client not configured');
      return NextResponse.json(
        { error: 'Twilio not configured' },
        { status: 500 }
      );
    }

    // Create TwiML to connect admin to lead
    // 1. Call admin's phone
    // 2. When admin answers, dial lead's phone
    // 3. Connect the two calls
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Connecting you to the lead now.</Say>
  <Dial timeout="30" callerId="${businessPhone}">
    <Number>${leadPhone}</Number>
  </Dial>
  <Say voice="Polly.Joanna">The lead did not answer. Please try again later.</Say>
</Response>`;

    // Initiate call to admin
    const call = await twilioClient.calls.create({
      from: businessPhone,
      to: ownerPhone,
      twiml: twiml,
    });

    console.log(`[Admin/Call] Click-to-call initiated: ${call.sid} (Lead: ${leadId})`);

    // Create call log record
    const { error: logError } = await supabase
      .from('call_logs')
      .insert({
        client_id: clientId,
        lead_id: leadId,
        twilio_call_sid: call.sid,
        twilio_account_sid: call.accountSid,
        from_number: businessPhone,
        to_number: ownerPhone,
        forwarded_to: leadPhone,
        status: 'ringing',
        direction: 'outbound',
        duration: 0,
        connected_to_owner: false,
        auto_sms_sent: false,
        notes: 'Click-to-call initiated from CRM dashboard',
      });

    if (logError) {
      console.error('[Admin/Call] Error creating call log:', logError);
    }

    // Update lead's last_contacted_at timestamp
    await supabase
      .from('leads')
      .update({
        last_contacted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .eq('client_id', clientId);

    return NextResponse.json({
      success: true,
      callSid: call.sid,
      message: 'Call initiated successfully',
    });
  } catch (error) {
    console.error('[Admin/Call] Error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
}
