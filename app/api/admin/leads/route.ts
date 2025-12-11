/**
 * NeverMissLead - Admin Leads API
 *
 * Handles fetching, filtering, and updating leads for the CRM dashboard.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySession, getSessionFromCookie } from '@backend/lib/admin/auth';
import { supabase, setClientContext } from '@backend/lib/supabase/client';

// ============================================================================
// GET /api/admin/leads - Fetch Leads
// ============================================================================

export async function GET(request: NextRequest) {
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

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get('status'); // Filter by status
    const search = searchParams.get('search'); // Search by name/phone/email
    const limit = Number.parseInt(searchParams.get('limit') || '50', 10);
    const offset = Number.parseInt(searchParams.get('offset') || '0', 10);

    // Validate status parameter
    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'] as const;
    const status = statusParam && validStatuses.includes(statusParam as any)
      ? (statusParam as typeof validStatuses[number])
      : null;

    // Build query
    let query = supabase
      .from('leads')
      .select(`
        *,
        call_logs (
          id,
          from_number,
          to_number,
          status,
          duration,
          recording_url,
          connected_to_owner,
          auto_sms_sent,
          notes,
          callback_completed,
          callback_at,
          created_at
        )
      `, { count: 'exact' })
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      // Search in full_name, phone, or email
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: leads, error, count } = await query;

    if (error) {
      console.error('[Admin/Leads] Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      leads: leads || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[Admin/Leads] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/admin/leads - Update Lead
// ============================================================================

export async function PATCH(request: NextRequest) {
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
    const { leadId, updates } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Allowed fields to update
    const allowedFields = ['status', 'notes', 'last_contacted_at', 'assigned_to'];
    const sanitizedUpdates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field];
      }
    }

    // Add updated_at timestamp
    sanitizedUpdates.updated_at = new Date().toISOString();

    // Update lead in database
    const { data, error } = await supabase
      .from('leads')
      .update(sanitizedUpdates)
      .eq('id', leadId)
      .eq('client_id', clientId) // Ensure client owns this lead
      .select()
      .single();

    if (error) {
      console.error('[Admin/Leads] Error updating lead:', error);
      return NextResponse.json(
        { error: 'Failed to update lead' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    console.log(`[Admin/Leads] Lead updated: ${leadId}`);

    return NextResponse.json({
      success: true,
      lead: data,
    });
  } catch (error) {
    console.error('[Admin/Leads] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
