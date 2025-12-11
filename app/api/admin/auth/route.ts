/**
 * NeverMissLead - Admin Authentication API
 *
 * Handles login, logout, and session verification for admin dashboard.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPassword,
  createSession,
  verifySession,
  destroySession,
  getSessionFromCookie,
  createSessionCookie,
  destroySessionCookie,
} from '@backend/lib/admin/auth';
import { getClientBySlug, getClientById } from '@backend/lib/supabase/client';

// ============================================================================
// POST /api/admin/auth - Login
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, clientSlug } = body;

    // Validate input
    if (!password || !clientSlug) {
      return NextResponse.json(
        { error: 'Password and client slug are required' },
        { status: 400 }
      );
    }

    // Get client ID from slug
    const client = await getClientBySlug(clientSlug);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Verify password
    if (!verifyPassword(password, client.id)) {
      console.warn(`[Admin/Auth] Failed login attempt for client: ${clientSlug}`);
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Get IP address and user agent for audit
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create session
    const sessionToken = await createSession(client.id, ipAddress, userAgent);
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    console.log(`[Admin/Auth] Successful login for client: ${clientSlug} (${client.id})`);

    // Create response with httpOnly cookie
    const response = NextResponse.json({
      success: true,
      client: {
        id: client.id,
        slug: client.slug,
        business_name: client.business_name,
      },
    });

    // Set httpOnly cookie
    response.headers.set('Set-Cookie', createSessionCookie(sessionToken));

    return response;
  } catch (error) {
    console.error('[Admin/Auth] Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/admin/auth - Verify Session
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookie
    const cookieHeader = request.headers.get('cookie');
    console.log('[Admin/Auth] GET - Cookie header:', cookieHeader);
    const sessionToken = getSessionFromCookie(cookieHeader);
    console.log('[Admin/Auth] GET - Session token:', sessionToken ? 'Found' : 'Not found');

    if (!sessionToken) {
      console.log('[Admin/Auth] GET - No session token in cookie');
      return NextResponse.json(
        { authenticated: false, error: 'No session token' },
        { status: 401 }
      );
    }

    // Verify session
    const clientId = await verifySession(sessionToken);
    console.log('[Admin/Auth] GET - Client ID from session:', clientId || 'Not found');
    if (!clientId) {
      console.log('[Admin/Auth] GET - Session invalid or expired');
      return NextResponse.json(
        { authenticated: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get client info by ID from session
    const client = await getClientById(clientId);
    if (!client) {
      return NextResponse.json(
        { authenticated: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      client: {
        id: client.id,
        slug: client.slug,
        business_name: client.business_name,
      },
    });
  } catch (error) {
    console.error('[Admin/Auth] Session verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/admin/auth - Logout
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    // Get session token from cookie
    const cookieHeader = request.headers.get('cookie');
    const sessionToken = getSessionFromCookie(cookieHeader);

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session token' },
        { status: 400 }
      );
    }

    // Destroy session in database
    await destroySession(sessionToken);

    console.log('[Admin/Auth] User logged out successfully');

    // Create response with expired cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear cookie
    response.headers.set('Set-Cookie', destroySessionCookie());

    return response;
  } catch (error) {
    console.error('[Admin/Auth] Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
