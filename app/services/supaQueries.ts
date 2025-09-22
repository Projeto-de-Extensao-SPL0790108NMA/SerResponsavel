import type { CreateNewTask } from '@/types/CreateNewForm'
import type { QueryData, SupabaseClient } from '@supabase/supabase-js'

export const createTasksWithProjectsQuery = (supabase: SupabaseClient) =>
  supabase.from('tasks').select(`
    *,
    projects (
      id,
      name,
      slug
    )
  `)
export type TasksWithProjects = QueryData<ReturnType<typeof createTasksWithProjectsQuery>>

export const createProjectsQuery = (supabase: SupabaseClient) => supabase.from('projects').select()
export type Projects = QueryData<ReturnType<typeof createProjectsQuery>>

export const createProjectQuery = (supabase: SupabaseClient, slug: string) =>
  supabase
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

export type Project = QueryData<ReturnType<typeof createProjectQuery>>

export const createUpdateProjectQuery = (
  supabase: SupabaseClient,
  updatedProject = {},
  id: number,
) => {
  return supabase.from('projects').update(updatedProject).eq('id', id)
}

export const createTaskQuery = (supabase: SupabaseClient, id: number) => {
  return supabase
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
}
export type Task = QueryData<ReturnType<typeof createTaskQuery>>

export const createUpdateTaskQuery = (supabase: SupabaseClient, updatedTask = {}, id: number) => {
  return supabase.from('tasks').update(updatedTask).eq('id', id)
}

export const createDeleteTaskQuery = (supabase: SupabaseClient, id: number) => {
  return supabase.from('tasks').delete().eq('id', id)
}

export const createProfileQuery = (
  supabase: SupabaseClient,
  { column, value }: { column: string; value: string },
) => {
  return supabase.from('profiles').select().eq(column, value).single()
}

export const createProfilesQuery = (supabase: SupabaseClient) =>
  supabase.from('profiles').select(`id, full_name`)

export const createGroupedProfilesQuery = (supabase: SupabaseClient, userIds: string[]) =>
  supabase.from('profiles').select('username, avatar_url, id, full_name').in('id', userIds)
export type Collabs = QueryData<ReturnType<typeof createGroupedProfilesQuery>>

export const createNewTaskQuery = (supabase: SupabaseClient, newTask: CreateNewTask) => {
  return supabase.from('tasks').insert(newTask)
}
