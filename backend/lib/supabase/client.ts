/**
 * NeverMissLead - Supabase Client
 *
 * Typed Supabase client with Row Level Security (RLS) context support.
 * Provides helpers for setting client context before database operations.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

type PublicSchema = Database['public'];
type SupabaseDbClient = SupabaseClient<Database, 'public'>;

type TableRow<TableName extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][TableName]['Row'];
type TableInsert<TableName extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][TableName]['Insert'];
type FunctionArgs<FnName extends keyof PublicSchema['Functions']> =
  PublicSchema['Functions'][FnName]['Args'];

// ============================================================================
// CONFIGURATION
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// ============================================================================
// CLIENT INSTANCES
// ============================================================================

/**
 * Server-side Supabase client (uses anon key)
 * Should be used for server-side operations with RLS enabled.
 * Lazy-loaded to prevent instantiation in browser.
 */
let serverClient: SupabaseDbClient | null = null;

function getServerClient(): SupabaseDbClient {
  // Only create if on server OR if not yet created
  if (!serverClient) {
    serverClient = createClient<Database, 'public'>(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        auth: {
          persistSession: false, // Don't persist session for server-side operations
          autoRefreshToken: false,
        },
      }
    ) as unknown as SupabaseDbClient;
  }
  return serverClient;
}

/**
 * Export for backward compatibility
 * Use getServerClient() for server-side operations
 * Use getBrowserClient() for client-side operations
 */
export const supabase: SupabaseDbClient = new Proxy({} as SupabaseDbClient, {
  get: (target, prop) => {
    const client = typeof window === 'undefined' ? getServerClient() : getBrowserClient();
    if (!client) throw new Error('[Supabase] Client not initialized');
    return (client as any)[prop];
  }
});

/**
 * Browser-only Supabase client for client-side components
 * Supports Realtime subscriptions and browser-specific features.
 * Only initialized when running in browser context.
 */
let browserClient: SupabaseDbClient | null = null;

export function getBrowserClient(): SupabaseDbClient | null {
  // Only run in browser
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing instance (singleton pattern)
  if (browserClient) {
    return browserClient;
  }

  // Check for required env vars
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing credentials for browser client');
    return null;
  }

  // Create new browser client (only once)
  browserClient = createClient<Database, 'public'>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true, // Allow session persistence in browser
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10, // Rate limit for stability
      },
    },
  }) as unknown as SupabaseDbClient;

  return browserClient;
}

/**
 * Admin Supabase client (uses service role key)
 * Bypasses RLS - use ONLY for admin operations.
 * Never expose this to the client-side!
 */
export const supabaseAdmin: SupabaseDbClient | null = supabaseServiceKey
  ? createClient<Database, 'public'>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// ============================================================================
// RLS CONTEXT HELPERS
// ============================================================================

/**
 * Set the RLS context for a specific client
 * This must be called before any database operations to enforce data isolation.
 *
 * @param clientId - UUID of the client
 * @returns Promise that resolves when context is set
 *
 * @example
 * ```ts
 * await setClientContext('123e4567-e89b-12d3-a456-426614174000');
 * const { data } = await supabase.from('leads').select('*');
 * // Will only return leads for the specified client
 * ```
 */
export async function setClientContext(clientId: string): Promise<void> {
  const args: FunctionArgs<'set_client_context'> = {
    p_client_id: clientId,
  };

  const { error } = await supabase.rpc('set_client_context', args);

  if (error) {
    console.error('[Supabase] Error setting client context:', error);
    throw new Error(`Failed to set client context: ${error.message}`);
  }
}

/**
 * Clear the RLS context (for system/admin operations)
 * After calling this, queries will have no RLS restrictions.
 *
 * @returns Promise that resolves when context is cleared
 *
 * @example
 * ```ts
 * await clearClientContext();
 * const { data } = await supabaseAdmin.from('clients').select('*');
 * // Will return all clients (admin access)
 * ```
 */
export async function clearClientContext(): Promise<void> {
  const { error } = await supabase.rpc('clear_client_context');

  if (error) {
    console.error('[Supabase] Error clearing client context:', error);
    throw new Error(`Failed to clear client context: ${error.message}`);
  }
}

/**
 * Get the current client context UUID
 * Returns null if no context is set.
 *
 * @returns Promise that resolves with the current client UUID or null
 *
 * @example
 * ```ts
 * const clientId = await getClientContext();
 * if (clientId) {
 *   console.log('Current client:', clientId);
 * }
 * ```
 */
export async function getClientContext(): Promise<string | null> {
  const { data, error } = await supabase.rpc('get_client_context');

  if (error) {
    console.error('[Supabase] Error getting client context:', error);
    return null;
  }

  return data;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Execute a database operation with client context automatically set.
 * Context is cleared after the operation completes.
 *
 * @param clientId - UUID of the client
 * @param operation - Async function to execute with client context
 * @returns Promise that resolves with the operation result
 *
 * @example
 * ```ts
 * const leads = await withClientContext('client-uuid', async () => {
 *   const { data } = await supabase.from('leads').select('*');
 *   return data;
 * });
 * ```
 */
export async function withClientContext<T>(
  clientId: string,
  operation: () => Promise<T>
): Promise<T> {
  try {
    await setClientContext(clientId);
    const result = await operation();
    return result;
  } finally {
    await clearClientContext();
  }
}

/**
 * Get client by slug
 *
 * @param slug - Client slug (e.g., "nevermisslead")
 * @returns Promise that resolves with client data or null
 *
 * @example
 * ```ts
 * const client = await getClientBySlug('nevermisslead');
 * if (client) {
 *   console.log('Found client:', client.business_name);
 * }
 * ```
 */
export async function getClientBySlug(slug: string): Promise<TableRow<'clients'> | null> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available. Check SUPABASE_SERVICE_ROLE_KEY.');
  }

  const { data, error } = await supabaseAdmin
    .from('clients')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('[Supabase] Error fetching client by slug:', error);
    throw new Error(`Failed to fetch client: ${error.message}`);
  }

  return data ?? null;
}

/**
 * Get client by ID (admin operation)
 *
 * @param clientId - Client UUID
 * @returns Promise that resolves with client data or null
 *
 * @example
 * ```ts
 * const client = await getClientById('client-uuid');
 * if (client) {
 *   console.log('Found client:', client.business_name);
 * }
 * ```
 */
export async function getClientById(clientId: string): Promise<TableRow<'clients'> | null> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available. Check SUPABASE_SERVICE_ROLE_KEY.');
  }

  const { data, error } = await supabaseAdmin
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .maybeSingle();

  if (error) {
    console.error('[Supabase] Error fetching client by ID:', error);
    throw new Error(`Failed to fetch client: ${error.message}`);
  }

  return data ?? null;
}

/**
 * Create a new lead (with client context)
 *
 * @param leadData - Lead data to insert
 * @returns Promise that resolves with created lead
 *
 * @example
 * ```ts
 * const lead = await createLead({
 *   client_id: 'client-uuid',
 *   full_name: 'John Doe',
 *   phone: '+14045551234',
 *   email: 'john@example.com',
 *   source: 'website',
 * });
 * ```
 */
export async function createLead(
  leadData: TableInsert<'leads'>
): Promise<TableRow<'leads'>> {
  const { data, error } = await supabase
    .from('leads')
    .insert(leadData)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error creating lead:', error);
    throw new Error(`Failed to create lead: ${error.message}`);
  }

  if (!data) {
    throw new Error('Supabase returned no lead data after insert');
  }

  return data;
}

/**
 * Log a phone call
 *
 * @param callData - Call log data to insert
 * @returns Promise that resolves with created call log
 *
 * @example
 * ```ts
 * const callLog = await logCall({
 *   client_id: 'client-uuid',
 *   twilio_call_sid: 'CAxxxxxx',
 *   from_number: '+14045551234',
 *   to_number: '+14045554822',
 *   status: 'completed',
 * });
 * ```
 */
export async function logCall(callData: TableInsert<'call_logs'>): Promise<TableRow<'call_logs'>> {
  const { data, error } = await supabase
    .from('call_logs')
    .insert(callData)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error logging call:', error);
    throw new Error(`Failed to log call: ${error.message}`);
  }

  if (!data) {
    throw new Error('Supabase returned no call log data after insert');
  }

  return data;
}

/**
 * Log an SMS message
 *
 * @param smsData - SMS log data to insert
 * @returns Promise that resolves with created SMS log
 *
 * @example
 * ```ts
 * const smsLog = await logSMS({
 *   client_id: 'client-uuid',
 *   twilio_message_sid: 'SMxxxxxx',
 *   from_number: '+14045551234',
 *   to_number: '+14045554822',
 *   body: 'Hello!',
 *   status: 'delivered',
 * });
 * ```
 */
export async function logSMS(smsData: TableInsert<'sms_logs'>): Promise<TableRow<'sms_logs'>> {
  const { data, error } = await supabase
    .from('sms_logs')
    .insert(smsData)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error logging SMS:', error);
    throw new Error(`Failed to log SMS: ${error.message}`);
  }

  if (!data) {
    throw new Error('Supabase returned no SMS log data after insert');
  }

  return data;
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Test database connection
 * Returns true if connection is successful
 *
 * @example
 * ```ts
 * const isHealthy = await testConnection();
 * if (isHealthy) {
 *   console.log('Database connection successful');
 * }
 * ```
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('clients').select('id').limit(1);
    return !error;
  } catch (error) {
    console.error('[Supabase] Connection test failed:', error);
    return false;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { Database };
