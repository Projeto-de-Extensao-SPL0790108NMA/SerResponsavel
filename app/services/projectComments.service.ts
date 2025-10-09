import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/database/types'
import { throwServiceError } from '@/utils/serviceLogger'

export type ProjectCommentRow = Database['public']['Tables']['project_comments']['Row']
export type ProjectCommentInsert = Database['public']['Tables']['project_comments']['Insert']

export type ProjectCommentSummary = {
  projectId: number
  total: number
  latestCommentAt: string | null
}

export class ProjectCommentsService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async fetchComments(projectId: number): Promise<ProjectCommentRow[]> {
    const { data, error } = await this.supabase
      .from('project_comments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (error) {
      throwServiceError('ProjectCommentsService.fetchComments', error)
    }

    return (data as ProjectCommentRow[]) ?? []
  }

  async addComment(input: ProjectCommentInsert): Promise<ProjectCommentRow> {
    const { data, error } = await this.supabase
      .from('project_comments')
      .insert(input)
      .select('*')
      .single()

    if (error) {
      throwServiceError('ProjectCommentsService.addComment', error)
    }

    return data as ProjectCommentRow
  }
}
