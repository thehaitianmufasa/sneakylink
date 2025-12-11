#!/usr/bin/env node

/**
 * GENERATE CONFIG FILE
 *
 * Creates a new client config file from the template.
 *
 * Usage:
 *   node generate-config.js \
 *     --slug=client-slug \
 *     --clientId=uuid-here \
 *     --businessName="Business Name" \
 *     [--open]
 *
 * Options:
 *   --slug          Client slug (must match config filename)
 *   --clientId      Client UUID from Supabase
 *   --businessName  Business display name
 *   --open          Open file in default editor after creation
 *
 * This script:
 *   1. Copies config.template.json to config/clients/[slug].json
 *   2. Replaces placeholder values with actual client data
 *   3. Optionally opens the file for manual editing
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('slug', {
    type: 'string',
    description: 'Client slug (lowercase, no spaces)',
    required: true
  })
  .option('clientId', {
    type: 'string',
    description: 'Client UUID from Supabase',
    required: true
  })
  .option('businessName', {
    type: 'string',
    description: 'Business display name',
    required: true
  })
  .option('open', {
    type: 'boolean',
    description: 'Open file in default editor',
    default: false
  })
  .argv;

const PROJECT_ROOT = path.join(__dirname, '..');
const TEMPLATE_PATH = path.join(PROJECT_ROOT, 'config', 'config.template.json');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'config', 'clients', `${argv.slug}.json`);

async function generateConfig() {
  const spinner = ora('Generating config file...').start();

  try {
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(argv.slug)) {
      throw new Error('Slug must be lowercase letters, numbers, and hyphens only');
    }

    // Check if template exists
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error('Template file not found: ' + TEMPLATE_PATH);
    }

    // Check if output file already exists
    if (fs.existsSync(OUTPUT_PATH)) {
      spinner.warn(chalk.yellow(`Config file already exists: ${OUTPUT_PATH}`));
      console.log('');
      console.log(chalk.yellow('⚠️  File already exists. Overwrite? (y/n)'));

      // For now, just fail - in interactive mode you'd prompt
      throw new Error('Config file already exists. Delete it first or use a different slug.');
    }

    // Read template
    spinner.text = 'Reading template...';
    const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    let config = JSON.parse(templateContent);

    // Replace placeholder values
    spinner.text = 'Updating config values...';
    config.clientId = argv.clientId;
    config.slug = argv.slug;

    if (config.businessInfo) {
      config.businessInfo.businessName = argv.businessName;
    }

    if (config.hero) {
      // Update hero headline to include business name
      if (config.hero.headline) {
        config.hero.headline = config.hero.headline.replace('Your Business Name', argv.businessName);
      }
    }

    if (config.about) {
      // Update about heading
      if (config.about.heading) {
        config.about.heading = config.about.heading.replace('Your Business Name', argv.businessName);
      }
    }

    // Write config file
    spinner.text = 'Writing config file...';
    const configDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(config, null, 2), 'utf8');

    spinner.succeed(chalk.green('Config file created successfully!'));

    // Output summary
    console.log('');
    console.log(chalk.blue('Config File Created:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.white(`Location:      ${OUTPUT_PATH}`));
    console.log(chalk.white(`Client ID:     ${argv.clientId}`));
    console.log(chalk.white(`Slug:          ${argv.slug}`));
    console.log(chalk.white(`Business Name: ${argv.businessName}`));
    console.log(chalk.gray('─'.repeat(50)));
    console.log('');
    console.log(chalk.yellow('💡 Next Steps:'));
    console.log(chalk.white('   1. Edit the config file to fill in all sections:'));
    console.log(chalk.white('      - businessInfo (contact, hours)'));
    console.log(chalk.white('      - services (8 services required)'));
    console.log(chalk.white('      - faq (5-10 questions)'));
    console.log(chalk.white('      - serviceAreas (cities and counties)'));
    console.log(chalk.white('      - hero, about, socialProof sections'));
    console.log(chalk.white('   2. Update branding colors'));
    console.log(chalk.white('   3. Add logo image path'));
    console.log(chalk.white('   4. Configure integrations (Twilio, Google)'));
    console.log('');

    // Open file if requested
    if (argv.open) {
      spinner.start('Opening file in default editor...');
      try {
        if (process.platform === 'darwin') {
          execSync(`open "${OUTPUT_PATH}"`);
        } else if (process.platform === 'win32') {
          execSync(`start "" "${OUTPUT_PATH}"`);
        } else {
          execSync(`xdg-open "${OUTPUT_PATH}"`);
        }
        spinner.succeed(chalk.green('File opened in default editor'));
      } catch (error) {
        spinner.warn(chalk.yellow('Could not open file automatically'));
        console.log(chalk.white(`Please open manually: ${OUTPUT_PATH}`));
      }
    } else {
      console.log(chalk.gray('💡 Tip: Use --open to automatically open the file in your editor'));
      console.log('');
    }

    process.exit(0);
  } catch (error) {
    spinner.fail(chalk.red('Failed to generate config'));
    console.error('');
    console.error(chalk.red('Error: ' + error.message));
    process.exit(1);
  }
}

// Run the script
generateConfig();
