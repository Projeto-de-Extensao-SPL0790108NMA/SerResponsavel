import type { CreateNewTask } from '@/types/CreateNewForm'
import type { SupabaseClient } from '@supabase/supabase-js'

export class TasksService {
  constructor(private supabase: SupabaseClient) {}

  async getTasksWithProjects() {
    const { data, error } = await this.supabase.from('tasks').select(`
      *,
      projects (
        id,
        name,
        slug
      )
    `)

    if (error) throw error
    return data
  }

  async getTask(id: number) {
    const { data, error } = await this.supabase
      .from('tasks')
      .select(
        `
        *,
        projects (
          id,
          name,
          slug
        )
      `,
      )
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async createTask(newTask: CreateNewTask) {
    const { data, error } = await this.supabase.from('tasks').insert(newTask).select().single()

    if (error) throw error
    return data
  }

  async updateTask(id: number, updatedTask: Partial<CreateNewTask>) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update(updatedTask)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteTask(id: number) {
    const { data, error } = await this.supabase.from('tasks').delete().eq('id', id)

    if (error) throw error
    return data
  }
}
