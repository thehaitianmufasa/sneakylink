/**
 * NeverMissLead - Admin Authentication Helpers
 *
 * Simple password-based authentication system for admin CRM dashboard.
 * Uses httpOnly cookies with 24-hour session expiry.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { supabaseAdmin } from '@backend/lib/supabase/client';
import { randomBytes } from 'crypto';

// ============================================================================
// Password Verification
// ============================================================================

/**
 * Verify admin password against environment variable
 *
 * SECURITY NOTE: This is a simple password check for MVP.
 * For production with multiple admins, use proper password hashing (bcrypt).
 *
 * @param password - Password to verify
 * @param clientId - Client ID requesting access
 * @returns True if password is correct
 */
export function verifyPassword(password: string, clientId: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('[Admin/Auth] ADMIN_PASSWORD not configured');
    return false;
  }

  // Simple string comparison for MVP
  // TODO: Implement per-client passwords or use password hashing for production
  return password === adminPassword;
}

// ============================================================================
// Session Management
// ============================================================================

/**
 * Create a new admin session
 *
 * Generates a secure random token and stores it in the database
 * with 24-hour expiry.
 *
 * @param clientId - Client ID to create session for
 * @param ipAddress - Optional IP address for audit logging
 * @param userAgent - Optional user agent for audit logging
 * @returns Session token string or null if failed
 */
export async function createSession(
  clientId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string | null> {
  if (!supabaseAdmin) {
    console.error('[Admin/Auth] Supabase admin client not available');
    return null;
  }

  try {
    // Generate secure random token (32 bytes = 64 hex characters)
    const sessionToken = randomBytes(32).toString('hex');

    // Calculate expiry time (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Insert session into database
    const { data, error } = await supabaseAdmin
      .from('admin_sessions')
      .insert({
        session_token: sessionToken,
        client_id: clientId,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
      })
      .select('session_token')
      .single();

    if (error) {
      console.error('[Admin/Auth] Failed to create session:', error);
      return null;
    }

    console.log(`[Admin/Auth] Session created for client: ${clientId}`);
    return data.session_token;
  } catch (error) {
    console.error('[Admin/Auth] Error creating session:', error);
    return null;
  }
}

/**
 * Verify a session token
 *
 * Checks if the token exists in the database and is not expired.
 * Returns the client ID if valid.
 *
 * @param sessionToken - Session token to verify
 * @returns Client ID if valid, null if invalid or expired
 */
export async function verifySession(sessionToken: string): Promise<string | null> {
  if (!supabaseAdmin) {
    console.error('[Admin/Auth] Supabase admin client not available');
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('client_id, expires_at')
      .eq('session_token', sessionToken)
      .maybeSingle();

    if (error) {
      console.error('[Admin/Auth] Error verifying session:', error);
      return null;
    }

    if (!data) {
      console.warn('[Admin/Auth] Session token not found');
      return null;
    }

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    if (now > expiresAt) {
      console.warn('[Admin/Auth] Session expired');
      // Clean up expired session
      await destroySession(sessionToken);
      return null;
    }

    return data.client_id;
  } catch (error) {
    console.error('[Admin/Auth] Error verifying session:', error);
    return null;
  }
}

/**
 * Destroy a session (logout)
 *
 * Removes the session token from the database.
 *
 * @param sessionToken - Session token to destroy
 * @returns True if successful
 */
export async function destroySession(sessionToken: string): Promise<boolean> {
  if (!supabaseAdmin) {
    console.error('[Admin/Auth] Supabase admin client not available');
    return false;
  }

  try {
    const { error } = await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('session_token', sessionToken);

    if (error) {
      console.error('[Admin/Auth] Failed to destroy session:', error);
      return false;
    }

    console.log('[Admin/Auth] Session destroyed successfully');
    return true;
  } catch (error) {
    console.error('[Admin/Auth] Error destroying session:', error);
    return false;
  }
}

/**
 * Get session token from cookie
 *
 * Extracts the session token from the Cookie header.
 *
 * @param cookieHeader - Cookie header string from request
 * @returns Session token or null if not found
 */
export function getSessionFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) {
    return null;
  }

  // Parse cookie header
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies['admin_session'] || null;
}

/**
 * Create httpOnly cookie header for session
 *
 * Generates a Set-Cookie header string for the session token.
 *
 * @param sessionToken - Session token to store in cookie
 * @param maxAge - Cookie max age in seconds (default: 24 hours)
 * @returns Set-Cookie header string
 */
export function createSessionCookie(sessionToken: string, maxAge: number = 86400): string {
  // 86400 seconds = 24 hours
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? '; Secure' : '';
  return `admin_session=${sessionToken}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`;
}

/**
 * Create cookie header to destroy session
 *
 * @returns Set-Cookie header string that expires immediately
 */
export function destroySessionCookie(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? '; Secure' : '';
  return `admin_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`;
}
