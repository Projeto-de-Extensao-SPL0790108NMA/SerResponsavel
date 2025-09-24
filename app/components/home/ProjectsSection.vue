<template>
  <div class="projects-section">
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Buscar projetos"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          rounded="xl"
          clearable
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Filtrar por status"
          prepend-inner-icon="mdi-filter"
          variant="outlined"
          rounded="xl"
        />
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <v-row v-else-if="filteredProjects.length === 0">
      <v-col cols="12">
        <v-card variant="tonal" rounded="xl" elevation="8" class="text-center py-8">
          <v-icon icon="mdi-folder-open" size="64" color="grey" class="mb-4" />
          <v-card-title>Nenhum projeto encontrado</v-card-title>
          <v-card-text>
            {{
              searchQuery
                ? 'Tente ajustar os filtros de busca.'
                : 'Você ainda não possui projetos cadastrados.'
            }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="project in filteredProjects" :key="project.id" cols="12" md="6" lg="4">
        <v-card variant="tonal" rounded="xl" elevation="8" class="h-100">
          <v-card-title class="d-flex align-center">
            <v-icon
              :icon="project.status === 'completed' ? 'mdi-check-circle' : 'mdi-clock-outline'"
              :color="project.status === 'completed' ? 'success' : 'warning'"
              class="me-2"
            />
            {{ project.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ project.description }}
          </v-card-subtitle>
          <v-card-text>
            <v-chip
              :color="project.status === 'completed' ? 'success' : 'warning'"
              size="small"
              class="mb-2"
            >
              {{ project.status === 'completed' ? 'Concluído' : 'Em Progresso' }}
            </v-chip>
            <p class="text-caption">Criado em: {{ formatDate(project.created_at) }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="outlined" size="small" prepend-icon="mdi-eye"> Ver Detalhes </v-btn>
            <v-spacer />
            <v-btn icon="mdi-dots-vertical" variant="text" size="small" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const projectsStore = useProjectsStore()
const { projects, loading } = storeToRefs(projectsStore)

const searchQuery = ref('')
const statusFilter = ref('all')

const statusOptions = [
  { title: 'Todos', value: 'all' },
  { title: 'Em Progresso', value: 'in-progress' },
  { title: 'Concluído', value: 'completed' },
]

const filteredProjects = computed(() => {
  let filtered = projects.value

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter((project) => project.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (project) =>
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query),
    )
  }

  return filtered
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Não informado'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>
