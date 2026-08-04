import type { NextConfig } from "next";

/**
 * Origin of the Express API, used ONLY as the rewrite target below (it is never
 * shipped to the browser). Falls back to the origin of the existing
 * NEXT_PUBLIC_API_BASE_URL so this needs no new environment variable to deploy.
 */
function apiOrigin(): string {
  const explicit = process.env.API_PROXY_ORIGIN;
  if (explicit) return explicit.replace(/\/+$/, "");
  const publicBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (publicBase) {
    try {
      return new URL(publicBase).origin;
    } catch {
      /* malformed — fall through to the dev default */
    }
  }
  return "http://localhost:4000";
}

const nextConfig: NextConfig = {
  /**
   * Same-origin API proxy. This is load-bearing for authentication, not a
   * convenience.
   *
   * The refresh token is an httpOnly cookie with SameSite=Strict (see
   * server/src/modules/auth/auth.controller.ts refreshCookieOptions). A browser
   * withholds a Strict cookie from every cross-site request, and on Vercel the
   * app and the API *are* cross-site: `vercel.app` is on the Public Suffix List,
   * so `apex-….vercel.app` and `apex-server-….vercel.app` are two different
   * registrable domains. The cookie was therefore never sent to
   * POST /api/v1/auth/refresh in production, so a new tab — or any reload — could
   * not restore the session and fell through to "Sign in".
   *
   * Proxying /api/v1/* through the app's own origin makes every credentialed call
   * same-origin, which keeps the cookie attached without weakening it to
   * SameSite=None (that would opt the cookie back into cross-site delivery and
   * lean entirely on the custom-header check for CSRF protection). The cookie's
   * path=/api/v1/auth still matches, because the browser-facing path is unchanged.
   *
   * Server-side callers (src/lib/catalog.ts RSC reads, src/lib/service-area) keep
   * using the absolute NEXT_PUBLIC_API_BASE_URL: they run outside a browser, where
   * a relative URL has no origin to resolve against and the proxy hop would buy
   * nothing.
   */
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${apiOrigin()}/api/v1/:path*` }];
  },
};

export default nextConfig;
