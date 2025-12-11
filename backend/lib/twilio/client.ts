/**
 * NeverMissLead - Twilio Client
 *
 * Twilio SDK wrapper for call forwarding and SMS automation.
 * Handles voice calls and SMS messages for all clients.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import twilio from 'twilio';

// ============================================================================
// CONFIGURATION
// ============================================================================

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken) {
  console.warn('[Twilio] Missing credentials. Twilio features will be disabled.');
}

// ============================================================================
// CLIENT INSTANCE
// ============================================================================

/**
 * Twilio client instance
 * Only created if credentials are available
 */
export const twilioClient = accountSid && authToken
  ? twilio(accountSid, authToken)
  : null;

// ============================================================================
// TWIML HELPERS
// ============================================================================

/**
 * Generate TwiML for call forwarding
 *
 * @param forwardToNumber - Phone number to forward the call to
 * @param options - Additional TwiML options
 * @returns TwiML response as string
 *
 * @example
 * ```ts
 * const twiml = generateForwardingTwiML('+14045551234', {
 *   statusCallback: 'https://example.com/api/twilio/status',
 *   record: true,
 * });
 * ```
 */
export function generateForwardingTwiML(
  forwardToNumber: string,
  options: {
    statusCallback?: string;
    record?: boolean;
    timeout?: number;
  } = {}
): string {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  // Add custom message before forwarding (optional)
  // twiml.say('Please hold while we connect your call.');

  // Dial the forwarding number
  const dial = twiml.dial({
    timeout: options.timeout || 30,
    callerId: twilioPhoneNumber,
    action: options.statusCallback,
    record: options.record ? 'record-from-answer' : undefined,
  });

  dial.number(forwardToNumber);

  // If no answer, go to voicemail
  twiml.say(
    'We are unable to connect your call at this time. Please leave a message after the beep.'
  );
  twiml.record({
    maxLength: 120,
    transcribe: true,
    transcribeCallback: options.statusCallback,
  });

  return twiml.toString();
}

/**
 * Generate TwiML for voicemail
 *
 * @param message - Custom voicemail greeting
 * @param options - Additional TwiML options
 * @returns TwiML response as string
 *
 * @example
 * ```ts
 * const twiml = generateVoicemailTwiML(
 *   'Thank you for calling. Please leave a message.',
 *   { maxLength: 60 }
 * );
 * ```
 */
export function generateVoicemailTwiML(
  message: string,
  options: {
    maxLength?: number;
    transcribe?: boolean;
    transcribeCallback?: string;
  } = {}
): string {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  twiml.say(message);
  twiml.record({
    maxLength: options.maxLength || 120,
    transcribe: options.transcribe !== false,
    transcribeCallback: options.transcribeCallback,
  });

  return twiml.toString();
}

// ============================================================================
// SMS FUNCTIONS
// ============================================================================

/**
 * Send an SMS message
 *
 * @param to - Recipient phone number
 * @param body - Message body
 * @param from - Sender phone number (defaults to env variable)
 * @returns Promise that resolves with Twilio message SID
 *
 * @example
 * ```ts
 * const messageSid = await sendSMS(
 *   '+14045551234',
 *   'Thanks for contacting us! We will call you back within 15 minutes.'
 * );
 * ```
 */
export async function sendSMS(
  to: string,
  body: string,
  from?: string
): Promise<string> {
  if (!twilioClient) {
    throw new Error('Twilio client not initialized. Check credentials.');
  }

  const fromNumber = from || twilioPhoneNumber;

  if (!fromNumber) {
    throw new Error('No Twilio phone number configured');
  }

  try {
    const message = await twilioClient.messages.create({
      to,
      from: fromNumber,
      body,
    });

    console.log(`[Twilio] SMS sent: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('[Twilio] Error sending SMS:', error);
    throw new Error(`Failed to send SMS: ${(error as Error).message}`);
  }
}

/**
 * Send auto-response SMS
 * Uses client-specific configuration for personalized responses.
 *
 * @param to - Recipient phone number
 * @param clientConfig - Client configuration with SMS settings
 * @param from - Twilio number to send from
 * @returns Promise that resolves with Twilio message SID
 *
 * @example
 * ```ts
 * const messageSid = await sendAutoResponse(
 *   '+14045551234',
 *   clientConfig,
 *   '+14045554822'
 * );
 * ```
 */
export async function sendAutoResponse(
  to: string,
  autoResponseMessage: string,
  from: string
): Promise<string> {
  return sendSMS(to, autoResponseMessage, from);
}

// ============================================================================
// CALL FUNCTIONS
// ============================================================================

/**
 * Initiate an outbound call
 *
 * @param to - Recipient phone number
 * @param twimlUrl - URL that returns TwiML instructions
 * @param from - Caller phone number (defaults to env variable)
 * @returns Promise that resolves with Twilio call SID
 *
 * @example
 * ```ts
 * const callSid = await makeCall(
 *   '+14045551234',
 *   'https://example.com/api/twilio/voice'
 * );
 * ```
 */
export async function makeCall(
  to: string,
  twimlUrl: string,
  from?: string
): Promise<string> {
  if (!twilioClient) {
    throw new Error('Twilio client not initialized. Check credentials.');
  }

  const fromNumber = from || twilioPhoneNumber;

  if (!fromNumber) {
    throw new Error('No Twilio phone number configured');
  }

  try {
    const call = await twilioClient.calls.create({
      to,
      from: fromNumber,
      url: twimlUrl,
    });

    console.log(`[Twilio] Call initiated: ${call.sid}`);
    return call.sid;
  } catch (error) {
    console.error('[Twilio] Error making call:', error);
    throw new Error(`Failed to make call: ${(error as Error).message}`);
  }
}

/**
 * Get call details
 *
 * @param callSid - Twilio call SID
 * @returns Promise that resolves with call details
 *
 * @example
 * ```ts
 * const call = await getCallDetails('CAxxxxxx');
 * console.log('Duration:', call.duration);
 * ```
 */
export async function getCallDetails(callSid: string) {
  if (!twilioClient) {
    throw new Error('Twilio client not initialized. Check credentials.');
  }

  try {
    const call = await twilioClient.calls(callSid).fetch();
    return call;
  } catch (error) {
    console.error('[Twilio] Error fetching call:', error);
    throw new Error(`Failed to fetch call: ${(error as Error).message}`);
  }
}

/**
 * Get message details
 *
 * @param messageSid - Twilio message SID
 * @returns Promise that resolves with message details
 *
 * @example
 * ```ts
 * const message = await getMessageDetails('SMxxxxxx');
 * console.log('Status:', message.status);
 * ```
 */
export async function getMessageDetails(messageSid: string) {
  if (!twilioClient) {
    throw new Error('Twilio client not initialized. Check credentials.');
  }

  try {
    const message = await twilioClient.messages(messageSid).fetch();
    return message;
  } catch (error) {
    console.error('[Twilio] Error fetching message:', error);
    throw new Error(`Failed to fetch message: ${(error as Error).message}`);
  }
}

// ============================================================================
// WEBHOOK VALIDATION
// ============================================================================

/**
 * Validate that a request came from Twilio
 * Important for securing webhooks
 *
 * @param authToken - Twilio auth token
 * @param twilioSignature - X-Twilio-Signature header value
 * @param url - Full webhook URL
 * @param params - Request parameters
 * @returns True if signature is valid
 *
 * @example
 * ```ts
 * const isValid = validateRequest(
 *   process.env.TWILIO_AUTH_TOKEN,
 *   request.headers.get('X-Twilio-Signature'),
 *   'https://example.com/api/twilio/sms',
 *   { From: '+14045551234', Body: 'Hello' }
 * );
 * ```
 */
export function validateRequest(
  authToken: string,
  twilioSignature: string,
  url: string,
  params: Record<string, string>
): boolean {
  return twilio.validateRequest(authToken, twilioSignature, url, params);
}

// ============================================================================
// PHONE NUMBER FORMATTING
// ============================================================================

/**
 * Format phone number to E.164 format
 * E.164 is the international format (+1XXXXXXXXXX)
 *
 * @param phoneNumber - Phone number to format
 * @param defaultCountryCode - Default country code if not included (default: +1)
 * @returns Formatted phone number
 *
 * @example
 * ```ts
 * formatPhoneNumber('4045551234'); // Returns: '+14045551234'
 * formatPhoneNumber('(404) 555-1234'); // Returns: '+14045551234'
 * ```
 */
export function formatPhoneNumber(
  phoneNumber: string,
  defaultCountryCode: string = '+1'
): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  // If already has country code
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // If 10 digits, add default country code
  if (digits.length === 10) {
    return `${defaultCountryCode}${digits}`;
  }

  // If starts with +, return as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }

  // Default: add country code
  return `${defaultCountryCode}${digits}`;
}

/**
 * Validate phone number format
 *
 * @param phoneNumber - Phone number to validate
 * @returns True if valid
 *
 * @example
 * ```ts
 * isValidPhoneNumber('+14045551234'); // true
 * isValidPhoneNumber('404-555-1234'); // true
 * isValidPhoneNumber('invalid'); // false
 * ```
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const formatted = formatPhoneNumber(phoneNumber);
  // E.164 format: + followed by 1-15 digits
  return /^\+[1-9]\d{1,14}$/.test(formatted);
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Test Twilio connection
 * Returns true if credentials are valid
 *
 * @example
 * ```ts
 * const isHealthy = await testTwilioConnection();
 * if (isHealthy) {
 *   console.log('Twilio connection successful');
 * }
 * ```
 */
export async function testTwilioConnection(): Promise<boolean> {
  if (!twilioClient || !accountSid) {
    return false;
  }

  try {
    // Fetch account details to verify credentials
    await twilioClient.api.accounts(accountSid).fetch();
    return true;
  } catch (error) {
    console.error('[Twilio] Connection test failed:', error);
    return false;
  }
}

// ============================================================================
// VOICEMAIL NOTIFICATION
// ============================================================================

/**
 * Send voicemail notification via SMS
 *
 * @param params - Voicemail notification parameters
 * @param params.clientId - Client ID for database lookup
 * @param params.callerNumber - Phone number of the caller
 * @param params.transcription - Voicemail transcription text
 * @param params.recordingUrl - URL to the voicemail recording (optional)
 * @param params.callSid - Twilio call SID
 * @returns Promise that resolves with Twilio message SID
 *
 * @example
 * ```ts
 * const messageSid = await sendVoicemailNotification({
 *   clientId: '00000000-0000-0000-0000-000000000001',
 *   callerNumber: '+14045551234',
 *   transcription: 'Hi, I need help with my AC unit...',
 *   recordingUrl: 'https://api.twilio.com/recording/RE...',
 *   callSid: 'CAxxxxxx'
 * });
 * ```
 */
export async function sendVoicemailNotification(params: {
  clientId: string;
  callerNumber: string;
  transcription: string;
  recordingUrl?: string;
  callSid: string;
}): Promise<string> {
  const { clientId, callerNumber, transcription, recordingUrl, callSid } = params;

  // Import supabase client (avoiding circular dependency)
  const { supabaseAdmin } = await import('@backend/lib/supabase/client');

  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  // Look up client notification phone number
  const { data: client, error } = await supabaseAdmin
    .from('clients')
    .select('notification_phone, business_name')
    .eq('id', clientId)
    .single();

  if (error || !client) {
    console.error('[Twilio] Error fetching client for voicemail notification:', error);
    throw new Error('Failed to fetch client data');
  }

  // Use client notification phone or fallback to Jeff's number
  const notificationPhone = client.notification_phone || '+16787887281';

  // Format timestamp
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Build SMS message
  const smsBody = `📞 NEW VOICEMAIL

From: ${callerNumber}
Time: ${timestamp}

Message:
"${transcription}"

${recordingUrl ? `🔗 Listen: ${recordingUrl}` : ''}`;

  // Send SMS notification
  try {
    const messageSid = await sendSMS(notificationPhone, smsBody);
    console.log(
      `[Twilio] Voicemail SMS notification sent to ${notificationPhone} (CallSid: ${callSid})`
    );
    return messageSid;
  } catch (error) {
    console.error('[Twilio] Failed to send voicemail SMS notification:', error);
    throw error;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { twilio };
