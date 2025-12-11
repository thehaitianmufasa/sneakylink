#!/usr/bin/env node

/**
 * SETUP SUPABASE CLIENT
 *
 * Automates the creation of new client records in the shared Supabase database.
 *
 * Usage:
 *   node setup-supabase-client.js \
 *     --slug=client-slug \
 *     --business="Business Name" \
 *     --phone="(xxx) xxx-xxxx" \
 *     --email="info@business.com" \
 *     --status=trial \
 *     [--json]
 *
 * Options:
 *   --slug          Client slug (lowercase, no spaces)
 *   --business      Business display name
 *   --phone         Business phone number
 *   --email         Business email address
 *   --status        Client status (trial, active, inactive, suspended)
 *   --json          Output JSON format (for script parsing)
 *   --update        Update existing client instead of creating new
 *   --twilioNumber  Twilio phone number (for updates)
 *   --customDomain  Custom domain (for updates)
 *   --vercelId      Vercel project ID (for updates)
 *
 * Environment Variables Required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const ora = require('ora');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('slug', {
    type: 'string',
    description: 'Client slug (lowercase, no spaces)',
    required: true
  })
  .option('business', {
    type: 'string',
    description: 'Business display name'
  })
  .option('phone', {
    type: 'string',
    description: 'Business phone number'
  })
  .option('email', {
    type: 'string',
    description: 'Business email address'
  })
  .option('status', {
    type: 'string',
    description: 'Client status',
    choices: ['trial', 'active', 'inactive', 'suspended'],
    default: 'trial'
  })
  .option('json', {
    type: 'boolean',
    description: 'Output JSON format',
    default: false
  })
  .option('update', {
    type: 'boolean',
    description: 'Update existing client',
    default: false
  })
  .option('twilioNumber', {
    type: 'string',
    description: 'Twilio phone number'
  })
  .option('customDomain', {
    type: 'string',
    description: 'Custom domain'
  })
  .option('vercelId', {
    type: 'string',
    description: 'Vercel project ID'
  })
  .argv;

// Validate environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(chalk.red('❌ Missing required environment variables:'));
  console.error(chalk.red('   NEXT_PUBLIC_SUPABASE_URL'));
  console.error(chalk.red('   SUPABASE_SERVICE_ROLE_KEY'));
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createClient() {
  const spinner = argv.json ? null : ora('Creating client record...').start();

  try {
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(argv.slug)) {
      throw new Error('Slug must be lowercase letters, numbers, and hyphens only');
    }

    // Validate required fields for new client
    if (!argv.update && (!argv.business || !argv.phone || !argv.email)) {
      throw new Error('--business, --phone, and --email are required for new clients');
    }

    // Prepare client data
    const clientData = {
      slug: argv.slug,
      status: argv.status
    };

    if (argv.business) clientData.business_name = argv.business;
    if (argv.phone) clientData.phone = argv.phone;
    if (argv.email) clientData.email = argv.email;
    if (argv.twilioNumber) clientData.twilio_phone_number = argv.twilioNumber;
    if (argv.customDomain) clientData.custom_domain = argv.customDomain;
    if (argv.vercelId) clientData.vercel_project_id = argv.vercelId;

    let result;

    if (argv.update) {
      // Update existing client
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('slug', argv.slug)
        .select()
        .single();

      if (error) throw error;
      result = data;

      if (spinner) {
        spinner.succeed(chalk.green('Client updated successfully!'));
      }
    } else {
      // Create new client
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      result = data;

      if (spinner) {
        spinner.succeed(chalk.green('Client created successfully!'));
      }
    }

    // Output result
    if (argv.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('');
      console.log(chalk.blue('Client Details:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.white(`ID:              ${result.id}`));
      console.log(chalk.white(`Slug:            ${result.slug}`));
      console.log(chalk.white(`Business Name:   ${result.business_name || 'N/A'}`));
      console.log(chalk.white(`Phone:           ${result.phone || 'N/A'}`));
      console.log(chalk.white(`Email:           ${result.email || 'N/A'}`));
      console.log(chalk.white(`Status:          ${result.status}`));
      if (result.twilio_phone_number) {
        console.log(chalk.white(`Twilio Number:   ${result.twilio_phone_number}`));
      }
      if (result.custom_domain) {
        console.log(chalk.white(`Custom Domain:   ${result.custom_domain}`));
      }
      console.log(chalk.gray('─'.repeat(50)));
      console.log('');
      console.log(chalk.yellow('💡 Next Steps:'));
      console.log(chalk.white('   1. Copy the client ID above'));
      console.log(chalk.white('   2. Update config/clients/' + argv.slug + '.json'));
      console.log(chalk.white('   3. Set clientId field in config file'));
      console.log('');
    }

    process.exit(0);
  } catch (error) {
    if (spinner) {
      spinner.fail(chalk.red('Failed to create/update client'));
    }

    console.error('');
    console.error(chalk.red('Error: ' + error.message));

    if (error.code === '23505') {
      console.error(chalk.yellow('💡 Tip: This slug already exists. Use --update to modify it.'));
    }

    process.exit(1);
  }
}

// Run the script
createClient();
