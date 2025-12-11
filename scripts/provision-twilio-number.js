#!/usr/bin/env node

/**
 * PROVISION TWILIO NUMBER
 *
 * Automates Twilio phone number purchase and webhook configuration.
 *
 * Usage:
 *   # Search for available numbers
 *   node provision-twilio-number.js --areaCode=404 --search
 *
 *   # Purchase a number
 *   node provision-twilio-number.js --areaCode=404 --buy [--json]
 *
 *   # Configure webhooks for existing number
 *   node provision-twilio-number.js \
 *     --number=+14045551234 \
 *     --webhookUrl=https://clientdomain.com \
 *     --configure
 *
 * Options:
 *   --areaCode      Area code to search (e.g., 404, 678)
 *   --search        Search for available numbers
 *   --buy           Purchase the first available number
 *   --number        Phone number to configure (E.164 format: +1xxxxxxxxxx)
 *   --webhookUrl    Production URL for webhooks (e.g., https://clientdomain.com)
 *   --configure     Configure webhooks for existing number
 *   --json          Output JSON format
 *
 * Environment Variables Required:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 */

require('dotenv').config();
const twilio = require('twilio');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const ora = require('ora');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('areaCode', {
    type: 'string',
    description: 'Area code to search'
  })
  .option('search', {
    type: 'boolean',
    description: 'Search for available numbers',
    default: false
  })
  .option('buy', {
    type: 'boolean',
    description: 'Purchase first available number',
    default: false
  })
  .option('number', {
    type: 'string',
    description: 'Phone number to configure'
  })
  .option('webhookUrl', {
    type: 'string',
    description: 'Production URL for webhooks'
  })
  .option('configure', {
    type: 'boolean',
    description: 'Configure webhooks',
    default: false
  })
  .option('json', {
    type: 'boolean',
    description: 'Output JSON format',
    default: false
  })
  .check((argv) => {
    if (argv.search || argv.buy) {
      if (!argv.areaCode) {
        throw new Error('--areaCode is required for search/buy operations');
      }
    }
    if (argv.configure) {
      if (!argv.number || !argv.webhookUrl) {
        throw new Error('--number and --webhookUrl are required for configure operation');
      }
    }
    return true;
  })
  .argv;

// Validate environment variables
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

if (!ACCOUNT_SID || !AUTH_TOKEN) {
  console.error(chalk.red('❌ Missing required environment variables:'));
  console.error(chalk.red('   TWILIO_ACCOUNT_SID'));
  console.error(chalk.red('   TWILIO_AUTH_TOKEN'));
  process.exit(1);
}

// Initialize Twilio client
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

async function searchNumbers() {
  const spinner = argv.json ? null : ora(`Searching for numbers in area code ${argv.areaCode}...`).start();

  try {
    const numbers = await client.availablePhoneNumbers('US')
      .local
      .list({
        areaCode: argv.areaCode,
        smsEnabled: true,
        mmsEnabled: true,
        voiceEnabled: true,
        limit: 10
      });

    if (spinner) spinner.succeed(chalk.green(`Found ${numbers.length} available numbers`));

    if (argv.json) {
      console.log(JSON.stringify(numbers, null, 2));
    } else {
      console.log('');
      console.log(chalk.blue('Available Numbers:'));
      console.log(chalk.gray('─'.repeat(50)));
      numbers.forEach((number, index) => {
        console.log(chalk.white(`${index + 1}. ${number.phoneNumber}`));
        console.log(chalk.gray(`   Capabilities: Voice ${number.capabilities.voice ? '✅' : '❌'} | SMS ${number.capabilities.SMS ? '✅' : '❌'} | MMS ${number.capabilities.MMS ? '✅' : '❌'}`));
      });
      console.log(chalk.gray('─'.repeat(50)));
      console.log('');
    }

    return numbers;
  } catch (error) {
    if (spinner) spinner.fail(chalk.red('Search failed'));
    console.error(chalk.red('Error: ' + error.message));
    process.exit(1);
  }
}

async function buyNumber() {
  const spinner = argv.json ? null : ora(`Searching for numbers in area code ${argv.areaCode}...`).start();

  try {
    // First search for available numbers
    const numbers = await client.availablePhoneNumbers('US')
      .local
      .list({
        areaCode: argv.areaCode,
        smsEnabled: true,
        mmsEnabled: true,
        voiceEnabled: true,
        limit: 1
      });

    if (numbers.length === 0) {
      throw new Error('No available numbers found in area code ' + argv.areaCode);
    }

    const selectedNumber = numbers[0].phoneNumber;

    if (spinner) {
      spinner.text = `Purchasing ${selectedNumber}...`;
    }

    // Purchase the number
    const purchasedNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: selectedNumber,
      smsApplicationSid: undefined,
      voiceApplicationSid: undefined
    });

    if (spinner) {
      spinner.succeed(chalk.green(`Number purchased: ${purchasedNumber.phoneNumber}`));
    }

    if (argv.json) {
      console.log(JSON.stringify({ phoneNumber: purchasedNumber.phoneNumber, sid: purchasedNumber.sid }, null, 2));
    } else {
      console.log('');
      console.log(chalk.blue('Purchase Successful!'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.white(`Phone Number:  ${purchasedNumber.phoneNumber}`));
      console.log(chalk.white(`SID:           ${purchasedNumber.sid}`));
      console.log(chalk.white(`Cost:          $2.75/month`));
      console.log(chalk.gray('─'.repeat(50)));
      console.log('');
      console.log(chalk.yellow('💡 Next Steps:'));
      console.log(chalk.white('   1. Add this number to Supabase clients table'));
      console.log(chalk.white('   2. Deploy client site to get production URL'));
      console.log(chalk.white('   3. Configure webhooks with --configure'));
      console.log('');
    }

    return purchasedNumber;
  } catch (error) {
    if (spinner) spinner.fail(chalk.red('Purchase failed'));
    console.error(chalk.red('Error: ' + error.message));
    process.exit(1);
  }
}

async function configureWebhooks() {
  const spinner = argv.json ? null : ora(`Configuring webhooks for ${argv.number}...`).start();

  try {
    // Get the phone number SID
    const numbers = await client.incomingPhoneNumbers.list({
      phoneNumber: argv.number
    });

    if (numbers.length === 0) {
      throw new Error(`Phone number ${argv.number} not found in your Twilio account`);
    }

    const numberSid = numbers[0].sid;

    // Construct webhook URLs
    const voiceUrl = `${argv.webhookUrl}/api/twilio/voice`;
    const smsUrl = `${argv.webhookUrl}/api/twilio/sms`;
    const statusCallback = `${argv.webhookUrl}/api/twilio/status`;

    // Update the phone number with webhooks
    const updatedNumber = await client.incomingPhoneNumbers(numberSid).update({
      voiceUrl: voiceUrl,
      voiceMethod: 'POST',
      smsUrl: smsUrl,
      smsMethod: 'POST',
      statusCallback: statusCallback,
      statusCallbackMethod: 'POST'
    });

    if (spinner) {
      spinner.succeed(chalk.green('Webhooks configured successfully!'));
    }

    if (argv.json) {
      console.log(JSON.stringify({
        phoneNumber: updatedNumber.phoneNumber,
        voiceUrl: updatedNumber.voiceUrl,
        smsUrl: updatedNumber.smsUrl,
        statusCallback: updatedNumber.statusCallback
      }, null, 2));
    } else {
      console.log('');
      console.log(chalk.blue('Webhook Configuration:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.white(`Phone Number:      ${updatedNumber.phoneNumber}`));
      console.log(chalk.white(`Voice URL:         ${updatedNumber.voiceUrl}`));
      console.log(chalk.white(`SMS URL:           ${updatedNumber.smsUrl}`));
      console.log(chalk.white(`Status Callback:   ${updatedNumber.statusCallback}`));
      console.log(chalk.gray('─'.repeat(50)));
      console.log('');
      console.log(chalk.green('✅ Webhooks configured!'));
      console.log('');
      console.log(chalk.yellow('💡 Test your setup:'));
      console.log(chalk.white(`   1. Call ${updatedNumber.phoneNumber} - should play voicemail greeting`));
      console.log(chalk.white(`   2. Text ${updatedNumber.phoneNumber} - should receive auto-response`));
      console.log(chalk.white('   3. Check Supabase for call_logs and sms_logs entries'));
      console.log('');
    }

    return updatedNumber;
  } catch (error) {
    if (spinner) spinner.fail(chalk.red('Configuration failed'));
    console.error(chalk.red('Error: ' + error.message));
    process.exit(1);
  }
}

// Main execution
async function main() {
  if (argv.search) {
    await searchNumbers();
  } else if (argv.buy) {
    await buyNumber();
  } else if (argv.configure) {
    await configureWebhooks();
  } else {
    console.error(chalk.red('❌ No operation specified. Use --search, --buy, or --configure'));
    process.exit(1);
  }
}

main();
