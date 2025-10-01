<template>
  <div class="organizations-section">
    <v-card class="organizations-card" elevation="12" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center flex-wrap gap-3">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-domain" color="primary" />
          <span class="text-subtitle-1 font-weight-medium">Organizações vinculadas</span>
        </div>
        <v-chip size="small" variant="tonal" color="primary">
          {{ organizationSummaries.length }}
          {{ organizationSummaries.length === 1 ? 'organização' : 'organizações' }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <v-row class="mb-4" align="center" no-gutters>
          <v-col cols="12" md="6" class="pe-md-4 mb-3 mb-md-0">
            <v-text-field
              v-model="searchQuery"
              label="Buscar organizações"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              rounded="xl"
              clearable
            />
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end align-center gap-2">
            <v-tooltip text="Atualizar lista" location="top">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  variant="outlined"
                  size="small"
                  rounded="xl"
                  class="text-none"
                  prepend-icon="mdi-refresh"
                  :loading="isTableLoading"
                  @click="handleRefresh"
                >
                  Atualizar
                </v-btn>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-data-table
          :headers="tableHeaders"
          :items="filteredOrganizations"
          :loading="isTableLoading"
          item-value="id"
          density="comfortable"
          class="elevation-0 organizations-table"
          :items-per-page="10"
        >
          <template #[`item.name`]="{ item }">
            <div class="organizations-table__name">
              <v-avatar size="36" rounded="lg" color="primary">
                <template v-if="item.logoUrl">
                  <v-img :src="item.logoUrl" :alt="item.name" cover />
                </template>
                <template v-else>
                  <v-icon icon="mdi-domain" />
                </template>
              </v-avatar>
              <span class="text-body-2 font-weight-medium">{{ item.name }}</span>
            </div>
          </template>

          <template #[`item.bio`]="{ item }">
            <span class="organizations-table__bio">
              {{ item.bio ? truncate(item.bio) : '—' }}
            </span>
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

              <v-tooltip text="Editar organização" location="top">
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
                :text="
                  item.projectCount
                    ? 'Remova os projetos vinculados antes de excluir.'
                    : 'Excluir organização'
                "
                location="top"
              >
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="tooltipProps"
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    :disabled="item.projectCount > 0"
                    @click="openDeleteDialog(item)"
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
              <v-icon icon="mdi-domain-off" size="48" color="grey" class="mb-2" />
              <p class="mb-0">{{ noDataMessage }}</p>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="detailsDialogOpen" max-width="520">
      <v-card v-if="selectedOrganization">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Detalhes da organização</span>
          <v-btn icon variant="text" size="small" @click="closeDetailsDialog">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <div class="organizations-details__header">
            <v-avatar size="72" rounded="lg" color="primary">
              <template v-if="selectedOrganization.logoUrl">
                <v-img :src="selectedOrganization.logoUrl" :alt="selectedOrganization.name" cover />
              </template>
              <template v-else>
                <v-icon icon="mdi-domain" />
              </template>
            </v-avatar>
            <div class="organizations-details__meta">
              <span class="text-subtitle-1 font-weight-medium">{{
                selectedOrganization.name
              }}</span>
              <span class="text-body-2 text-grey-lighten-1">
                {{ selectedOrganization.projectCount }}
                {{
                  selectedOrganization.projectCount === 1
                    ? 'projeto vinculado'
                    : 'projetos vinculados'
                }}
              </span>
            </div>
          </div>

          <p class="text-body-2 mb-4">
            {{ selectedOrganization.bio ?? 'Nenhuma descrição disponível.' }}
          </p>

          <div class="organizations-details__projects">
            <span class="text-subtitle-2">Projetos vinculados</span>
            <v-list v-if="selectedOrganizationProjects.length" density="comfortable">
              <v-list-item
                v-for="project in selectedOrganizationProjects"
                :key="project.id"
                :title="project.name"
                :subtitle="project.status === 'completed' ? 'Concluído' : 'Em progresso'"
              >
                <template #prepend>
                  <v-icon
                    :color="project.status === 'completed' ? 'success' : 'warning'"
                    icon="mdi-clipboard-text"
                  />
                </template>
              </v-list-item>
            </v-list>
            <p v-else class="text-body-2 mb-0">Nenhum projeto vinculado a esta organização.</p>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="closeDetailsDialog">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialogOpen" max-width="540">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Editar organização</span>
          <v-btn icon variant="text" size="small" @click="closeEditDialog">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-alert v-if="editError" type="error" variant="tonal" class="mb-3" density="comfortable">
            {{ editError }}
          </v-alert>

          <v-text-field
            v-model="organizationForm.name"
            label="Nome da organização"
            prepend-inner-icon="mdi-domain"
            variant="outlined"
            density="comfortable"
            required
            class="mb-3"
            :disabled="isSubmitting"
          />

          <v-textarea
            v-model="organizationForm.bio"
            label="Descrição/Biografia"
            prepend-inner-icon="mdi-text"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            class="mb-3"
            :disabled="isSubmitting"
          />

          <v-file-input
            v-model="organizationForm.logoFile"
            label="Enviar nova logo"
            prepend-icon="mdi-upload"
            variant="outlined"
            density="comfortable"
            accept="image/*"
            class="mb-3"
            :disabled="isSubmitting || organizationForm.removeLogo"
          />

          <v-switch
            v-if="organizationForm.currentLogoUrl"
            v-model="organizationForm.removeLogo"
            label="Remover logo atual"
            color="warning"
            inset
            :disabled="isSubmitting"
          />

          <div v-if="previewLogoUrl" class="organizations-edit__preview">
            <span class="text-caption text-grey-lighten-1">Pré-visualização</span>
            <v-avatar size="88" rounded="lg" color="primary">
              <v-img :src="previewLogoUrl" alt="Logo da organização" cover />
            </v-avatar>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" :disabled="isSubmitting" @click="closeEditDialog"> Cancelar </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            prepend-icon="mdi-content-save"
            :loading="isSubmitting"
            @click="handleEditSubmit"
          >
            Salvar ajustes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialogOpen" max-width="420">
      <v-card>
        <v-card-title class="text-h6">Confirmar exclusão</v-card-title>
        <v-card-text>
          Tem certeza de que deseja remover a organização
          <strong>{{ organizationToDelete?.name }}</strong
          >?
          <template v-if="organizationToDelete?.projectCount">
            <br />
            Ela possui {{ organizationToDelete.projectCount }}
            {{ organizationToDelete.projectCount === 1 ? 'projeto' : 'projetos' }} vinculados.
          </template>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" :disabled="deleteLoading" @click="closeDeleteDialog">
            Cancelar
          </v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="handleDeleteOrganization">
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { Database } from '~~/database/types'
import { useOrganizationLogoStorage } from '@/composables/useOrganizationLogoStorage'
import type { ProjectWithRelations } from '@/stores/projects'

type OrganizationSummary = {
  id: string
  name: string
  logoUrl: string | null
  bio: string | null
  projectCount: number
}

type OrganizationFormState = {
  id: string
  name: string
  bio: string
  logoUrl: string
  currentLogoUrl: string
  logoFile: File | null
  removeLogo: boolean
}

const projectsStore = useProjectsStore()
const { loading: projectsLoading, error: projectsError } = storeToRefs(projectsStore)
const supabase = useSupabaseClient<Database>()
const {
  uploadLogo,
  removeLogo: removeLogoFromStorage,
  loading: logoStorageLoading,
} = useOrganizationLogoStorage()

const searchQuery = ref('')
const refreshLoading = ref(false)
const detailsDialogOpen = ref(false)
const editDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const selectedOrganization = ref<OrganizationSummary | null>(null)
const organizationToDelete = ref<OrganizationSummary | null>(null)
const editSaving = ref(false)
const deleteLoading = ref(false)
const editError = ref<string | null>(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref<'success' | 'error'>('success')
const previewLogoUrl = ref<string | null>(null)

const tableHeaders = [
  { key: 'name', title: 'Organização', sortable: true },
  { key: 'bio', title: 'Descrição', sortable: false },
  { key: 'projectCount', title: 'Projetos', sortable: true },
  { key: 'actions', title: 'Ações', sortable: false },
]

const allProjectsCache = computed<ProjectWithRelations[]>(
  () => projectsStore.getCachedProjects('all') ?? [],
)

const organizationSummaries = computed<OrganizationSummary[]>(() => {
  const accumulator = new Map<string, OrganizationSummary>()

  allProjectsCache.value.forEach((project) => {
    const organization = project.organization
    if (!organization?.id) return

    const existing = accumulator.get(organization.id)
    if (existing) {
      existing.projectCount += 1
      return
    }

    accumulator.set(organization.id, {
      id: organization.id,
      name: organization.name,
      logoUrl: organization.logo_url,
      bio: organization.bio,
      projectCount: 1,
    })
  })

  return Array.from(accumulator.values()).sort((a, b) => a.name.localeCompare(b.name))
})

const hasOrganizations = computed(() => organizationSummaries.value.length > 0)

const selectedOrganizationProjects = computed<ProjectWithRelations[]>(() => {
  if (!selectedOrganization.value) {
    return []
  }

  return allProjectsCache.value.filter(
    (project) => project.organization?.id === selectedOrganization.value?.id,
  )
})

const filteredOrganizations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return organizationSummaries.value
  }

  return organizationSummaries.value.filter((organization) => {
    const nameMatch = organization.name.toLowerCase().includes(query)
    const bioMatch = organization.bio?.toLowerCase().includes(query) ?? false
    return nameMatch || bioMatch
  })
})

const noDataMessage = computed(() => {
  if (!hasOrganizations.value) {
    return 'Nenhuma organização vinculada encontrada.'
  }
  if (searchQuery.value.trim()) {
    return 'Nenhuma organização corresponde à busca informada.'
  }
  return 'Nenhuma organização disponível.'
})

const isTableLoading = computed(() => projectsLoading.value || refreshLoading.value)
const isSubmitting = computed(() => editSaving.value || logoStorageLoading.value)

const truncate = (text: string, length = 80) =>
  text.length > length ? `${text.slice(0, length)}…` : text

const showSnackbar = (message: string, color: 'success' | 'error' = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

const defaultOrganizationForm = (): OrganizationFormState => ({
  id: '',
  name: '',
  bio: '',
  logoUrl: '',
  currentLogoUrl: '',
  logoFile: null,
  removeLogo: false,
})

const organizationForm = reactive<OrganizationFormState>(defaultOrganizationForm())

const resetOrganizationForm = () => {
  Object.assign(organizationForm, defaultOrganizationForm())
  previewLogoUrl.value = null
}

const openDetailsDialog = (organization: OrganizationSummary) => {
  selectedOrganization.value = organization
  detailsDialogOpen.value = true
}

const closeDetailsDialog = () => {
  detailsDialogOpen.value = false
  selectedOrganization.value = null
}

const openEditDialog = (organization: OrganizationSummary) => {
  Object.assign(organizationForm, {
    id: organization.id,
    name: organization.name,
    bio: organization.bio ?? '',
    logoUrl: organization.logoUrl ?? '',
    currentLogoUrl: organization.logoUrl ?? '',
    logoFile: null,
    removeLogo: false,
  })
  editError.value = null
  previewLogoUrl.value = organization.logoUrl ?? null
  editDialogOpen.value = true
}

const closeEditDialog = () => {
  editDialogOpen.value = false
  resetOrganizationForm()
  editError.value = null
}

const openDeleteDialog = (organization: OrganizationSummary) => {
  organizationToDelete.value = organization
  deleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
  deleteDialogOpen.value = false
  organizationToDelete.value = null
}

const refreshProjectsCache = async () => {
  await projectsStore.refreshProjects('all')
}

const handleRefresh = async () => {
  refreshLoading.value = true
  projectsStore.clearError()

  try {
    await refreshProjectsCache()
    if (projectsError.value) {
      showSnackbar(projectsError.value, 'error')
    } else {
      showSnackbar('Lista de organizações atualizada!')
    }
  } finally {
    refreshLoading.value = false
  }
}

const handleEditSubmit = async () => {
  if (!organizationForm.id) {
    return
  }

  const name = organizationForm.name.trim()
  if (!name) {
    editError.value = 'Informe o nome da organização.'
    return
  }

  editSaving.value = true
  editError.value = null

  let uploadedLogo: { path: string; url: string } | null = null
  const previousLogoUrl = organizationForm.currentLogoUrl
  const trimmedManualUrl = organizationForm.logoUrl.trim()
  const shouldRemove = organizationForm.removeLogo && !organizationForm.logoFile

  try {
    if (organizationForm.logoFile) {
      uploadedLogo = await uploadLogo(organizationForm.logoFile, organizationForm.id)
    }

    const logoUrlToPersist =
      uploadedLogo?.url ?? (shouldRemove ? null : trimmedManualUrl || previousLogoUrl || null)

    const { error } = await supabase
      .from('organizations')
      .update({
        name,
        bio: organizationForm.bio.trim() || null,
        logo_url: logoUrlToPersist,
      })
      .eq('id', organizationForm.id)

    if (error) {
      throw new Error(error.message)
    }

    if (uploadedLogo && previousLogoUrl) {
      await removeLogoFromStorage(previousLogoUrl)
    } else if (shouldRemove && previousLogoUrl) {
      await removeLogoFromStorage(previousLogoUrl)
    }

    showSnackbar('Organização atualizada com sucesso!')
    closeEditDialog()
    await refreshProjectsCache()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Não foi possível atualizar a organização.'
    editError.value = message
    showSnackbar(message, 'error')

    if (uploadedLogo?.path) {
      await removeLogoFromStorage(uploadedLogo.path)
    }
  } finally {
    editSaving.value = false
  }
}

const handleDeleteOrganization = async () => {
  if (!organizationToDelete.value) {
    return
  }

  deleteLoading.value = true

  try {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', organizationToDelete.value.id)

    if (error) {
      throw new Error(error.message)
    }

    showSnackbar('Organização excluída com sucesso!')
    closeDeleteDialog()
    await refreshProjectsCache()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Não foi possível excluir a organização.'
    showSnackbar(message, 'error')
  } finally {
    deleteLoading.value = false
  }
}

watch(
  () => organizationForm.logoFile,
  (file) => {
    if (file) {
      organizationForm.removeLogo = false
      previewLogoUrl.value = URL.createObjectURL(file)
    }
  },
)

watch(
  () => organizationForm.removeLogo,
  (value) => {
    if (value) {
      organizationForm.logoFile = null
      organizationForm.logoUrl = ''
      previewLogoUrl.value = null
    } else if (!organizationForm.logoFile) {
      previewLogoUrl.value = organizationForm.currentLogoUrl || null
    }
  },
)

onMounted(() => {
  if (!projectsStore.getCachedProjects('all')) {
    void projectsStore.fetchProjects(false, 'all')
  }
})
</script>

<style scoped>
.organizations-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.organizations-card {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(0, 0, 0, 0.25));
}

.organizations-table__name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.organizations-table :deep(.v-data-table__td) {
  padding-block: 18px;
}

.organizations-table :deep(.v-data-table__tr) {
  height: auto;
}

.organizations-table__bio {
  display: inline-block;
  max-width: 420px;
  white-space: normal;
}

.organizations-details__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.organizations-details__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.organizations-edit__preview {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

@media (max-width: 960px) {
  .organizations-table__bio {
    max-width: 100%;
  }
}
</style>
