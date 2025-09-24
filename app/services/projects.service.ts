import type { SupabaseClient } from '@supabase/supabase-js'

export class ProjectsService {
  constructor(private supabase: SupabaseClient) {}

  async getProjects(status?: 'in-progress' | 'completed' | 'all') {
    let query = this.supabase.from('projects').select('*').order('created_at', { ascending: false })

    // Aplica filtro de status apenas se não for 'all'
    if (status && status !== 'all') {
      query = query.eq('status', status).not('status', 'is', null)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching projects:', error)
      throw error
    }

    // Filtro adicional no lado client como garantia (apenas se status específico)
    if (status && status !== 'all') {
      return data?.filter((project) => project.status === status) || []
    }

    return data || []
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
