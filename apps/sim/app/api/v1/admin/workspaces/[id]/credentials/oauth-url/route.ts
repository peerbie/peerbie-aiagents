/**
 * POST /api/v1/admin/workspaces/[id]/credentials/oauth-url
 *
 * Generate an OAuth authorization URL for a given provider.
 * Creates a pendingCredentialDraft so Better Auth's callback hook
 * automatically stores the credential in the workspace after OAuth.
 *
 * Body: { providerId: string }
 * Returns: { oauthUrl: string }
 *
 * Called by peerbie-brain when a user clicks "Connect [Tool]" in chat.
 * Uses a temporary session for the workspace owner to satisfy Better Auth's
 * oAuth2LinkAccount requirement, then deletes the session immediately.
 */

import { db } from '@sim/db'
import { pendingCredentialDraft, session, workspace } from '@sim/db/schema'
import { createLogger } from '@sim/logger'
import { and, eq, lt } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
} from '@/app/api/v1/admin/responses'
import { getAllOAuthServices } from '@/lib/oauth/utils'

const logger = createLogger('AdminOAuthUrlAPI')

const DRAFT_TTL_MS = 15 * 60 * 1000
const TEMP_SESSION_TTL_MS = 2 * 60 * 1000  // 2 min — only needed to get the URL

interface RouteParams {
  id: string
}

export const POST = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workspaceId } = await context.params

  let body: { providerId?: string }
  try {
    body = await request.json()
  } catch {
    return badRequestResponse('Invalid JSON body')
  }

  const providerId = (body.providerId || '').trim()
  if (!providerId) {
    return badRequestResponse('`providerId` is required')
  }

  // Validate provider exists
  const allServices = getAllOAuthServices()
  const service = allServices.find((s) => s.providerId === providerId)
  if (!service) {
    return badRequestResponse(`Unknown providerId: ${providerId}`)
  }

  try {
    // Get workspace and its owner
    const [ws] = await db
      .select({ id: workspace.id, ownerId: workspace.ownerId })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!ws) {
      return notFoundResponse('Workspace')
    }

    const userId = ws.ownerId
    const now = new Date()

    // Create pendingCredentialDraft so Better Auth's account.create.after
    // hook will create the workspace credential automatically
    const displayName = `${service.name} (Workspace)`
    await db
      .delete(pendingCredentialDraft)
      .where(
        and(
          eq(pendingCredentialDraft.userId, userId),
          eq(pendingCredentialDraft.providerId, providerId),
          eq(pendingCredentialDraft.workspaceId, workspaceId)
        )
      )
    await db.insert(pendingCredentialDraft).values({
      id: crypto.randomUUID(),
      userId,
      workspaceId,
      providerId,
      displayName,
      expiresAt: new Date(now.getTime() + DRAFT_TTL_MS),
      createdAt: now,
    })

    // Create a temporary session for the workspace owner so Better Auth
    // can generate the OAuth URL (requires authenticated user context).
    // Deleted immediately after getting the URL.
    const tempToken = crypto.randomUUID()
    const tempSessionId = crypto.randomUUID()
    await db.insert(session).values({
      id: tempSessionId,
      token: tempToken,
      userId,
      expiresAt: new Date(now.getTime() + TEMP_SESSION_TTL_MS),
      createdAt: now,
      updatedAt: now,
      ipAddress: 'peerbie-admin',
      userAgent: 'PeerBie Admin OAuth Init',
    })

    // callbackURL points to our dedicated success page that sends postMessage
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const callbackURL = `${appUrl}/peerbie-oauth-success?providerId=${encodeURIComponent(providerId)}`

    // Use temp session headers to satisfy Better Auth's session requirement
    const tempHeaders = new Headers({ cookie: `better-auth.session_token=${tempToken}` })

    const { auth } = await import('@/lib/auth/auth')
    const data = (await auth.api.oAuth2LinkAccount({
      body: { providerId, callbackURL },
      headers: tempHeaders,
    })) as { url?: string }

    // Clean up temp session — no longer needed
    await db.delete(session).where(eq(session.id, tempSessionId))

    if (!data?.url) {
      logger.error('oAuth2LinkAccount returned no URL', { workspaceId, providerId })
      return internalErrorResponse('Failed to generate OAuth URL')
    }

    logger.info(`Admin API: Generated OAuth URL for ${providerId} in workspace ${workspaceId}`)
    return NextResponse.json({ oauthUrl: data.url, providerId })
  } catch (error) {
    logger.error('Admin API: Failed to generate OAuth URL', { error, workspaceId, providerId })
    return internalErrorResponse('Failed to generate OAuth URL')
  }
})
