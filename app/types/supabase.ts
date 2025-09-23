import type { ProjectsService } from '@/services/projects.service'
import type { TasksService } from '@/services/tasks.service'
import type { AuthService } from '@/services/auth.service'

export type Projects = Awaited<ReturnType<ProjectsService['getProjects']>>
export type Project = Awaited<ReturnType<ProjectsService['getProject']>>
export type Task = Awaited<ReturnType<TasksService['getTask']>>
export type TasksWithProjects = Awaited<ReturnType<TasksService['getTasksWithProjects']>>
export type Collabs = Awaited<ReturnType<AuthService['getGroupedProfiles']>>
