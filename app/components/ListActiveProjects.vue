<script setup lang="ts">
// Use the projects store
const projectsStore = useProjectsStore()
const { projects, loading, error, isCached } = storeToRefs(projectsStore)
const { fetchProjects, refreshProjects, invalidateCache } = projectsStore

// Load projects when page mounts
onMounted(async () => {
  await fetchProjects()
})
</script>

<template>
  <v-card
    class="mb-4"
    elevation="2"
    rounded="xl"
    title="Projetos de Responsabilidade Social"
    prepend-icon="mdi-folder-multiple"
  >
    <v-card-subtitle>
      Gerencie e acompanhe todas as iniciativas sociais da instituição
    </v-card-subtitle>

    <v-card-actions class="pa-4">
      <v-spacer />
      <v-chip :color="isCached ? 'success' : 'info'" size="small" class="me-2">
        <v-icon :icon="isCached ? 'mdi-database' : 'mdi-cloud-sync'" start />
        {{ isCached ? 'Cache Ativo' : 'Sincronizando' }}
      </v-chip>
      <v-btn
        variant="outlined"
        size="small"
        class="me-2"
        :loading="loading"
        rounded="xl"
        elevation="15"
        prepend-icon="mdi-refresh"
        @click="refreshProjects"
      >
        Atualizar
      </v-btn>
      <v-btn
        variant="outlined"
        color="warning"
        rounded="xl"
        size="small"
        elevation="15"
        prepend-icon="mdi-cached"
        @click="invalidateCache"
      >
        Limpar Cache
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- Loading State -->
  <v-card v-if="loading" class="mb-4" elevation="1" rounded="xl">
    <v-card-text class="text-center pa-8">
      <v-progress-circular indeterminate color="primary" size="48" />
      <div class="mt-4 text-h6">Carregando projetos sociais...</div>
      <p class="text-body-2 text-grey-darken-1 mt-2">
        Buscando as últimas iniciativas de responsabilidade social
      </p>
    </v-card-text>
  </v-card>

  <!-- Error State -->
  <v-alert v-if="error" type="error" class="mb-4 custom-alert" variant="tonal" rounded="xl">
    <v-icon icon="mdi-alert-circle" />
    <strong>Erro ao carregar projetos:</strong> {{ error }}
  </v-alert>

  <!-- Projects Display -->
  <v-card
    v-if="!loading && projects"
    elevation="1"
    rounded="xl"
    :title="`Projetos Ativos (${projects?.length || 0})`"
    prepend-icon="mdi-view-list"
  >
    <v-divider />

    <v-card-text class="pa-0">
      <div v-if="projects?.length === 0" class="text-center pa-8">
        <v-icon icon="mdi-folder-open-outline" size="64" color="grey-lighten-1" class="mb-4" />
        <h3 class="text-h6 mb-2">Nenhum projeto encontrado</h3>
        <p class="text-body-2 text-grey-darken-1">
          Comece criando seu primeiro projeto de responsabilidade social
        </p>
        <v-btn elevation="15" rounded="xl" color="primary" class="mt-4" prepend-icon="mdi-plus">
          Criar Projeto</v-btn
        >
      </div>

      <v-list v-else lines="three">
        <template v-for="(project, index) in projects" :key="project?.id || index">
          <v-list-item class="pa-4">
            <template #prepend>
              <v-avatar color="primary" class="me-3">
                <v-icon icon="mdi-handshake" />
              </v-avatar>
            </template>

            <v-list-item-title class="text-h6 mb-1">
              {{ project?.name || 'Projeto sem nome' }}
            </v-list-item-title>

            <v-list-item-subtitle class="mb-2">
              {{ project?.description || 'Sem descrição disponível' }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end">
                <v-chip
                  :color="project?.status === 'completed' ? 'success' : 'primary'"
                  size="small"
                  class="mb-2"
                >
                  <v-icon
                    :icon="
                      project?.status === 'completed' ? 'mdi-check-circle' : 'mdi-progress-clock'
                    "
                    start
                  />
                  {{ project?.status === 'completed' ? 'Concluído' : 'Em Andamento' }}
                </v-chip>
                <v-btn
                  elevation="15"
                  rounded="xl"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-eye"
                >
                  Ver Detalhes
                </v-btn>
              </div>
            </template>
          </v-list-item>
          <v-divider v-if="index < (projects?.length || 0) - 1" />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.custom-alert {
  background: rgba(244, 67, 54, 0.15) !important;
  border: 1px solid rgba(244, 67, 54, 0.3) !important;
  color: #ffcdd2 !important;
}

.custom-alert strong {
  color: #ffffff !important;
}
</style>
