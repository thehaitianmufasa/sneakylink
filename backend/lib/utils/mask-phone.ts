/**
 * Masks the last 4 digits of a phone number with 'xxxx' for demo sites
 * Example: "(678) 788-7281" becomes "(678) 788-xxxx"
 *
 * @param phoneNumber - The phone number to mask
 * @param isDemoSite - Whether this is a demo site (nevermisslead, hvac, plumbing, electrical)
 * @returns The masked phone number if it's a demo site, otherwise the original
 */
export function maskPhoneNumber(phoneNumber: string, isDemoSite: boolean): string {
  if (!isDemoSite || !phoneNumber) {
    return phoneNumber;
  }

  // Match common phone formats and replace last 4 digits with xxxx
  // Handles formats like: (678) 788-7281, 678-788-7281, 678.788.7281, etc.
  return phoneNumber.replace(/(\d{4})(?=\D*$)/, 'xxxx');
}

/**
 * Determines if the current slug represents a demo site
 * @param slug - The current page slug
 * @returns true if this is a demo site (nevermisslead/hvac, plumbing, electrical)
 */
export function isDemoSite(slug?: string): boolean {
  return slug === 'nevermisslead' || slug === 'hvac' || slug === 'plumbing' || slug === 'electrical';
}
