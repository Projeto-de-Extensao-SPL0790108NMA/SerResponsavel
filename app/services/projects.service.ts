import type { SupabaseClient } from '@supabase/supabase-js'

export class ProjectsService {
  constructor(private supabase: SupabaseClient) {}

  async getProjects() {
    const { data, error } = await this.supabase.from('projects').select()
    if (error) throw error
    return data
  }

  async getProject(slug: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select(
        `
        *,
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

    if (error) throw error
    return data
  }

  async createProject(project: {
    name: string
    slug: string
    description?: string
    status?: 'in-progress' | 'completed'
    collaborators?: string[]
  }) {
    const { data, error } = await this.supabase.from('projects').insert(project).select().single()

    if (error) throw error
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
    },
  ) {
    const { data, error } = await this.supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteProject(id: number) {
    const { data, error } = await this.supabase.from('projects').delete().eq('id', id)

    if (error) throw error
    return data
  }
}
