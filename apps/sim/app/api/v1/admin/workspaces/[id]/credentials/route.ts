/**
 * GET /api/v1/admin/workspaces/[id]/credentials
 *
 * List credentials connected to a workspace (OAuth and env types).
 * Returns metadata only — no tokens or secrets.
 *
 * Used by peerbie-brain to check which integrations are already
 * connected before showing "Connect [Tool]" cards after hiring.
 */

import { db } from '@sim/db'
import { credential, workspace } from '@sim/db/schema'
import { createLogger } from '@sim/logger'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import { internalErrorResponse, notFoundResponse } from '@/app/api/v1/admin/responses'

const logger = createLogger('AdminWorkspaceCredentialsAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workspaceId } = await context.params

  try {
    const [ws] = await db
      .select({ id: workspace.id })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!ws) {
      return notFoundResponse('Workspace')
    }

    const creds = await db
      .select({
        id: credential.id,
        providerId: credential.providerId,
        displayName: credential.displayName,
        type: credential.type,
      })
      .from(credential)
      .where(eq(credential.workspaceId, workspaceId))

    logger.info(`Admin API: Listed ${creds.length} credentials for workspace ${workspaceId}`)

    return NextResponse.json({ credentials: creds })
  } catch (error) {
    logger.error('Admin API: Failed to list workspace credentials', { error, workspaceId })
    return internalErrorResponse('Failed to list workspace credentials')
  }
})
