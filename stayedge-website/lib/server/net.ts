import dns from "node:dns";

/**
 * Prefer IPv4 DNS results for server-side fetches. On networks with
 * advertised-but-broken IPv6 (common on Indian ISPs and some routers), Node's
 * fetch hangs on the IPv6 route to external services (e.g. the n8n WEB-HEAD
 * gateway) while curl/browsers fall back silently. Imported for its side
 * effect by every API route that calls out.
 */
dns.setDefaultResultOrder("ipv4first");

export {};
