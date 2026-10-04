'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { peerbieOpenerOrigins, postToPeerbieOpener } from './target-origins'

function OAuthSuccessContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const providerId = searchParams.get('providerId') || ''

    if (window.opener) {
      // Addressed to PeerBie's web origins by name — never '*' (see target-origins.ts).
      postToPeerbieOpener(
        window.opener,
        { type: 'peerbie-credential-connected', providerId },
        peerbieOpenerOrigins(process.env.NEXT_PUBLIC_PEERBIE_OPENER_ALLOW_LOCALHOST)
      )
      setTimeout(() => window.close(), 800)
    } else {
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

export default function PeerbieOAuthSuccessPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Connecting...</div>}>
      <OAuthSuccessContent />
    </Suspense>
  )
}
