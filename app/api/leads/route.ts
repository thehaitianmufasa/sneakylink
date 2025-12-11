/**
 * NeverMissLead - Leads API Route
 *
 * Handles lead form submissions from client websites.
 * Validates data, enforces RLS, and stores leads in database.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createLead, setClientContext, getClientById } from '@backend/lib/supabase/client';
import { getClientContext } from '@backend/lib/utils/get-client-id';
import { LeadFormDataSchema } from '@shared/schemas/client-config.schema';
import { sendSMS, formatPhoneNumber } from '@backend/lib/twilio/client';
import { getClientConfig } from '@shared/config/config-loader';
import type { Database } from '@backend/lib/supabase/types';
import { sendLeadNotificationEmail } from '@backend/lib/email/smtp-client';

type LeadStatus = Database['public']['Tables']['leads']['Row']['status'];

const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'converted', 'lost'];

function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

// Extends the base schema with optional tracking fields and SMS consent
const LeadSubmissionSchema = LeadFormDataSchema.extend({
  pageUrl: z.string().url().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  referrer: z.string().optional(),
  smsOptedIn: z.boolean().optional(),
});

// ============================================================================
// POST /api/leads
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input data
    const validationResult = LeadSubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const leadData = validationResult.data;

    // Resolve client ID
    let clientId: string;

    // If clientId provided in body, use it (must be valid UUID)
    if (leadData.clientId) {
      clientId = leadData.clientId;
    } else {
      // Otherwise, resolve from request context
      const context = await getClientContext();
      clientId = context.clientId;
    }

    // Set RLS context for this client
    await setClientContext(clientId);

    // Get request metadata
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
    const userAgent = request.headers.get('user-agent') || null;
    const referrer = request.headers.get('referer') || leadData.referrer || null;

    const defaultLeadStatus: LeadStatus = 'new';

    // Map form sources to database-allowed values
    const mapSourceToDatabase = (source: string): 'website' | 'phone' | 'sms' | 'referral' => {
      const sourceMap: Record<string, 'website' | 'phone' | 'sms' | 'referral'> = {
        'hero_form': 'website',
        'quote_modal': 'website',
        'discount_modal': 'website',
        'access_modal': 'website',
        'signup_page': 'website',
        'website': 'website',
        'phone': 'phone',
        'sms': 'sms',
        'referral': 'referral',
      };
      return sourceMap[source] || 'website';
    };

    // Prepare SMS consent data
    const smsOptedIn = leadData.smsOptedIn || false;
    const smsConsentRecord = smsOptedIn ? {
      opted_in: true,
      timestamp: new Date().toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
      source: leadData.source,
      consent_version: '1.0',
    } : null;

    // Create lead record with SMS consent data
    // Note: SMS consent fields will be available after running the migration
    const lead = await createLead({
      client_id: clientId,
      full_name: leadData.fullName,
      phone: leadData.phone,
      email: leadData.email || null,
      service_type: leadData.serviceType || null,
      message: leadData.message || null,
      source: mapSourceToDatabase(leadData.source),
      page_url: leadData.pageUrl || referrer,
      utm_source: leadData.utmSource || null,
      utm_medium: leadData.utmMedium || null,
      utm_campaign: leadData.utmCampaign || null,
      referrer: referrer,
      ip_address: ipAddress,
      user_agent: userAgent,
      status: defaultLeadStatus,
      // SMS consent fields (temporarily using 'as any' until types are regenerated)
      ...( smsOptedIn ? {
        sms_phone_number: leadData.phone,
        sms_opted_in: smsOptedIn,
        sms_opt_in_timestamp: new Date().toISOString(),
        sms_opt_in_method: 'web_form',
        sms_opt_in_ip_address: ipAddress,
        sms_consent_record: smsConsentRecord,
      } : {})
    } as any);

    console.log(`[API/Leads] Lead created: ${lead.id} for client: ${clientId} (SMS Opt-in: ${smsOptedIn})`);

    // Log SMS consent action to audit table (non-blocking)
    if (smsOptedIn) {
      try {
        const { supabase } = await import('@backend/lib/supabase/client');
        // Note: sms_consent_audit table will be available after running the migration
        await (supabase as any).from('sms_consent_audit').insert({
          lead_id: lead.id,
          client_id: clientId,
          action: 'opted_in',
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            source: leadData.source,
            form_type: leadData.source === 'hero_form' ? 'embedded' : 'modal',
          },
        });
        console.log(`[API/Leads] SMS consent logged to audit table for lead: ${lead.id}`);
      } catch (auditError) {
        console.error('[API/Leads] Error logging SMS consent to audit table:', auditError);
      }
    }

    // Track Lead event in Meta Pixel (non-blocking)
    try {
      const context = await getClientContext();
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nevermisslead.com'}/api/meta/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'Lead',
          event_time: new Date().toISOString(),
          event_source_url: leadData.pageUrl || referrer || '',
          fbp: request.cookies.get('_fbp')?.value,
          fbc: request.cookies.get('_fbc')?.value,
          custom_data: {
            value: 50, // Estimated lead value
            currency: 'USD',
            content_name: 'Lead Form Submission'
          },
          client_slug: context.slug
        })
      });
      console.log(`[API/Leads] Meta Lead event tracked for lead: ${lead.id}`);
    } catch (metaError) {
      // Don't fail lead creation if tracking fails
      console.error('[API/Leads] Failed to track Meta Lead event:', metaError);
    }

    // Send email notification (non-blocking - don't fail lead creation if email fails)
    try {
      // Get client info for email
      const client = await getClientById(clientId);
      const clientName = client?.business_name || 'NeverMissLead';

      // Send notification email
      const emailResult = await sendLeadNotificationEmail({
        leadData: {
          full_name: leadData.fullName,
          phone_number: leadData.phone,
          message: leadData.message || 'No message provided',
          source: leadData.source,
          created_at: lead.created_at,
          ip_address: ipAddress,
        },
        clientName,
      });

      if (emailResult.success) {
        console.log(`[API/Leads] Email notification sent for lead: ${lead.id}`);
      } else {
        console.error(`[API/Leads] Email notification failed for lead: ${lead.id}`, emailResult.error);
      }
    } catch (emailError) {
      // Log error but don't fail the request - lead was created successfully
      console.error('[API/Leads] Email notification error:', emailError);
    }

    // Send SMS notification to business owner (when Twilio is verified)
    try {
      const context = await getClientContext();
      const clientConfig = await getClientConfig(context.slug);

      // Get business phone number from Twilio integration config
      const businessPhone = clientConfig.integrations?.twilio?.forwardToNumber;

      if (businessPhone && process.env.TWILIO_PHONE_NUMBER && process.env.ENABLE_SMS_NOTIFICATIONS === 'true') {
        const smsBody = `🔔 New Lead from ${leadData.fullName}
📞 Phone: ${leadData.phone}
💬 Message: ${leadData.message || 'No message'}`;

        const formattedBusinessPhone = formatPhoneNumber(businessPhone);

        await sendSMS(formattedBusinessPhone, smsBody);

        console.log(`[API/Leads] SMS notification sent to: ${formattedBusinessPhone}`);
      } else {
        console.log('[API/Leads] SMS notification skipped - No business phone or Twilio not configured/verified');
      }
    } catch (smsError) {
      // Log error but don't fail the request
      console.error('[API/Leads] Error sending SMS notification:', smsError);
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Lead submitted successfully',
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API/Leads] Error creating lead:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit lead',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/leads (Admin only)
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get client context
    const { clientId } = await getClientContext();

    // Set RLS context
    await setClientContext(clientId);

    // Import supabase client
    const { supabase } = await import('@backend/lib/supabase/client');

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (statusParam && isLeadStatus(statusParam)) {
      query = query.eq('status', statusParam);
    }

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        leads: data,
        total: count,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API/Leads] Error fetching leads:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leads',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// OPTIONS /api/leads (CORS preflight)
// ============================================================================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
