import type { UserRole } from '@/types/UserRole'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export const usePermissions = () => {
  const authStore = useAuthStore()
  const { role, isSuperAdmin, isAdmin, isSupervisor, organizationId } = storeToRefs(authStore)

  const hasRole = (allowed: UserRole | UserRole[]) => authStore.hasRole(allowed)

  const canViewRestrictedContent = computed(() => hasRole(['super_admin', 'admin', 'supervisor']))
  const isReadOnlySupervisor = computed(() => isSupervisor.value)

  const canManageOrganization = (targetOrganizationId?: string | null) => {
    if (isSuperAdmin.value) return true
    if (!isAdmin.value) return false

    const assignedOrganization = organizationId.value
    if (!assignedOrganization) return false

    if (targetOrganizationId === undefined || targetOrganizationId === null) {
      return true
    }

    return targetOrganizationId === assignedOrganization
  }

  const canCreateProjects = computed(() => canManageOrganization())
  const canEditProjects = (targetOrganizationId?: string | null) =>
    canManageOrganization(targetOrganizationId)
  const canDeleteProjects = canManageOrganization

  const assertRole = (allowed: UserRole | UserRole[]) => {
    if (!authStore.hasRole(allowed)) {
      throw new Error('User role does not meet the required permission.')
    }
  }

  return {
    role,
    organizationId,
    isSuperAdmin,
    isAdmin,
    isSupervisor,
    isReadOnlySupervisor,
    canViewRestrictedContent,
    canCreateProjects,
    canEditProjects,
    canDeleteProjects,
    canManageOrganization,
    hasRole,
    assertRole,
  }
}
