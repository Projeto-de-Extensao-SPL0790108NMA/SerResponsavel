import type { CreateNewTask } from '@/types/CreateNewForm'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/database/types'
import { throwServiceError } from '@/utils/serviceLogger'

export class TasksService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getTasksWithProjects() {
    const { data, error } = await this.supabase.from('tasks').select(`
      *,
      projects (
        id,
        name,
        slug
      )
    `)

    if (error) throwServiceError('TasksService.getTasksWithProjects', error)
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

    if (error) throwServiceError('TasksService.getTask', error)
    return data
  }

  async createTask(newTask: CreateNewTask) {
    const { data, error } = await this.supabase.from('tasks').insert(newTask).select().single()

    if (error) throwServiceError('TasksService.createTask', error)
    return data
  }

  async updateTask(id: number, updatedTask: Partial<CreateNewTask>) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update(updatedTask)
      .eq('id', id)
      .select()
      .single()

    if (error) throwServiceError('TasksService.updateTask', error)
    return data
  }

  async deleteTask(id: number) {
    const { data, error } = await this.supabase.from('tasks').delete().eq('id', id)

    if (error) throwServiceError('TasksService.deleteTask', error)
    return data
  }
}
