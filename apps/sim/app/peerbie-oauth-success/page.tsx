'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * OAuth success landing page for PeerBie-initiated credential connections.
 *
 * This page is the callbackURL for OAuth flows started by peerbie-brain
 * via the admin OAuth URL endpoint. After Better Auth processes the OAuth
 * callback and stores the credential, it redirects here.
 *
 * This page:
 * 1. Reads the providerId from the URL
 * 2. Notifies the PeerBie parent window via postMessage
 * 3. Closes the popup
 */
export default function PeerbieOAuthSuccessPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const providerId = searchParams.get('providerId') || ''

    if (window.opener) {
      window.opener.postMessage(
        { type: 'peerbie-credential-connected', providerId },
        '*'
      )
      setTimeout(() => window.close(), 800)
    } else {
      // Opened directly (not as popup) — redirect to workspace settings
      window.location.href = '/'
    }
  }, [searchParams])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        color: '#111',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>Connected!</div>
      <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
        Closing this window...
      </div>
    </div>
  )
}
