<script setup lang="ts">
import { usePermissions } from '@/composables/usePermissions'
import { createStatisticsCards } from '~/constants/login'

const projectsStore = useProjectsStore()
const { projects, loading, error, isCached, completedProjectsCount } = storeToRefs(projectsStore)
const { fetchProjects, invalidateCache, fetchCompletedProjectsCount } = projectsStore
const { canCreateProjects } = usePermissions()

const statisticsCards = computed(() =>
  createStatisticsCards(projects.value, completedProjectsCount.value),
)

const activeProjects = computed(() =>
  (projects.value ?? []).filter((project) => project?.status === 'in-progress'),
)

onMounted(async () => {
  if (!projects.value) {
    await fetchProjects(false, 'all')
  }

  if (!completedProjectsCount.value) {
    await fetchCompletedProjectsCount()
  }
})
</script>

<template>
  <!-- Loading State -->
  <v-card v-if="loading" class="mb-4 simple-border" elevation="15" rounded="xl">
    <v-card-text class="text-center pa-8">
      <v-progress-circular indeterminate color="primary" size="48" class="glowing-circular" />
      <div class="mt-4 text-h6">Carregando projetos sociais...</div>
      <p class="text-body-2 text-grey-darken-1 mt-2">
        Buscando as últimas iniciativas de responsabilidade social
      </p>
    </v-card-text>
  </v-card>

  <!-- Error State -->
  <v-alert
    v-if="error"
    type="error"
    class="mb-4 custom-alert"
    variant="tonal"
    rounded="xl"
    elevation="15"
  >
    <v-icon icon="mdi-alert-circle" />
    <strong>Erro ao carregar projetos:</strong> {{ error }}
  </v-alert>

  <!-- Projects Display -->
  <ClientOnly>
    <v-card v-if="!loading && projects" elevation="15" rounded="xl" class="simple-border">
      <v-card-title class="text-white">
        <v-row align="center">
          <v-col cols="12" md="8" class="d-flex align-center">
            <v-icon icon="mdi-view-list" class="me-2" color="primary" />
            <span class="text-h6 text-md-h6 text-truncate">
              Projetos de Responsabilidade Social Ativos ({{ activeProjects.length }})
            </span>
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="text-center text-md-right d-flex flex-row flex-md-row justify-center justify-md-end align-center"
          >
            <v-chip
              :color="isCached ? 'success' : 'info'"
              size="x-small"
              class="me-2 text-no-wrap"
              style="min-width: max-content"
            >
              <v-icon :icon="isCached ? 'mdi-database' : 'mdi-cloud-sync'" start />
              {{ isCached ? 'Cache Ativo' : 'Sincronizando' }}
            </v-chip>
            <v-btn
              variant="outlined"
              size="x-small"
              class="me-2 light-btn-outlined-variant btn-selected-custom"
              :loading="loading"
              rounded="xl"
              elevation="15"
              prepend-icon="mdi-refresh"
              @click="() => fetchProjects(true, 'all')"
            >
              Atualizar
            </v-btn>
            <v-btn
              variant="outlined"
              color="warning"
              rounded="xl"
              size="x-small"
              elevation="15"
              class="btn-selected-custom"
              prepend-icon="mdi-cached"
              @click="invalidateCache"
            >
              Limpar Cache
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <div v-if="activeProjects.length === 0" class="text-center pa-8">
          <v-icon icon="mdi-folder-open-outline" size="64" color="grey-lighten-1" class="mb-4" />
          <h3 class="text-h6 mb-2">Nenhum projeto encontrado</h3>
          <p class="text-body-2 text-grey-darken-1">
            Comece criando seu primeiro projeto de responsabilidade social
          </p>
          <v-btn
            v-if="canCreateProjects"
            elevation="15"
            rounded="xl"
            color="primary"
            class="mt-4 btn-selected-custom"
            prepend-icon="mdi-plus"
          >
            Criar Projeto</v-btn
          >
        </div>

        <v-list v-else lines="three">
          <template v-for="(project, index) in activeProjects" :key="project?.id || index">
            <v-list-item class="pa-3">
              <v-list-item-title
                class="d-flex flex-column flex-md-row align-md-center justify-space-between gap-2"
              >
                <div class="d-flex flex-column flex-md-row align-md-center gap-2 flex-wrap">
                  <span class="text-subtitle-1 text-md-body-1 font-weight-medium text-truncate">
                    {{ project?.name || 'Projeto sem nome' }}
                  </span>
                  <ui-project-rating-summary
                    v-if="project?.id"
                    :project-id="project.id"
                    class="ms-0 ms-md-2"
                  />
                </div>

                <v-btn
                  elevation="15"
                  rounded="xl"
                  variant="tonal"
                  class="btn-selected-custom"
                  size="x-small"
                  prepend-icon="mdi-eye"
                >
                  Ver Detalhes
                </v-btn>
              </v-list-item-title>

              <v-list-item-subtitle class="mt-1">
                {{ project?.description || 'Sem descrição disponível' }}
              </v-list-item-subtitle>

              <ui-project-rating-display v-if="project?.id" :project-id="project.id" />

              <template #prepend>
                <v-avatar color="primary" class="me-3">
                  <v-icon icon="mdi-handshake" />
                </v-avatar>
              </template>

              <template #append>
                <v-row no-gutters justify="center">
                  <v-col cols="12" class="text-center">
                    <div class="text-body-2 mb-2">
                      {{ project?.organization?.name || 'Sem organização' }}
                    </div>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-avatar v-if="project?.organization?.logo_url" size="32">
                      <v-img :src="project.organization.logo_url" />
                    </v-avatar>
                    <v-avatar v-else color="grey-lighten-2" size="32">
                      <v-icon icon="mdi-domain" />
                    </v-avatar>
                  </v-col>
                </v-row>
              </template>
            </v-list-item>
            <v-divider v-if="index < activeProjects.length - 1" />
          </template>
        </v-list>
      </v-card-text>
    </v-card>
    <template #fallback>
      <v-card elevation="15" rounded="xl">
        <v-card-text class="text-center pa-8">
          <v-skeleton-loader
            type="heading, divider, list-item-three-line, list-item-three-line, list-item-three-line"
          />
        </v-card-text>
      </v-card>
    </template>
  </ClientOnly>

  <!-- Statistics Cards -->
  <ClientOnly>
    <v-row class="mt-1">
      <v-col v-for="(card, index) in statisticsCards" :key="index" cols="12" md="4">
        <ui-simple-card animated :card-data="card" size="big" />
      </v-col>
    </v-row>
    <template #fallback>
      <v-row class="mt-1">
        <v-col v-for="index in 3" :key="index" cols="12" md="4">
          <v-card variant="tonal" class="text-center pa-4" rounded="xl" elevation="15">
            <v-skeleton-loader type="avatar, text, text" />
          </v-card>
        </v-col>
      </v-row>
    </template>
  </ClientOnly>
</template>

<style scoped>
.custom-alert {
  background: rgba(244, 67, 54, 0.15) !important;
  border: 1px solid rgba(244, 67, 54, 0.3) !important;
  color: #ffcdd2 !important;
}

.glowing-circular {
  filter: drop-shadow(0 0 8px rgba(25, 118, 210, 0.4));
}

.custom-alert strong {
  color: #ffffff !important;
}
</style>
