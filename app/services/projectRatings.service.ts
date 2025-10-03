import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/database/types'
import { throwServiceError } from '@/utils/serviceLogger'

export type ProjectRatingRow = Database['public']['Tables']['project_ratings']['Row']

export type ProjectRatingSummary = {
  projectId: number
  average: number
  total: number
  ratingCounts: Record<number, number>
  reactionCounts: Record<string, number>
}

export class ProjectRatingsService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  private buildEmptySummary(projectId: number): ProjectRatingSummary {
    return {
      projectId,
      average: 0,
      total: 0,
      ratingCounts: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      reactionCounts: {},
    }
  }

  async fetchSummaries(projectIds: number[]): Promise<ProjectRatingSummary[]> {
    if (projectIds.length === 0) {
      return []
    }

    const uniqueIds = Array.from(new Set(projectIds))

    const { data, error } = await this.supabase
      .from('project_rating_summaries')
      .select('project_id, average, total, rating_counts, reaction_counts')
      .in('project_id', uniqueIds)

    if (error) {
      throwServiceError('ProjectRatingsService.fetchSummaries', error)
    }

    const summaryMap = new Map<number, ProjectRatingSummary>()

    uniqueIds.forEach((id) => {
      summaryMap.set(id, this.buildEmptySummary(id))
    })
    ;(data ?? []).forEach((row) => {
      const counts = row.rating_counts ?? {}
      const reactionCounts = row.reaction_counts ?? {}

      summaryMap.set(row.project_id, {
        projectId: row.project_id,
        average: typeof row.average === 'number' ? row.average : Number(row.average ?? 0),
        total: typeof row.total === 'number' ? row.total : Number(row.total ?? 0),
        ratingCounts: {
          1: Number((counts as Record<string, number>)['1'] ?? 0),
          2: Number((counts as Record<string, number>)['2'] ?? 0),
          3: Number((counts as Record<string, number>)['3'] ?? 0),
          4: Number((counts as Record<string, number>)['4'] ?? 0),
          5: Number((counts as Record<string, number>)['5'] ?? 0),
        },
        reactionCounts: Object.fromEntries(
          Object.entries(reactionCounts as Record<string, number>).map(([key, value]) => [
            key,
            Number(value ?? 0),
          ]),
        ),
      })
    })

    return Array.from(summaryMap.values())
  }

  async upsertRating(input: {
    projectId: number
    clientFingerprint: string
    rating: number
    reaction?: string | null
  }): Promise<ProjectRatingRow> {
    const payload = {
      project_id: input.projectId,
      client_fingerprint: input.clientFingerprint,
      rating: input.rating,
      reaction: input.reaction ?? null,
    }

    const { data, error } = await this.supabase
      .from('project_ratings')
      .upsert(payload, { onConflict: 'project_id,client_fingerprint' })
      .select()
      .single()

    if (error) {
      throwServiceError('ProjectRatingsService.upsertRating', error)
    }

    return data as ProjectRatingRow
  }

  async fetchSummary(projectId: number): Promise<ProjectRatingSummary> {
    const [summary] = await this.fetchSummaries([projectId])
    return summary ?? this.buildEmptySummary(projectId)
  }

  async fetchUserRating(
    projectId: number,
    clientFingerprint: string,
  ): Promise<ProjectRatingRow | null> {
    const { data, error } = await this.supabase
      .from('project_ratings')
      .select('*')
      .eq('project_id', projectId)
      .eq('client_fingerprint', clientFingerprint)
      .maybeSingle()

    if (error) {
      throwServiceError('ProjectRatingsService.fetchUserRating', error)
    }

    return (data as ProjectRatingRow | null) ?? null
  }
}
