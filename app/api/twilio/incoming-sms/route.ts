/**
 * Twilio Incoming SMS Webhook Handler - A2P 10DLC Compliance
 *
 * Handles incoming SMS messages from Twilio, including:
 * - STOP: Opt-out from SMS notifications
 * - START/CONFIRM: Re-opt-in to SMS notifications
 * - HELP: Send support information
 * - Default: Generic auto-reply
 *
 * All responses match NEVERMISSLEAD_SMS_OPTIN_COPY.md exactly for compliance.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Twilio webhook payload schema
const TwilioWebhookSchema = z.object({
  MessageSid: z.string(),
  AccountSid: z.string(),
  From: z.string(), // Sender's phone number
  To: z.string(), // Twilio number
  Body: z.string(), // Message text
  NumMedia: z.string().optional(),
});

// ============================================================================
// POST /api/twilio/incoming-sms
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse form data from Twilio webhook
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData.entries());

    // Validate webhook data
    const validationResult = TwilioWebhookSchema.safeParse(rawData);

    if (!validationResult.success) {
      console.error('[Twilio/SMS] Invalid webhook payload:', validationResult.error);
      // Return 200 to Twilio to prevent retries
      return new NextResponse(
        generateTwiMLResponse('We received your message but couldn\'t process it. Please contact support@cherysolutions.com'),
        {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }

    const { MessageSid, From, To, Body } = validationResult.data;
    const messageBody = Body.trim().toUpperCase();

    console.log(`[Twilio/SMS] Received SMS from ${From} to ${To}: "${Body}"`);

    // Get Supabase client
    const { supabase, setClientContext } = await import('@backend/lib/supabase/client');

    // Find lead by phone number
    // Note: sms_opted_in field will be available after running the migration
    const { data: leads, error: leadError } = await (supabase as any)
      .from('leads')
      .select('id, client_id, full_name, sms_opted_in')
      .eq('phone', From)
      .order('created_at', { ascending: false })
      .limit(1);

    if (leadError) {
      console.error('[Twilio/SMS] Error finding lead:', leadError);
      return new NextResponse(
        generateTwiMLResponse('We encountered an error. Please contact support@cherysolutions.com'),
        {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }

    const lead = leads && leads.length > 0 ? leads[0] : null;
    let responseMessage = '';

    // Handle different keywords
    if (messageBody === 'STOP' || messageBody === 'UNSUBSCRIBE' || messageBody === 'CANCEL' || messageBody === 'END' || messageBody === 'QUIT') {
      // OPT-OUT - User wants to unsubscribe
      responseMessage = '✓ nevermisslead.com: You\'ve been unsubscribed from all SMS messages. You won\'t receive leads or alerts. To resubscribe, text START or visit nevermisslead.com. We hope to see you back!';

      if (lead) {
        // Update lead record (temporarily using 'as any' until types are regenerated)
        await (supabase as any)
          .from('leads')
          .update({
            sms_opted_in: false,
            sms_opt_in_timestamp: null,
          })
          .eq('id', lead.id);

        // Log to audit table (temporarily using 'as any' until types are regenerated)
        await (supabase as any).from('sms_consent_audit').insert({
          lead_id: lead.id,
          client_id: lead.client_id,
          action: 'opted_out',
          metadata: {
            keyword: messageBody,
            twilio_message_sid: MessageSid,
          },
        });

        console.log(`[Twilio/SMS] Lead ${lead.id} opted out via SMS`);
      } else {
        console.log(`[Twilio/SMS] STOP received from unknown number: ${From}`);
      }
    } else if (messageBody === 'START' || messageBody === 'CONFIRM' || messageBody === 'YES' || messageBody === 'UNSTOP' || messageBody === 'SUBSCRIBE') {
      // OPT-IN / RE-OPT-IN - User wants to resume notifications
      responseMessage = '✓ nevermisslead.com: Your SMS notifications are active! You\'ll receive lead alerts here. Text STOP to opt-out or HELP for support. Welcome aboard!';

      if (lead) {
        // Update lead record (temporarily using 'as any' until types are regenerated)
        await (supabase as any)
          .from('leads')
          .update({
            sms_opted_in: true,
            sms_opt_in_timestamp: new Date().toISOString(),
            sms_opt_in_method: 'sms',
          })
          .eq('id', lead.id);

        // Log to audit table (temporarily using 'as any' until types are regenerated)
        await (supabase as any).from('sms_consent_audit').insert({
          lead_id: lead.id,
          client_id: lead.client_id,
          action: 'confirmed',
          metadata: {
            keyword: messageBody,
            twilio_message_sid: MessageSid,
          },
        });

        console.log(`[Twilio/SMS] Lead ${lead.id} confirmed opt-in via SMS`);
      } else {
        console.log(`[Twilio/SMS] START received from unknown number: ${From}`);
      }
    } else if (messageBody === 'HELP' || messageBody === 'INFO' || messageBody === 'SUPPORT') {
      // HELP - User wants support information
      responseMessage = 'nevermisslead.com SMS Support: • Text STOP = Unsubscribe from all messages • Text START = Resubscribe to notifications • Email: support@cherysolutions.com • Phone: (678) 788-7281';

      if (lead) {
        // Log to audit table (temporarily using 'as any' until types are regenerated)
        await (supabase as any).from('sms_consent_audit').insert({
          lead_id: lead.id,
          client_id: lead.client_id,
          action: 'help_requested',
          metadata: {
            keyword: messageBody,
            twilio_message_sid: MessageSid,
          },
        });

        console.log(`[Twilio/SMS] Lead ${lead.id} requested help via SMS`);
      }
    } else {
      // DEFAULT - Unknown keyword
      responseMessage = 'nevermisslead.com: Reply STOP to opt-out, HELP for support.';

      console.log(`[Twilio/SMS] Unknown keyword from ${From}: "${Body}"`);
    }

    // Return TwiML response
    return new NextResponse(generateTwiMLResponse(responseMessage), {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('[Twilio/SMS] Error processing incoming SMS:', error);

    // Return 200 to Twilio to prevent retries
    return new NextResponse(
      generateTwiMLResponse('We encountered an error. Please contact support@cherysolutions.com'),
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate TwiML XML response for Twilio
 */
function generateTwiMLResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(message)}</Message>
</Response>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============================================================================
// OPTIONS /api/twilio/incoming-sms (CORS preflight)
// ============================================================================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
