/**
 * NeverMissLead - Admin Notes API
 *
 * Handles adding and updating notes on call logs from the CRM dashboard.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySession, getSessionFromCookie } from '@backend/lib/admin/auth';
import { supabase, setClientContext } from '@backend/lib/supabase/client';

// ============================================================================
// PATCH /api/admin/notes - Update Call Log Notes
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
    const { callLogId, notes, callbackCompleted } = body;

    if (!callLogId) {
      return NextResponse.json(
        { error: 'Call log ID is required' },
        { status: 400 }
      );
    }

    // Build updates object
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) {
      updates.notes = notes;
    }

    if (callbackCompleted !== undefined) {
      updates.callback_completed = callbackCompleted;
      if (callbackCompleted === true) {
        updates.callback_at = new Date().toISOString();
      }
    }

    // Update call log in database
    const { data, error } = await supabase
      .from('call_logs')
      .update(updates)
      .eq('id', callLogId)
      .eq('client_id', clientId) // Ensure client owns this call log
      .select()
      .single();

    if (error) {
      console.error('[Admin/Notes] Error updating call log:', error);
      return NextResponse.json(
        { error: 'Failed to update call log' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Call log not found' },
        { status: 404 }
      );
    }

    console.log(`[Admin/Notes] Call log updated: ${callLogId}`);

    return NextResponse.json({
      success: true,
      callLog: data,
    });
  } catch (error) {
    console.error('[Admin/Notes] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
