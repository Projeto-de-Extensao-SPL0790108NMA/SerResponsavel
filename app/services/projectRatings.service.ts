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
    const { data, error } = await this.supabase
      .from('project_ratings')
      .select('rating, reaction')
      .eq('project_id', projectId)

    if (error) {
      throwServiceError('ProjectRatingsService.fetchSummary', error)
    }

    if (!data || data.length === 0) {
      return this.buildEmptySummary(projectId)
    }

    const summary = this.buildEmptySummary(projectId)
    let ratingSum = 0

    data.forEach((row) => {
      const rating = row.rating
      if (rating >= 1 && rating <= 5) {
        ratingSum += rating
        summary.ratingCounts[rating] = (summary.ratingCounts[rating] ?? 0) + 1
      }

      if (row.reaction) {
        summary.reactionCounts[row.reaction] = (summary.reactionCounts[row.reaction] ?? 0) + 1
      }
    })

    summary.total = data.length
    summary.average = summary.total > 0 ? Number((ratingSum / summary.total).toFixed(2)) : 0

    return summary
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
