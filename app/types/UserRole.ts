import type { Database } from '~~/database/types'

export type UserRole = Database['public']['Enums']['user_role']

export const USER_ROLES: readonly UserRole[] = ['super_admin', 'admin', 'member', 'supervisor']

export const DEFAULT_USER_ROLE: UserRole = 'member'
