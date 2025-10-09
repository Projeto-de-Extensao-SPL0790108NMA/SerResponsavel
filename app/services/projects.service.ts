import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/database/types'
import { throwServiceError } from '@/utils/serviceLogger'
import type { ProjectRatingSummary } from '@/services/projectRatings.service'
import type { ProjectCommentSummary } from '@/services/projectComments.service'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type OrganizationRow = Database['public']['Tables']['organizations']['Row']
type RatingSummaryRow = Database['public']['Views']['project_rating_summaries']['Row']
type CommentSummaryRow = Database['public']['Views']['project_comment_summaries']['Row']

type ProjectWithFeedbackRow = {
  project: ProjectRow | null
  organization: OrganizationRow | null
  rating_summary: RatingSummaryRow | null
  comment_summary: CommentSummaryRow | null
}

export class ProjectsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  private normalizeRatingSummary(
    projectId: number | null | undefined,
    summary: RatingSummaryRow | null,
  ): ProjectRatingSummary | null {
    if (!Number.isFinite(projectId) || !summary) {
      return null
    }

    const ratingCountsSource = summary.rating_counts ?? {}
    const reactionCountsSource = summary.reaction_counts ?? {}

    const toNumber = (value: unknown) => {
      if (typeof value === 'number') return value
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : 0
    }

    return {
      projectId: projectId as number,
      average: toNumber(summary.average),
      total: toNumber(summary.total),
      ratingCounts: {
        1: toNumber((ratingCountsSource as Record<string, unknown>)['1']),
        2: toNumber((ratingCountsSource as Record<string, unknown>)['2']),
        3: toNumber((ratingCountsSource as Record<string, unknown>)['3']),
        4: toNumber((ratingCountsSource as Record<string, unknown>)['4']),
        5: toNumber((ratingCountsSource as Record<string, unknown>)['5']),
      },
      reactionCounts: Object.fromEntries(
        Object.entries(reactionCountsSource as Record<string, unknown>).map(([key, value]) => [
          key,
          toNumber(value),
        ]),
      ),
    }
  }

  private normalizeCommentSummary(
    projectId: number | null | undefined,
    summary: CommentSummaryRow | null,
  ): ProjectCommentSummary | null {
    if (!Number.isFinite(projectId) || !summary) {
      return null
    }

    const total = typeof summary.total === 'number' ? summary.total : Number(summary.total ?? 0)

    return {
      projectId: projectId as number,
      total,
      latestCommentAt: summary.latest_comment_at ?? null,
    }
  }

  async getProjects(status?: 'in-progress' | 'completed' | 'all') {
    const statusFilter = status && status !== 'all' ? status : null

    const { data, error } = await this.supabase.rpc('get_projects_with_feedback', {
      status_filter: statusFilter,
    })

    if (error) {
      throwServiceError('ProjectsService.getProjects', error)
    }

    const rows = (data ?? []) as ProjectWithFeedbackRow[]

    return rows
      .map((row) => {
        const project = row.project ?? null
        if (!project) {
          return null
        }

        const ratingSummary = this.normalizeRatingSummary(project.id, row.rating_summary)
        const commentSummary = this.normalizeCommentSummary(project.id, row.comment_summary)

        return {
          ...project,
          organization: row.organization ?? null,
          ratingSummary,
          commentSummary,
        }
      })
      .filter(
        (
          entry,
        ): entry is ProjectRow & {
          organization: OrganizationRow | null
          ratingSummary: ProjectRatingSummary | null
          commentSummary: ProjectCommentSummary | null
        } => Boolean(entry),
      )
  }

  async getCountConcludedProjects() {
    const { count, error } = await this.supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    if (error) {
      throwServiceError('ProjectsService.getCountConcludedProjects', error)
    }

    return count || 0
  }

  async getProject(slug: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select(
        `
        *,
        organization:organizations (*),
        tasks (
          id,
          name,
          status,
          due_date
        )
      `,
      )
      .eq('slug', slug)
      .single()

    if (error) throwServiceError('ProjectsService.getProject', error)
    return data
  }

  async createProject(project: {
    name: string
    slug: string
    description?: string
    status?: 'in-progress' | 'completed'
    collaborators?: string[]
    organization_id?: string | null
    cover_image_url?: string | null
    cover_image_path?: string | null
  }) {
    const payload = {
      ...project,
      organization_id: project.organization_id ?? null,
      cover_image_url: project.cover_image_url ?? null,
      cover_image_path: project.cover_image_path ?? null,
    }

    const { data, error } = await this.supabase
      .from('projects')
      .insert(payload)
      .select('*, organization:organizations (*)')
      .single()

    if (error) throwServiceError('ProjectsService.createProject', error)
    return data
  }

  async updateProject(
    id: number,
    updates: {
      name?: string
      slug?: string
      description?: string
      status?: 'in-progress' | 'completed'
      collaborators?: string[]
      organization_id?: string | null
      cover_image_url?: string | null
      cover_image_path?: string | null
    },
  ) {
    const payload: typeof updates & {
      organization_id?: string | null
      cover_image_url?: string | null
      cover_image_path?: string | null
    } = { ...updates }

    if (Object.prototype.hasOwnProperty.call(updates, 'organization_id')) {
      payload.organization_id = updates.organization_id ?? null
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'cover_image_url')) {
      payload.cover_image_url = updates.cover_image_url ?? null
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'cover_image_path')) {
      payload.cover_image_path = updates.cover_image_path ?? null
    }

    const { data, error } = await this.supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select('*, organization:organizations (*)')
      .single()

    if (error) throwServiceError('ProjectsService.updateProject', error)
    return data
  }

  async deleteProject(id: number) {
    const { data, error } = await this.supabase.from('projects').delete().eq('id', id)

    if (error) throwServiceError('ProjectsService.deleteProject', error)
    return data
  }
}
