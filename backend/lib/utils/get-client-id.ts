/**
 * NeverMissLead - Client ID Resolver
 *
 * Utilities for resolving client_id from various sources:
 * - Slug (nevermisslead)
 * - Custom domain (nevermisslead.com)
 * - Subdomain (nevermisslead.nevermisslead.com)
 * - Request headers
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { headers } from 'next/headers';
import { getClientBySlug } from '../supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export interface ClientResolution {
  clientId: string | null;
  slug: string | null;
  source: 'slug' | 'domain' | 'subdomain' | 'header' | 'unknown';
}

// ============================================================================
// CLIENT ID RESOLUTION
// ============================================================================

/**
 * Get client ID from slug
 * This is the primary method used in the application.
 *
 * @param slug - Client slug (e.g., "nevermisslead")
 * @returns Promise that resolves with client ID or null
 *
 * @example
 * ```ts
 * const clientId = await getClientIdFromSlug('nevermisslead');
 * if (clientId) {
 *   await setClientContext(clientId);
 * }
 * ```
 */
export async function getClientIdFromSlug(slug: string): Promise<string | null> {
  try {
    const client = await getClientBySlug(slug);
    return client?.id || null;
  } catch (error) {
    console.error('[ClientResolver] Error resolving client by slug:', error);
    return null;
  }
}

/**
 * Get client ID from request headers
 * Checks Host header to determine client from domain/subdomain.
 *
 * @returns Promise that resolves with client resolution info
 *
 * @example
 * ```ts
 * const { clientId, source } = await getClientIdFromRequest();
 * if (clientId) {
 *   console.log(`Resolved client from ${source}`);
 * }
 * ```
 */
export async function getClientIdFromRequest(): Promise<ClientResolution> {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Parse domain/subdomain
  const { domain, subdomain } = parseDomain(host);

  // Try to resolve from subdomain first
  if (subdomain && subdomain !== 'www') {
    const clientId = await getClientIdFromSlug(subdomain);
    if (clientId) {
      return {
        clientId,
        slug: subdomain,
        source: 'subdomain',
      };
    }
  }

  // Try to resolve from full domain
  if (domain) {
    const clientId = await getClientIdFromDomain(domain);
    if (clientId) {
      return {
        clientId,
        slug: extractSlugFromDomain(domain),
        source: 'domain',
      };
    }
  }

  // Check for explicit client header (for development/testing)
  const clientHeader = headersList.get('x-client-slug');
  if (clientHeader) {
    const clientId = await getClientIdFromSlug(clientHeader);
    if (clientId) {
      return {
        clientId,
        slug: clientHeader,
        source: 'header',
      };
    }
  }

  return {
    clientId: null,
    slug: null,
    source: 'unknown',
  };
}

/**
 * Get client ID from custom domain
 * Looks up client by their custom domain field.
 *
 * @param domain - Custom domain (e.g., "nevermisslead.com")
 * @returns Promise that resolves with client ID or null
 *
 * @example
 * ```ts
 * const clientId = await getClientIdFromDomain('nevermisslead.com');
 * ```
 */
export async function getClientIdFromDomain(domain: string): Promise<string | null> {
  try {
    // Import dynamically to avoid circular dependencies
    const { supabaseAdmin } = await import('../supabase/client');

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not available');
    }

    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('custom_domain', domain)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data?.id ?? null;
  } catch (error) {
    console.error('[ClientResolver] Error resolving client by domain:', error);
    return null;
  }
}

// ============================================================================
// DOMAIN PARSING
// ============================================================================

/**
 * Parse domain and subdomain from host header
 *
 * @param host - Host header value (e.g., "nevermisslead.example.com:3000")
 * @returns Object with domain and subdomain
 *
 * @example
 * ```ts
 * parseDomain('nevermisslead.example.com');
 * // Returns: { domain: 'example.com', subdomain: 'nevermisslead' }
 *
 * parseDomain('example.com');
 * // Returns: { domain: 'example.com', subdomain: null }
 * ```
 */
export function parseDomain(host: string): { domain: string; subdomain: string | null } {
  // Remove port if present
  const cleanHost = host.split(':')[0];

  // Remove localhost and IP addresses
  if (
    cleanHost === 'localhost' ||
    cleanHost.startsWith('192.168.') ||
    cleanHost.startsWith('127.0.') ||
    /^\d+\.\d+\.\d+\.\d+$/.test(cleanHost)
  ) {
    return { domain: cleanHost, subdomain: null };
  }

  // Split by dots
  const parts = cleanHost.split('.');

  // Handle different cases
  if (parts.length === 1) {
    // Just domain (e.g., "localhost")
    return { domain: cleanHost, subdomain: null };
  } else if (parts.length === 2) {
    // domain.tld (e.g., "example.com")
    return { domain: cleanHost, subdomain: null };
  } else {
    // subdomain.domain.tld (e.g., "nevermisslead.example.com")
    const subdomain = parts[0];
    const domain = parts.slice(1).join('.');
    return { domain, subdomain };
  }
}

/**
 * Extract slug from domain
 * Removes TLD and domain parts to get the slug.
 *
 * @param domain - Domain name
 * @returns Extracted slug or null
 *
 * @example
 * ```ts
 * extractSlugFromDomain('nevermisslead.com'); // Returns: 'nevermisslead'
 * extractSlugFromDomain('example.com'); // Returns: 'example'
 * ```
 */
export function extractSlugFromDomain(domain: string): string | null {
  const parts = domain.split('.');
  if (parts.length >= 2) {
    return parts[0];
  }
  return null;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate that a client ID exists and is active
 *
 * @param clientId - Client UUID to validate
 * @returns Promise that resolves with true if valid
 *
 * @example
 * ```ts
 * const isValid = await isValidClientId('123e4567-e89b-12d3-a456-426614174000');
 * if (isValid) {
 *   // Proceed with operation
 * }
 * ```
 */
export async function isValidClientId(clientId: string): Promise<boolean> {
  try {
    const { supabaseAdmin } = await import('../supabase/client');

    if (!supabaseAdmin) {
      return false;
    }

    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('id, status')
      .eq('id', clientId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    return data.status === 'active';
  } catch (error) {
    console.error('[ClientResolver] Error validating client ID:', error);
    return false;
  }
}

// ============================================================================
// FALLBACK & DEFAULT
// ============================================================================

/**
 * Get default client ID
 * Returns the nevermisslead demo client by default.
 * Used as fallback when no client can be resolved.
 *
 * @returns Promise that resolves with default client ID
 *
 * @example
 * ```ts
 * const clientId = await getClientIdFromRequest();
 * const finalClientId = clientId.clientId || await getDefaultClientId();
 * ```
 */
export async function getDefaultClientId(): Promise<string | null> {
  return getClientIdFromSlug('nevermisslead');
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Resolve client ID with automatic fallback
 * Tries multiple resolution methods and falls back to default.
 *
 * @param slug - Optional slug to try first
 * @returns Promise that resolves with client ID (never null)
 *
 * @example
 * ```ts
 * const clientId = await resolveClientId('nevermisslead');
 * // Will always return a valid client ID or throw error
 * ```
 */
export async function resolveClientId(slug?: string): Promise<string> {
  // Try slug if provided
  if (slug) {
    const clientId = await getClientIdFromSlug(slug);
    if (clientId) {
      return clientId;
    }
  }

  // Try request headers
  const { clientId: requestClientId } = await getClientIdFromRequest();
  if (requestClientId) {
    return requestClientId;
  }

  // Fallback to default
  const defaultClientId = await getDefaultClientId();
  if (defaultClientId) {
    return defaultClientId;
  }

  throw new Error('Unable to resolve client ID and no default client available');
}

/**
 * Get client context for API routes
 * Convenience function that resolves client ID and returns necessary data.
 *
 * @returns Promise that resolves with client context
 *
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *   const { clientId, slug } = await getClientContext();
 *   // Use clientId for database operations
 * }
 * ```
 */
export async function getClientContext(): Promise<{
  clientId: string;
  slug: string;
  source: string;
}> {
  const resolution = await getClientIdFromRequest();

  if (!resolution.clientId) {
    // Try fallback
    const defaultClientId = await getDefaultClientId();
    if (!defaultClientId) {
      throw new Error('Unable to resolve client context');
    }

    return {
      clientId: defaultClientId,
      slug: 'nevermisslead',
      source: 'default',
    };
  }

  return {
    clientId: resolution.clientId,
    slug: resolution.slug || 'unknown',
    source: resolution.source,
  };
}
