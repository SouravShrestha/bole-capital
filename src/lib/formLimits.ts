// Shared between client forms and API routes. Keep free of server-only imports.

export const FORM_LIMITS = {
  name: 100,
  email: 254, // RFC 5321 max address length
  phone: 20,
  message: 300,
} as const;

/**
 * Hidden field rendered in forms; real users never fill it.
 * Deliberately meaningless: names like "website", "url" or "company" get
 * auto-filled by browsers/password managers, which flags real users as bots.
 */
export const HONEYPOT_FIELD = "bc_hp_field";
