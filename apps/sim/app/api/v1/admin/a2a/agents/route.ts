/**
 * POST /api/v1/admin/a2a/agents
 *
 * Create an A2A agent for a workflow — admin key authenticated.
 * Used by peerbie-brain's provision_studio_agent tool so Lucy can
 * auto-provision fully-wired agents without a user session or internal JWT.
 *
 * Request Body:
 *   {
 *     workspaceId: string,
 *     workflowId: string,
 *     name?: string,
 *     description?: string
 *   }
 *
 * Response: { id, name, url, workflowId, workspaceId }
 */

import { db } from '@sim/db'
import { a2aAgent, workflow, workspace } from '@sim/db/schema'
import { createLogger } from '@sim/logger'
import { and, eq, isNull } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { generateSkillsFromWorkflow } from '@/lib/a2a/agent-card'
import { A2A_DEFAULT_CAPABILITIES } from '@/lib/a2a/constants'
import { sanitizeAgentName } from '@/lib/a2a/utils'
import { env } from '@/lib/core/config/env'
import { loadWorkflowFromNormalizedTables } from '@/lib/workflows/persistence/utils'
import { hasValidStartBlockInState } from '@/lib/workflows/triggers/trigger-utils'
import { withAdminAuth } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
} from '@/app/api/v1/admin/responses'

const logger = createLogger('AdminA2AAgentsAPI')

export const POST = withAdminAuth(async (request) => {
  try {
    const body = await request.json()
    const { workspaceId, workflowId, name, description } = body

    if (!workspaceId || !workflowId) {
      return badRequestResponse('workspaceId and workflowId are required')
    }

    // Verify workspace exists
    const [ws] = await db
      .select({ id: workspace.id, ownerId: workspace.ownerId })
      .from(workspace)
      .where(and(eq(workspace.id, workspaceId), isNull(workspace.archivedAt)))
      .limit(1)

    if (!ws) {
      return notFoundResponse('Workspace')
    }

    // Verify workflow exists and is deployed
    const [wf] = await db
      .select({ id: workflow.id, name: workflow.name, description: workflow.description, isDeployed: workflow.isDeployed })
      .from(workflow)
      .where(and(eq(workflow.id, workflowId), eq(workflow.workspaceId, workspaceId)))
      .limit(1)

    if (!wf) {
      return notFoundResponse('Workflow')
    }

    if (!wf.isDeployed) {
      return badRequestResponse('Workflow must be deployed before exposing as an A2A agent')
    }

    // Check if A2A agent already exists for this workflow
    const [existing] = await db
      .select({ id: a2aAgent.id })
      .from(a2aAgent)
      .where(and(eq(a2aAgent.workflowId, workflowId), eq(a2aAgent.workspaceId, workspaceId), isNull(a2aAgent.archivedAt)))
      .limit(1)

    if (existing) {
      const agentUrl = `${env.NEXT_PUBLIC_APP_URL}/api/a2a/serve/${existing.id}`
      logger.info(`Admin A2A: reusing existing agent id=${existing.id} for workflow=${workflowId}`)
      return NextResponse.json({
        id: existing.id,
        url: agentUrl,
        workflowId,
        workspaceId,
        reused: true,
      })
    }

    // Load workflow state to generate skills
    const normalizedData = await loadWorkflowFromNormalizedTables(workflowId)
    if (!normalizedData) {
      return badRequestResponse('Workflow has no saved state — deploy the workflow first')
    }

    const hasStart = hasValidStartBlockInState(normalizedData.blocks)
    if (!hasStart) {
      return badRequestResponse('Workflow must have a Start block to be exposed as an A2A agent')
    }

    const agentId = uuidv4()
    const agentName = sanitizeAgentName(name || wf.name)
    const skills = generateSkillsFromWorkflow(
      agentName,
      description || wf.description || '',
      []
    )

    await db.insert(a2aAgent).values({
      id: agentId,
      workspaceId,
      workflowId,
      createdBy: ws.ownerId,
      name: agentName,
      description: description || wf.description || '',
      capabilities: A2A_DEFAULT_CAPABILITIES,
      skills,
      authentication: { schemes: ['bearer', 'apiKey'] },
      isPublished: true,
    })

    const agentUrl = `${env.NEXT_PUBLIC_APP_URL}/api/a2a/serve/${agentId}`
    logger.info(`Admin A2A: created agent id=${agentId} name=${agentName} workflow=${workflowId}`)

    return NextResponse.json({
      id: agentId,
      name: agentName,
      url: agentUrl,
      workflowId,
      workspaceId,
    }, { status: 201 })

  } catch (error) {
    logger.error('Admin A2A agent creation failed:', error)
    return internalErrorResponse('Failed to create A2A agent')
  }
})
