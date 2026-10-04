/**
 * Web origins allowed to receive this page's "connected" message
 * (window.opener.postMessage). The message is addressed to each origin by
 * name — never '*' — so a site that is not PeerBie but opened this popup
 * learns nothing. Mirrors the brain's OAUTH_POPUP_ORIGINS (peerbie-brain
 * #434). Security review for Google's CASA assessment, 2026-10-04.
 */
export const PEERBIE_OPENER_ORIGINS = [
  'https://my.peerbie.com',
  'https://staging.peerbie.com',
  'https://app.peerbie.com',
] as const

export const LOCAL_DEV_ORIGIN = 'http://localhost:4200'

/** Allowed opener origins; localhost only when the dev flag is exactly 'true'. */
export function peerbieOpenerOrigins(allowLocalhostFlag?: string | null): string[] {
  const origins: string[] = [...PEERBIE_OPENER_ORIGINS]
  if (allowLocalhostFlag === 'true') {
    origins.push(LOCAL_DEV_ORIGIN)
  }
  return origins
}

/**
 * Post `message` to `opener` once per allowed origin. A non-matching target
 * origin is silently dropped by the browser, so the real opener receives it
 * exactly once and any other opener receives nothing.
 */
export function postToPeerbieOpener(
  opener: Pick<Window, 'postMessage'>,
  message: unknown,
  origins: string[]
): void {
  for (const origin of origins) {
    try {
      opener.postMessage(message, origin)
    } catch {
      // ignore — the opener may be gone
    }
  }
}
