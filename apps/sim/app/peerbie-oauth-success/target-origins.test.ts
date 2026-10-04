/**
 * @vitest-environment node
 */
import { describe, expect, it, vi } from 'vitest'
import {
  LOCAL_DEV_ORIGIN,
  PEERBIE_OPENER_ORIGINS,
  peerbieOpenerOrigins,
  postToPeerbieOpener,
} from './target-origins'

describe('peerbie-oauth-success target origins', () => {
  it('lists only the PeerBie web origins by default (no localhost, no *)', () => {
    const origins = peerbieOpenerOrigins(undefined)
    expect(origins).toEqual([...PEERBIE_OPENER_ORIGINS])
    expect(origins).not.toContain('*')
    expect(origins.some((o) => o.includes('localhost'))).toBe(false)
  })

  it('adds localhost only when the dev flag is exactly "true"', () => {
    expect(peerbieOpenerOrigins('true')).toContain(LOCAL_DEV_ORIGIN)
    expect(peerbieOpenerOrigins('1')).not.toContain(LOCAL_DEV_ORIGIN)
    expect(peerbieOpenerOrigins('false')).not.toContain(LOCAL_DEV_ORIGIN)
    expect(peerbieOpenerOrigins(null)).not.toContain(LOCAL_DEV_ORIGIN)
  })

  it('posts to each allowed origin by name, never to "*"', () => {
    const postMessage = vi.fn()
    const msg = { type: 'peerbie-credential-connected', providerId: 'shopify' }
    postToPeerbieOpener({ postMessage }, msg, peerbieOpenerOrigins(undefined))
    expect(postMessage).toHaveBeenCalledTimes(PEERBIE_OPENER_ORIGINS.length)
    for (const [sent, target] of postMessage.mock.calls) {
      expect(sent).toEqual(msg)
      expect(target).not.toBe('*')
      expect(PEERBIE_OPENER_ORIGINS).toContain(target)
    }
  })

  it('keeps going when one postMessage throws', () => {
    const postMessage = vi.fn().mockImplementationOnce(() => {
      throw new Error('gone')
    })
    postToPeerbieOpener({ postMessage }, {}, peerbieOpenerOrigins(undefined))
    expect(postMessage).toHaveBeenCalledTimes(PEERBIE_OPENER_ORIGINS.length)
  })
})
