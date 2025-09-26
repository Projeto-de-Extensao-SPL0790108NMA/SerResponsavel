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
            <v-btn
              variant="outlined"
              size="small"
              rounded="xl"
              class="text-none"
              prepend-icon="mdi-refresh"
              :loading="isBusy"
              @click="handleRefresh"
            >
              Atualizar lista
            </v-btn>
          </v-col>
        </v-row>

        <v-alert v-if="error" type="error" variant="tonal" class="mb-4" border="start">
          <v-icon icon="mdi-alert-circle" start />
          {{ error }}
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

          <template #[`item.actions`]>
            <v-btn variant="text" size="small" class="text-none" prepend-icon="mdi-eye">
              Ver detalhes
            </v-btn>
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
  </div>
</template>

<script setup lang="ts">
import type { ProjectStatusFilter, ProjectWithRelations } from '@/stores/projects'

const projectsStore = useProjectsStore()
const { loading, error } = storeToRefs(projectsStore)

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

const isBusy = computed(() => loading.value || isTabLoading.value)

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
