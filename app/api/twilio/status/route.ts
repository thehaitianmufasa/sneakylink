/**
 * NeverMissLead - Twilio Status Callback
 *
 * Handles call status updates from Twilio.
 * Updates call logs with duration, recordings, and final status.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, sendVoicemailNotification } from '@backend/lib/twilio/client';
import { supabase, supabaseAdmin, setClientContext } from '@backend/lib/supabase/client';
import { sendVoicemailEmail } from '@backend/lib/email/smtp-client';
import type { Database } from '@backend/lib/supabase/types';

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
type CallLogUpdate = Database['public']['Tables']['call_logs']['Update'];
type CallLogRecord = Pick<
  Database['public']['Tables']['call_logs']['Row'],
  'id' | 'client_id' | 'answered_at' | 'recording_url'
>;

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

// ============================================================================
// POST /api/twilio/status
// ============================================================================
// Twilio calls this webhook to update call status

export async function POST(request: NextRequest) {
  try {
    // Get Twilio request parameters
    const formData = await request.formData();
    const params: Record<string, string> = {};

    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Extract status update details
    const callSid = params.CallSid;
    const callStatus = params.CallStatus;
    const callDuration = params.CallDuration ? Number.parseInt(params.CallDuration, 10) : 0;
    const recordingUrl = params.RecordingUrl || null;
    const recordingDuration = params.RecordingDuration
      ? Number.parseInt(params.RecordingDuration, 10)
      : null;

    // Extract transcription details (if this is a transcription callback)
    const transcriptionText = params.TranscriptionText || null;
    const transcriptionStatus = params.TranscriptionStatus || null;
    const recordingSid = params.RecordingSid || null;

    if (!callSid) {
      console.error('[Twilio/Status] Missing CallSid');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing CallSid',
        },
        { status: 400 }
      );
    }

    const normalizedStatus = normalizeCallStatus(callStatus);

    console.log(`[Twilio/Status] Call status update: ${callSid} - ${callStatus}`);

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
        console.error('[Twilio/Status] Invalid Twilio signature');
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    if (!supabaseAdmin) {
      console.error('[Twilio/Status] Supabase admin client not available');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
        },
        { status: 500 }
      );
    }

    // Look up the call log record
    const { data, error: fetchError } = await supabaseAdmin
      .from('call_logs')
      .select('id, client_id, answered_at, recording_url')
      .eq('twilio_call_sid', callSid)
      .maybeSingle();

    const callLog = (data as CallLogRecord | null) ?? null;

    if (fetchError || !callLog) {
      console.error('[Twilio/Status] Call log not found:', callSid);
      return NextResponse.json(
        {
          success: false,
          error: 'Call log not found',
        },
        { status: 404 }
      );
    }

    // Set RLS context
    await setClientContext(callLog.client_id);

    // Prepare update data
    const updateData: CallLogUpdate = {
      status: normalizedStatus,
      updated_at: new Date().toISOString(),
    };

    // Add duration if call is completed
    if (callDuration > 0) {
      updateData.duration = callDuration;
    }

    // Add recording info if available
    if (recordingUrl) {
      updateData.recording_url = recordingUrl;
    }

    if (recordingDuration) {
      updateData.recording_duration = recordingDuration;
    }

    // Set timestamps based on status
    if (normalizedStatus === 'in-progress' && !callLog.answered_at) {
      updateData.answered_at = new Date().toISOString();
    }

    if (
      normalizedStatus === 'completed' ||
      normalizedStatus === 'failed' ||
      normalizedStatus === 'canceled'
    ) {
      updateData.ended_at = new Date().toISOString();
    }

    // Update the call log
    const { error: updateError } = await supabase
      .from('call_logs')
      .update(updateData)
      .eq('twilio_call_sid', callSid);

    if (updateError) {
      console.error('[Twilio/Status] Error updating call log:', updateError);
      throw updateError;
    }

    console.log(`[Twilio/Status] Call log updated: ${callSid} - ${normalizedStatus}`);

    // ============================================================================
    // VOICEMAIL NOTIFICATION
    // ============================================================================
    // Only send notifications if this is a NEW recording (not already processed)
    // Check if recording_url was already saved to prevent duplicate notifications
    const isNewRecording = recordingUrl && !callLog.recording_url;

    if (isNewRecording) {
      console.log(`[Twilio/Status] New voicemail recording received for call: ${callSid}`);

      // Fetch client details for notifications
      const { data: clientData, error: clientError } = await supabaseAdmin
        .from('clients')
        .select('id, business_name, notification_phone, notification_email')
        .eq('id', callLog.client_id)
        .single();

      if (!clientError && clientData) {
        const { id: clientId, business_name, notification_phone, notification_email } = clientData;

        // Get caller number from call log
        const { data: callLogData } = await supabaseAdmin
          .from('call_logs')
          .select('from_number')
          .eq('twilio_call_sid', callSid)
          .single();

        const callerNumber = callLogData?.from_number || 'Unknown';

        // Use transcription if available, otherwise provide fallback message
        const transcriptionMessage = transcriptionText && transcriptionStatus === 'completed'
          ? transcriptionText
          : 'Transcription unavailable - please listen to recording';

        try {
          // Send SMS notification
          await sendVoicemailNotification({
            clientId,
            callerNumber,
            transcription: transcriptionMessage,
            recordingUrl: recordingUrl || undefined,
            callSid,
          });

          console.log(`[Twilio/Status] SMS notification sent for voicemail: ${callSid}`);
        } catch (smsError) {
          console.error('[Twilio/Status] Failed to send SMS notification:', smsError);
          // Continue to email notification even if SMS fails
        }

        try {
          // Send email notification
          await sendVoicemailEmail({
            voicemailData: {
              caller_number: callerNumber,
              transcription_text: transcriptionMessage,
              recording_url: recordingUrl || undefined,
              timestamp: new Date().toISOString(),
            },
            clientName: business_name,
            notificationEmail: notification_email || undefined,
          });

          console.log(`[Twilio/Status] Email notification sent for voicemail: ${callSid}`);
        } catch (emailError) {
          console.error('[Twilio/Status] Failed to send email notification:', emailError);
        }
      } else {
        console.error('[Twilio/Status] Failed to fetch client data for notifications');
      }
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Call status updated',
        callSid: callSid,
        status: normalizedStatus,
        duration: callDuration,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Twilio/Status] Error handling status callback:', error);

    // Return 200 OK even on error (Twilio requirement)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process status callback',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}

// ============================================================================
// GET /api/twilio/status (for testing)
// ============================================================================

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Twilio Status Callback',
      endpoint: '/api/twilio/status',
      method: 'POST',
      description: 'Handles call status updates from Twilio',
    },
    { status: 200 }
  );
}
