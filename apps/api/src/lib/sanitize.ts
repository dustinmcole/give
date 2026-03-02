/**
 * Input sanitization utilities.
 *
 * Applied to string fields before further validation or persistence.
 */

// ─── ISO 4217 currency codes ──────────────────────────────
// Subset of the most common codes; extend as needed.
const ISO_4217_CODES = new Set([
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
  "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
  "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
  "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
  "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD",
  "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS",
  "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR",
  "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD",
  "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU",
  "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK",
  "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG",
  "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK",
  "SGD", "SHP", "SLL", "SOS", "SRD", "STN", "SVC", "SYP", "SZL", "THB",
  "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX",
  "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XOF",
  "XPF", "YER", "ZAR", "ZMW", "ZWL",
]);

// ─── String Helpers ───────────────────────────────────────

/** Trim leading/trailing whitespace. */
export function trimString(value: string): string {
  return value.trim();
}

/** Normalize email: trim + lowercase. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Strip HTML tags from a string.
 * Uses a simple regex — sufficient for MVP; replace with a library if XSS
 * from rich-text inputs becomes a concern.
 */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

/**
 * Validate that a string is a valid slug: lowercase alphanumeric + hyphens,
 * cannot start or end with a hyphen.
 */
export function isValidSlug(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) || /^[a-z0-9]$/.test(value);
}

/** Validate that a string is an ISO 4217 currency code (case-insensitive). */
export function isValidCurrencyCode(code: string): boolean {
  return ISO_4217_CODES.has(code.trim().toUpperCase());
}

// ─── Numeric Helpers ──────────────────────────────────────

/**
 * Validate an amount value (integer cents).
 * Rejects: negative, NaN, Infinity, non-integer.
 */
export function isValidAmount(amount: number): boolean {
  return (
    Number.isFinite(amount) &&
    Number.isInteger(amount) &&
    amount >= 0
  );
}

/**
 * Sanitize a currency code: trim and uppercase.
 * Returns null if not a valid ISO 4217 code.
 */
export function sanitizeCurrencyCode(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  return ISO_4217_CODES.has(normalized) ? normalized.toLowerCase() : null;
}
