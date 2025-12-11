/**
 * NeverMissLead - Client Configuration Loader
 *
 * Server-only module for loading and validating client configurations.
 * Includes in-memory caching for performance.
 *
 * @package NeverMissLead
 * @version 1.0.0
 */

import 'server-only'; // Ensures this module only runs on the server

import fs from 'fs/promises';
import path from 'path';
import { ClientConfig } from '@shared/types/client-config';
import { ClientConfigSchema } from '@shared/schemas/client-config.schema';
import { cache } from 'react';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG_DIR = path.join(process.cwd(), 'shared', 'config', 'clients');
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes in production
const IS_DEV = process.env.NODE_ENV === 'development';

// ============================================================================
// TYPES
// ============================================================================

interface ConfigCacheEntry {
  config: ClientConfig;
  timestamp: number;
}

interface ConfigError {
  slug: string;
  error: string;
  timestamp: number;
}

// ============================================================================
// IN-MEMORY CACHE
// ============================================================================

const configCache = new Map<string, ConfigCacheEntry>();
const errorCache = new Map<string, ConfigError>();

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Clear the configuration cache (useful for development)
 */
export function clearConfigCache(): void {
  configCache.clear();
  errorCache.clear();
  console.log('[ConfigLoader] Cache cleared');
}

/**
 * Check if cached config is still valid
 */
function isCacheValid(entry: ConfigCacheEntry): boolean {
  if (IS_DEV) {
    // In development, cache for only 30 seconds for faster iteration
    return Date.now() - entry.timestamp < 30000;
  }
  return Date.now() - entry.timestamp < CACHE_TTL;
}

/**
 * Load raw JSON file from filesystem
 */
async function loadConfigFile(slug: string): Promise<unknown> {
  const filePath = path.join(CONFIG_DIR, `${slug}.json`);

  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContents);
    return jsonData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Config file not found for client: ${slug}`);
    }
    throw new Error(`Failed to load config file for ${slug}: ${(error as Error).message}`);
  }
}

/**
 * Validate config data using Zod schema
 */
function validateConfig(slug: string, data: unknown): ClientConfig {
  try {
    const validatedConfig = ClientConfigSchema.parse(data);

    // Additional runtime validation
    if (validatedConfig.slug !== slug) {
      throw new Error(`Config slug mismatch: expected "${slug}", got "${validatedConfig.slug}"`);
    }

    return validatedConfig;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Config validation failed for ${slug}: ${error.message}`);
    }
    throw new Error(`Unknown validation error for ${slug}`);
  }
}

/**
 * Get client configuration by slug (with caching)
 *
 * @param slug - Client slug (e.g., "nevermisslead")
 * @returns Validated client configuration
 * @throws Error if config not found or invalid
 *
 * @example
 * ```ts
 * const config = await getClientConfig('nevermisslead');
 * console.log(config.businessInfo.businessName);
 * ```
 */
export async function getClientConfig(slug: string): Promise<ClientConfig> {
  // Check if we have a recent error for this slug
  const cachedError = errorCache.get(slug);
  if (cachedError && Date.now() - cachedError.timestamp < 60000) {
    throw new Error(cachedError.error);
  }

  // Check cache first
  const cached = configCache.get(slug);
  if (cached && isCacheValid(cached)) {
    if (IS_DEV) {
      console.log(`[ConfigLoader] Cache HIT for "${slug}"`);
    }
    return cached.config;
  }

  if (IS_DEV) {
    console.log(`[ConfigLoader] Cache MISS for "${slug}" - loading from disk`);
  }

  try {
    // Load and validate config
    const rawData = await loadConfigFile(slug);
    const validatedConfig = validateConfig(slug, rawData);

    // Cache the result
    configCache.set(slug, {
      config: validatedConfig,
      timestamp: Date.now(),
    });

    // Clear any previous errors
    errorCache.delete(slug);

    console.log(`[ConfigLoader] Successfully loaded config for "${slug}"`);
    return validatedConfig;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Cache the error to avoid repeated failed lookups
    errorCache.set(slug, {
      slug,
      error: errorMessage,
      timestamp: Date.now(),
    });

    console.error(`[ConfigLoader] Error loading config for "${slug}":`, errorMessage);
    throw error;
  }
}

/**
 * React cache wrapper for getClientConfig
 * Ensures the same config is not loaded multiple times during a single render
 */
export const getCachedClientConfig = cache(getClientConfig);

/**
 * Get all available client slugs
 *
 * @returns Array of client slugs
 *
 * @example
 * ```ts
 * const slugs = await getAllClientSlugs();
 * // ['nevermisslead', 'client2', 'client3']
 * ```
 */
export async function getAllClientSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONFIG_DIR);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));
    const slugs = jsonFiles.map((file) => file.replace('.json', ''));

    return slugs;
  } catch (error) {
    console.error('[ConfigLoader] Error reading config directory:', error);
    return [];
  }
}

/**
 * Check if a client config exists
 *
 * @param slug - Client slug to check
 * @returns True if config exists
 *
 * @example
 * ```ts
 * const exists = await clientConfigExists('nevermisslead');
 * if (exists) {
 *   const config = await getClientConfig('nevermisslead');
 * }
 * ```
 */
export async function clientConfigExists(slug: string): Promise<boolean> {
  const filePath = path.join(CONFIG_DIR, `${slug}.json`);

  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Preload all client configs into cache (useful for build time)
 *
 * @returns Number of configs successfully loaded
 *
 * @example
 * ```ts
 * // In a build script or API route
 * const count = await preloadAllConfigs();
 * console.log(`Preloaded ${count} client configs`);
 * ```
 */
export async function preloadAllConfigs(): Promise<number> {
  const slugs = await getAllClientSlugs();
  let successCount = 0;

  for (const slug of slugs) {
    try {
      await getClientConfig(slug);
      successCount++;
    } catch (error) {
      console.error(`[ConfigLoader] Failed to preload config for "${slug}":`, error);
    }
  }

  console.log(`[ConfigLoader] Preloaded ${successCount}/${slugs.length} configs`);
  return successCount;
}

/**
 * Get cache statistics (useful for monitoring)
 *
 * @returns Cache statistics
 */
export function getCacheStats() {
  return {
    configCacheSize: configCache.size,
    errorCacheSize: errorCache.size,
    cachedConfigs: Array.from(configCache.keys()),
    cachedErrors: Array.from(errorCache.keys()),
  };
}

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

if (IS_DEV) {
  /**
   * Watch for config file changes in development
   * (This would require additional setup with chokidar or similar)
   */
  // TODO: Implement file watching for hot reload in development
}

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class ConfigNotFoundError extends Error {
  constructor(slug: string) {
    super(`Client configuration not found: ${slug}`);
    this.name = 'ConfigNotFoundError';
  }
}

export class ConfigValidationError extends Error {
  constructor(slug: string, details: string) {
    super(`Configuration validation failed for ${slug}: ${details}`);
    this.name = 'ConfigValidationError';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  type ClientConfig,
  type ConfigCacheEntry,
  type ConfigError,
};
