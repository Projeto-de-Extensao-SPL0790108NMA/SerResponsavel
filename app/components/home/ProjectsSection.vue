<template>
  <div class="projects-section">
    <v-card elevation="12" rounded="xl" class="pa-4">
      <v-tabs v-model="activeTab" grow class="projects-tabs" density="comfortable">
        <v-tab
          v-for="tab in tabsWithCount"
          :key="tab.value"
          :value="tab.value"
          class="text-capitalize"
        >
          {{ tab.label }}
          <v-chip size="x-small" variant="tonal" color="primary" class="ms-2">
            {{ tab.count }}
          </v-chip>
        </v-tab>
      </v-tabs>

      <v-card-text class="pt-6">
        <v-row class="mb-4" align="center" no-gutters>
          <v-col cols="12" md="6" class="pe-md-4 mb-3 mb-md-0">
            <v-text-field
              v-model="searchQuery"
              label="Buscar projetos"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              clearable
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end align-center gap-2">
            <v-tooltip v-if="canCreateProjects" text="Cadastrar novo projeto" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  color="primary"
                  size="small"
                  rounded="xl"
                  class="text-none"
                  prepend-icon="mdi-plus"
                  @click="openCreateDialog"
                >
                  Novo projeto
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Atualizar lista" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  variant="outlined"
                  size="small"
                  rounded="xl"
                  class="text-none"
                  prepend-icon="mdi-refresh"
                  :loading="isBusy"
                  @click="handleRefresh"
                >
                  Atualizar
                </v-btn>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-alert v-if="storeError" type="error" variant="tonal" class="mb-4" border="start">
          <v-icon icon="mdi-alert-circle" start />
          {{ storeError }}
        </v-alert>

        <v-data-table
          :headers="tableHeaders"
          :items="filteredProjects"
          :loading="isBusy"
          item-value="id"
          :items-per-page="10"
          density="comfortable"
          class="elevation-0 projects-table"
        >
          <template #[`item.status`]="{ item }">
            <v-chip
              size="small"
              :color="statusColorMap[item.status] ?? 'info'"
              class="text-capitalize"
              variant="tonal"
            >
              {{ statusLabelMap[item.status] ?? item.status }}
            </v-chip>
          </template>

          <template #[`item.organization`]="{ item }">
            <div class="d-flex align-center gap-2">
              <v-avatar v-if="item.organization?.logo_url" size="24">
                <v-img
                  :src="item.organization?.logo_url"
                  :alt="item.organization?.name ?? 'Organização'"
                />
              </v-avatar>
              <span>{{ item.organization?.name ?? 'Sem organização' }}</span>
            </div>
          </template>

          <template #[`item.created_at`]="{ item }">
            {{ formatDate(item.created_at) }}
          </template>

          <template #[`item.actions`]="{ item }">
            <div class="d-flex align-center justify-end gap-1">
              <v-tooltip text="Ver detalhes" location="top">
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="tooltipProps"
                    icon
                    variant="text"
                    size="small"
                    @click="openDetailsDialog(item)"
                  >
                    <v-icon icon="mdi-information-outline" />
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip
                v-if="canEditProjects(item.organization_id)"
                text="Editar projeto"
                location="top"
              >
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="tooltipProps"
                    icon
                    variant="text"
                    size="small"
                    color="primary"
                    @click="openEditDialog(item)"
                  >
                    <v-icon icon="mdi-pencil-outline" />
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip
                v-if="canDeleteProjects(item.organization_id)"
                text="Excluir projeto"
                location="top"
              >
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="tooltipProps"
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    @click="confirmDeleteProject(item)"
                  >
                    <v-icon icon="mdi-trash-can-outline" />
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>

          <template #loading>
            <div class="d-flex justify-center py-6">
              <v-progress-circular indeterminate color="primary" />
            </div>
          </template>

          <template #no-data>
            <div class="text-center py-6">
              <v-icon icon="mdi-folder-open" size="48" color="grey" class="mb-2" />
              <p class="mb-0">{{ noDataMessage }}</p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isDialogOpen" max-width="720" persistent>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{ dialogTitle }}</span>
          <v-btn icon variant="text" @click="closeDialog">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <template v-if="dialogMode === 'details' && selectedProject">
          <v-card-text>
            <ProjectDetails :project="selectedProject" />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn variant="text" @click="closeDialog">Fechar</v-btn>
            <v-btn
              v-if="canEditProjects(selectedProject.organization_id)"
              color="primary"
              variant="tonal"
              prepend-icon="mdi-pencil-outline"
              @click="openEditDialog(selectedProject)"
            >
              Editar
            </v-btn>
          </v-card-actions>
        </template>
        <template v-else-if="isFormMode">
          <v-card-text>
            <v-alert
              v-if="formError"
              type="error"
              variant="tonal"
              class="mb-4"
              density="comfortable"
            >
              {{ formError }}
            </v-alert>
            <ProjectForm
              :mode="isFormMode"
              :project="isFormMode === 'edit' ? selectedProject : null"
              :loading="isSaving"
              @cancel="closeDialog"
              @submit="handleProjectSubmit"
            />
          </v-card-text>
        </template>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title class="text-h6">Confirmar exclusão</v-card-title>
        <v-card-text>
          Tem certeza de que deseja remover o projeto
          <strong>{{ projectToDelete?.name }}</strong
          >? Essa ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="closeDeleteDialog">Cancelar</v-btn>
          <v-btn color="error" :loading="storeLoading" @click="handleDeleteProject">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="bottom">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import ProjectDetails from '@/components/projects/ProjectDetails.vue'
import ProjectForm from '@/components/projects/ProjectForm.vue'
import { usePermissions } from '@/composables/usePermissions'
import { useProjectCoverStorage } from '@/composables/useProjectCoverStorage'
import type { ProjectStatusFilter, ProjectWithRelations } from '@/stores/projects'

const projectsStore = useProjectsStore()
const { loading: storeLoading, error: storeError } = storeToRefs(projectsStore)
const { canCreateProjects, canEditProjects, canDeleteProjects } = usePermissions()
const {
  uploadCover,
  removeCover: removeCoverFromStorage,
  loading: coverUploadLoading,
} = useProjectCoverStorage()

type DialogMode = 'create' | 'edit' | 'details'
type ProjectFormPayload = {
  name: string
  slug: string
  description?: string
  status: ProjectWithRelations['status']
  organizationId?: string | null
  coverFile?: File | null
  removeCover?: boolean
}

type ProjectMutationPayload = {
  name: string
  slug: string
  description?: string
  status?: ProjectWithRelations['status']
  organization_id?: string | null
  collaborators?: string[]
  cover_image_url?: string | null
  cover_image_path?: string | null
}

const statusLabelMap: Record<ProjectStatusFilter, string> = {
  'in-progress': 'Em progresso',
  completed: 'Concluído',
  all: 'Todos',
}

const statusColorMap: Record<string, string> = {
  'in-progress': 'warning',
  completed: 'success',
}

const statusTabs: Array<{ label: string; value: ProjectStatusFilter }> = [
  { label: 'Em Progresso', value: 'in-progress' },
  { label: 'Concluídos', value: 'completed' },
  { label: 'Todos', value: 'all' },
]

const tableHeaders = [
  { key: 'name', title: 'Projeto', sortable: true },
  { key: 'description', title: 'Descrição', sortable: false },
  { key: 'status', title: 'Status', sortable: true },
  { key: 'organization', title: 'Organização', sortable: false },
  { key: 'created_at', title: 'Criado em', sortable: true },
  { key: 'actions', title: 'Ações', sortable: false },
]

const activeTab = ref<ProjectStatusFilter>('in-progress')
const searchQuery = ref('')
const tabProjects = ref<ProjectWithRelations[]>([])
const isTabLoading = ref(false)

const dialogMode = ref<DialogMode | null>(null)
const selectedProject = ref<ProjectWithRelations | null>(null)
const formError = ref<string | null>(null)
const deleteDialog = ref(false)
const projectToDelete = ref<ProjectWithRelations | null>(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref<'success' | 'error'>('success')

const isDialogOpen = computed(() => dialogMode.value !== null)
const isFormMode = computed(() =>
  dialogMode.value === 'create' || dialogMode.value === 'edit' ? dialogMode.value : null,
)
const dialogTitle = computed(() => {
  if (dialogMode.value === 'create') return 'Cadastrar projeto'
  if (dialogMode.value === 'edit') return 'Editar projeto'
  if (dialogMode.value === 'details') {
    return selectedProject.value?.name
      ? `Detalhes • ${selectedProject.value.name}`
      : 'Detalhes do projeto'
  }
  return ''
})

const isBusy = computed(() => storeLoading.value || isTabLoading.value)
const isSaving = computed(() => storeLoading.value || coverUploadLoading.value)

const applyProjects = (projects: ProjectWithRelations[] | null | undefined) => {
  tabProjects.value = projects ? [...projects] : []
}

const loadProjects = async (status: ProjectStatusFilter, forceRefresh = false) => {
  const cached = projectsStore.getCachedProjects(status)

  if (cached && !forceRefresh) {
    applyProjects(cached)
    return
  }

  if (!cached || forceRefresh) {
    tabProjects.value = cached ? [...cached] : []
  }

  isTabLoading.value = true
  try {
    const data = await projectsStore.fetchProjects(forceRefresh, status)
    applyProjects(data ?? [])
  } finally {
    isTabLoading.value = false
  }
}

const handleRefresh = () => {
  void loadProjects(activeTab.value, true)
}

const showSnackbar = (message: string, color: 'success' | 'error' = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

const closeDialog = () => {
  dialogMode.value = null
  selectedProject.value = null
  formError.value = null
}

const openCreateDialog = () => {
  projectsStore.clearError()
  formError.value = null
  selectedProject.value = null
  dialogMode.value = 'create'
}

const openEditDialog = (project: ProjectWithRelations) => {
  projectsStore.clearError()
  formError.value = null
  selectedProject.value = project
  dialogMode.value = 'edit'
}

const openDetailsDialog = (project: ProjectWithRelations) => {
  projectsStore.clearError()
  formError.value = null
  selectedProject.value = project
  dialogMode.value = 'details'
}

const handleProjectSubmit = async (payload: ProjectFormPayload) => {
  if (!dialogMode.value) {
    return
  }

  projectsStore.clearError()
  formError.value = null

  const { coverFile, removeCover = false, ...projectData } = payload

  let uploadedCover: { path: string; url: string } | null = null
  const previousCoverPath = selectedProject.value?.cover_image_path ?? null
  const shouldRemovePreviousAfterUpdate = Boolean(
    selectedProject.value && (removeCover || coverFile) && previousCoverPath,
  )

  const basePayload: ProjectMutationPayload = {
    name: projectData.name,
    slug: projectData.slug,
    status: projectData.status,
    organization_id: projectData.organizationId ?? null,
  }

  if (projectData.description !== undefined) {
    basePayload.description = projectData.description
  }

  try {
    if (coverFile) {
      uploadedCover = await uploadCover(coverFile, projectData.slug)
      basePayload.cover_image_url = uploadedCover.url
      basePayload.cover_image_path = uploadedCover.path
    } else if (removeCover) {
      basePayload.cover_image_url = null
      basePayload.cover_image_path = null
    }

    let result: ProjectWithRelations | null = null

    if (dialogMode.value === 'create') {
      result = await projectsStore.addProject(basePayload)

      if (!result) {
        if (uploadedCover) {
          await removeCoverFromStorage(uploadedCover.path)
        }
        formError.value = storeError.value ?? 'Não foi possível cadastrar o projeto no momento.'
        return
      }

      showSnackbar('Projeto criado com sucesso!')
    }

    if (dialogMode.value === 'edit' && selectedProject.value) {
      result = await projectsStore.editProject(selectedProject.value.id, basePayload)

      if (!result) {
        if (uploadedCover) {
          await removeCoverFromStorage(uploadedCover.path)
        }
        formError.value = storeError.value ?? 'Não foi possível atualizar o projeto.'
        return
      }

      if (shouldRemovePreviousAfterUpdate && previousCoverPath) {
        await removeCoverFromStorage(previousCoverPath)
      }

      showSnackbar('Projeto atualizado com sucesso!')
    }

    closeDialog()
    await loadProjects(activeTab.value, true)
  } catch (error) {
    if (uploadedCover) {
      await removeCoverFromStorage(uploadedCover.path)
    }
    formError.value =
      error instanceof Error ? error.message : 'Não foi possível processar a imagem.'
  }
}

const confirmDeleteProject = (project: ProjectWithRelations) => {
  projectsStore.clearError()
  projectToDelete.value = project
  deleteDialog.value = true
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
  projectToDelete.value = null
}

const handleDeleteProject = async () => {
  if (!projectToDelete.value) {
    return
  }

  projectsStore.clearError()
  const coverPath = projectToDelete.value.cover_image_path
  const success = await projectsStore.removeProject(projectToDelete.value.id)

  if (!success) {
    showSnackbar(storeError.value ?? 'Não foi possível excluir o projeto.', 'error')
    return
  }

  showSnackbar('Projeto excluído com sucesso!')
  closeDeleteDialog()
  if (coverPath) {
    await removeCoverFromStorage(coverPath)
  }
  await loadProjects(activeTab.value, true)
}

const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return tabProjects.value
  }

  return tabProjects.value.filter((project) => {
    const nameMatch = project.name?.toLowerCase().includes(query)
    const descriptionMatch = project.description?.toLowerCase().includes(query)
    const organizationMatch = project.organization?.name?.toLowerCase().includes(query)
    return Boolean(nameMatch || descriptionMatch || organizationMatch)
  })
})

const tabCounts = computed<Record<ProjectStatusFilter, number>>(() => {
  const allProjects = projectsStore.getCachedProjects('all') ?? []
  const inProgressCache = projectsStore.getCachedProjects('in-progress')
  const completedCache = projectsStore.getCachedProjects('completed')

  return {
    all: allProjects.length,
    'in-progress': inProgressCache
      ? inProgressCache.length
      : allProjects.filter((project) => project.status === 'in-progress').length,
    completed: completedCache
      ? completedCache.length
      : allProjects.filter((project) => project.status === 'completed').length,
  }
})

const tabsWithCount = computed(() =>
  statusTabs.map((tab) => ({
    ...tab,
    count: tabCounts.value[tab.value] ?? 0,
  })),
)

const noDataMessage = computed(() => {
  if (searchQuery.value) {
    return 'Nenhum projeto corresponde à sua busca.'
  }

  return activeTab.value === 'all'
    ? 'Nenhum projeto cadastrado até o momento.'
    : 'Nenhum projeto encontrado para este status.'
})

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'Não informado'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(dateString))
}

watch(activeTab, (status) => {
  void loadProjects(status)
})

onMounted(() => {
  void loadProjects(activeTab.value)
})
</script>

<style scoped>
.projects-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.projects-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.projects-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(25, 118, 210, 0.08);
}

.projects-table :deep(.v-data-table__th) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.projects-table :deep(.v-data-table__td) {
  vertical-align: middle;
}
</style>
