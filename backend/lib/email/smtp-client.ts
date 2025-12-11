/**
 * Email Service using Proton SMTP
 * Handles lead notification emails to support@cherysolutions.com
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Environment variables for Proton SMTP
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.protonmail.ch',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

const SMTP_FROM = process.env.SMTP_FROM || 'support@cherysolutions.com';
const EMAIL_NOTIFICATIONS_ENABLED = process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true';

// Create reusable transporter
let transporter: Transporter | null = null;

/**
 * Get or create nodemailer transporter
 */
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(SMTP_CONFIG);
  }
  return transporter;
}

/**
 * Test SMTP connection
 */
export async function testSMTPConnection(): Promise<boolean> {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log('[Email] SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('[Email] SMTP connection failed:', error);
    return false;
  }
}

/**
 * Send email using Proton SMTP
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}): Promise<{ success: boolean; error?: string; messageId?: string }> {
  // Check if email notifications are enabled
  if (!EMAIL_NOTIFICATIONS_ENABLED) {
    console.log('[Email] Email notifications are disabled via environment variable');
    return {
      success: false,
      error: 'Email notifications disabled',
    };
  }

  // Validate SMTP credentials
  if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
    console.error('[Email] Missing SMTP credentials');
    return {
      success: false,
      error: 'Missing SMTP credentials',
    };
  }

  try {
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: `NeverMissLead <${SMTP_FROM}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text,
    });

    console.log('[Email] Email sent successfully:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Failed to send email:', errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send lead notification email to support@cherysolutions.com
 */
export async function sendLeadNotificationEmail({
  leadData,
  clientName,
}: {
  leadData: {
    full_name: string;
    phone_number: string;
    message: string;
    source: string;
    created_at: string;
    ip_address?: string | null;
  };
  clientName: string;
}): Promise<{ success: boolean; error?: string }> {
  const { full_name, phone_number, message, source, created_at, ip_address } = leadData;

  // Format timestamp
  const timestamp = new Date(created_at).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // Format source
  const sourceDisplay = source === 'hero_form' ? 'Hero Form' : 'Quote Modal';

  // HTML email template
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .section {
          background: white;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        .section h2 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #667eea;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }
        .field {
          margin: 12px 0;
          display: flex;
          align-items: flex-start;
        }
        .field-label {
          font-weight: 600;
          min-width: 100px;
          color: #6b7280;
        }
        .field-value {
          color: #111827;
          flex: 1;
        }
        .message-box {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #667eea;
          margin-top: 10px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 12px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        .cta-button {
          display: inline-block;
          background: #667eea;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          margin: 10px 5px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚨 New Lead from ${clientName}</h1>
      </div>

      <div class="content">
        <div class="section">
          <h2>Customer Details</h2>
          <div class="field">
            <span class="field-label">Name:</span>
            <span class="field-value">${full_name}</span>
          </div>
          <div class="field">
            <span class="field-label">Phone:</span>
            <span class="field-value"><a href="tel:${phone_number}">${phone_number}</a></span>
          </div>
          <div class="field">
            <span class="field-label">Message:</span>
          </div>
          <div class="message-box">${message}</div>
        </div>

        <div class="section">
          <h2>Source Information</h2>
          <div class="field">
            <span class="field-label">Source:</span>
            <span class="field-value">${sourceDisplay}</span>
          </div>
          <div class="field">
            <span class="field-label">Time:</span>
            <span class="field-value">${timestamp}</span>
          </div>
          ${ip_address ? `
          <div class="field">
            <span class="field-label">IP Address:</span>
            <span class="field-value">${ip_address}</span>
          </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="tel:${phone_number}" class="cta-button">📞 Call Customer</a>
          <a href="https://nevermisslead.com" class="cta-button">🌐 View Website</a>
        </div>
      </div>

      <div class="footer">
        <p>This notification was sent by NeverMissLead</p>
        <p>Powered by <a href="https://cherysolutions.com" style="color: #667eea;">CherySolutions</a></p>
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const text = `
NEW LEAD FROM ${clientName.toUpperCase()}

CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:     ${full_name}
Phone:    ${phone_number}
Message:  ${message}

SOURCE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source:   ${sourceDisplay}
Time:     ${timestamp}
${ip_address ? `IP:       ${ip_address}` : ''}

Call customer: tel:${phone_number}
View website: https://nevermisslead.com

---
This notification was sent by NeverMissLead
Powered by CherySolutions - https://cherysolutions.com
  `.trim();

  // Send email to support@cherysolutions.com
  const result = await sendEmail({
    to: 'support@cherysolutions.com',
    subject: `New Lead: ${clientName}`,
    html,
    text,
  });

  return result;
}

/**
 * Send voicemail notification email
 */
export async function sendVoicemailEmail({
  voicemailData,
  clientName,
  notificationEmail,
}: {
  voicemailData: {
    caller_number: string;
    transcription_text: string;
    recording_url?: string;
    timestamp: string;
  };
  clientName: string;
  notificationEmail?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { caller_number, transcription_text, recording_url, timestamp } = voicemailData;

  // Use provided notification email or fallback
  const recipientEmail = notificationEmail || 'support@cherysolutions.com';

  // Format timestamp
  const formattedTimestamp = new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // HTML email template
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .section {
          background: white;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        .section h2 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #667eea;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }
        .field {
          margin: 12px 0;
          display: flex;
          align-items: flex-start;
        }
        .field-label {
          font-weight: 600;
          min-width: 100px;
          color: #6b7280;
        }
        .field-value {
          color: #111827;
          flex: 1;
        }
        .transcription-box {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #667eea;
          margin-top: 10px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 12px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        .cta-button {
          display: inline-block;
          background: #667eea;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          margin: 10px 5px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📞 New Voicemail from ${clientName}</h1>
      </div>

      <div class="content">
        <div class="section">
          <h2>Voicemail Details</h2>
          <div class="field">
            <span class="field-label">From:</span>
            <span class="field-value"><a href="tel:${caller_number}">${caller_number}</a></span>
          </div>
          <div class="field">
            <span class="field-label">Time:</span>
            <span class="field-value">${formattedTimestamp}</span>
          </div>
          <div class="field">
            <span class="field-label">Transcription:</span>
          </div>
          <div class="transcription-box">${transcription_text}</div>
        </div>

        ${recording_url ? `
        <div class="section">
          <h2>Recording</h2>
          <div class="field">
            <span class="field-label">Listen:</span>
            <span class="field-value"><a href="${recording_url}" style="color: #667eea;">Play Recording</a></span>
          </div>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 20px;">
          <a href="tel:${caller_number}" class="cta-button">📞 Call Back</a>
          ${recording_url ? `<a href="${recording_url}" class="cta-button">🎧 Listen to Voicemail</a>` : ''}
        </div>
      </div>

      <div class="footer">
        <p>This notification was sent by NeverMissLead</p>
        <p>Powered by <a href="https://cherysolutions.com" style="color: #667eea;">CherySolutions</a></p>
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const text = `
NEW VOICEMAIL FROM ${clientName.toUpperCase()}

VOICEMAIL DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From:     ${caller_number}
Time:     ${formattedTimestamp}

Transcription:
${transcription_text}

${recording_url ? `Recording: ${recording_url}` : ''}

Call back: tel:${caller_number}
${recording_url ? `Listen: ${recording_url}` : ''}

---
This notification was sent by NeverMissLead
Powered by CherySolutions - https://cherysolutions.com
  `.trim();

  // Send email
  const result = await sendEmail({
    to: recipientEmail,
    subject: `New Voicemail: ${clientName}`,
    html,
    text,
  });

  return result;
}
