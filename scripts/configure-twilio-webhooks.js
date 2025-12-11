/**
 * Configure Twilio Webhooks for NeverMissLead
 *
 * This script updates the Twilio phone number to use the correct webhook URLs.
 * Run this after deploying to production.
 *
 * Usage:
 *   TWILIO_ACCOUNT_SID=xxx TWILIO_AUTH_TOKEN=xxx node scripts/configure-twilio-webhooks.js
 *
 * Or load from .env.local:
 *   export $(cat .env.local | xargs) && node scripts/configure-twilio-webhooks.js
 */

const twilio = require('twilio');

const PHONE_NUMBER = '+16787887281'; // NeverMissLead tracking number
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nevermisslead.com';

async function configureWebhooks() {
  console.log('🔧 Configuring Twilio webhooks...\n');

  // Initialize Twilio client
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.error('❌ Error: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env.local');
    process.exit(1);
  }

  const client = twilio(accountSid, authToken);

  try {
    // Find the phone number SID
    console.log(`📱 Looking up phone number: ${PHONE_NUMBER}`);
    const phoneNumbers = await client.incomingPhoneNumbers.list({
      phoneNumber: PHONE_NUMBER,
    });

    if (phoneNumbers.length === 0) {
      console.error(`❌ Error: Phone number ${PHONE_NUMBER} not found in your Twilio account`);
      process.exit(1);
    }

    const phoneNumberSid = phoneNumbers[0].sid;
    console.log(`✅ Found phone number SID: ${phoneNumberSid}\n`);

    // Configure webhook URLs
    const voiceUrl = `${BASE_URL}/api/twilio/voice`;
    const smsUrl = `${BASE_URL}/api/twilio/sms`;
    const statusCallbackUrl = `${BASE_URL}/api/twilio/status`;

    console.log('🔗 Updating webhook URLs:');
    console.log(`   Voice: ${voiceUrl}`);
    console.log(`   SMS: ${smsUrl}`);
    console.log(`   Status Callback: ${statusCallbackUrl}\n`);

    // Update the phone number configuration
    await client.incomingPhoneNumbers(phoneNumberSid).update({
      voiceUrl: voiceUrl,
      voiceMethod: 'POST',
      statusCallback: statusCallbackUrl,
      statusCallbackMethod: 'POST',
      smsUrl: smsUrl,
      smsMethod: 'POST',
    });

    console.log('✅ Webhooks configured successfully!\n');
    console.log('📋 Configuration Summary:');
    console.log(`   Phone Number: ${PHONE_NUMBER}`);
    console.log(`   Voice Webhook: ${voiceUrl} (POST)`);
    console.log(`   SMS Webhook: ${smsUrl} (POST)`);
    console.log(`   Status Callback: ${statusCallbackUrl} (POST)`);
    console.log('\n🎉 Done! Your Twilio webhooks are now configured.\n');

  } catch (error) {
    console.error('❌ Error configuring webhooks:', error.message);
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
    if (error.moreInfo) {
      console.error(`   More Info: ${error.moreInfo}`);
    }
    process.exit(1);
  }
}

// Run the configuration
configureWebhooks();
