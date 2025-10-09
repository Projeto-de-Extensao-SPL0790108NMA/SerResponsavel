<script setup lang="ts">
import { usePermissions } from '@/composables/usePermissions'
import ProjectsProjectDetails from '@/components/projects/ProjectDetails.vue'
import type { ProjectWithRelations } from '@/stores/projects'
import { usePreferencesStore } from '@/stores/preferences'
import { createStatisticsCards } from '~/constants/login'

const projectsStore = useProjectsStore()
const { projects, loading, error, isCached, completedProjectsCount, currentProject } =
  storeToRefs(projectsStore)
const {
  fetchProjects,
  invalidateCache,
  fetchCompletedProjectsCount,
  setCurrentProject,
  clearCurrentProject,
} = projectsStore
const { canCreateProjects } = usePermissions()

const statisticsCards = computed(() =>
  createStatisticsCards(projects.value, completedProjectsCount.value),
)

const activeProjects = computed(() =>
  (projects.value ?? []).filter((project) => project?.status === 'in-progress'),
)

const isDetailsDialogOpen = ref(false)

const selectedProject = computed(() => currentProject.value)

const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)
const isDarkTheme = computed(() => theme.value === 'dark')

const openProjectDetails = (project: ProjectWithRelations | null | undefined) => {
  if (!project) return
  setCurrentProject(project)
  isDetailsDialogOpen.value = true
}

const closeProjectDetails = () => {
  isDetailsDialogOpen.value = false
}

watch(isDetailsDialogOpen, (isOpen) => {
  if (!isOpen) {
    clearCurrentProject()
  }
})

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
    <v-card
      v-if="!loading && projects"
      elevation="15"
      rounded="xl"
      :class="[
        'simple-border',
        'active-projects-card',
        isDarkTheme ? 'active-projects-card--dark' : 'active-projects-card--light',
      ]"
    >
      <v-card-title
        :class="[
          'projects-card-title',
          isDarkTheme ? 'projects-card-title--dark' : 'projects-card-title--light',
        ]"
      >
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
              :class="[
                'me-2',
                'btn-selected-custom',
                isDarkTheme ? 'projects-btn--dark' : 'projects-btn--light',
              ]"
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
              :class="[
                'btn-selected-custom',
                'projects-btn-outline-warning',
                isDarkTheme ? 'projects-btn--dark' : 'projects-btn--light',
              ]"
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
                  @click="openProjectDetails(project)"
                >
                  Ver Detalhes
                </v-btn>
              </v-list-item-title>

              <v-list-item-subtitle class="mt-1">
                {{ project?.description || 'Sem descrição disponível' }}
              </v-list-item-subtitle>

              <ui-project-rating-display v-if="project?.id" :project-id="project.id" />
              <ui-project-comments v-if="project?.id" :project-id="project.id" class="mt-4" />

              <template #prepend>
                <v-avatar class="me-3" size="52" rounded="lg">
                  <template v-if="project?.cover_image_url">
                    <v-img :src="project.cover_image_url" cover alt="Capa do projeto" />
                  </template>
                  <template v-else>
                    <v-img src="/logoserresp600_598.png" cover alt="Logo SerResponsável" />
                  </template>
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
                    <v-avatar
                      v-if="project?.organization?.logo_url"
                      size="42"
                      rounded="lg"
                      :class="['organization-logo-avatar']"
                    >
                      <v-img
                        :src="project.organization.logo_url"
                        :alt="project.organization?.name"
                        cover
                      />
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

  <v-dialog
    v-model="isDetailsDialogOpen"
    max-width="900"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card v-if="selectedProject" class="simple-border" elevation="18" rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6 text-truncate">{{
          selectedProject?.name || 'Detalhes do Projeto'
        }}</span>
        <v-btn icon variant="text" density="comfortable" @click="closeProjectDetails">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pb-6">
        <projects-project-details :project="selectedProject" variant="compact" />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          color="primary"
          variant="flat"
          rounded="xl"
          class="btn-selected-custom"
          @click="closeProjectDetails"
        >
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else class="simple-border" elevation="12" rounded="xl">
      <v-card-text>
        <v-skeleton-loader type="image, list-item-three-line, list-item-three-line" />
      </v-card-text>
    </v-card>
  </v-dialog>
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

.organization-logo-avatar {
  box-shadow:
    0 6px 16px rgba(15, 23, 42, 0.25),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.1);
}

.active-projects-card {
  transition:
    background 0.3s ease,
    color 0.3s ease,
    border 0.3s ease;
}

.active-projects-card--dark {
  background: rgba(24, 32, 45, 0.92) !important;
  border: 1px solid rgba(25, 118, 210, 0.2) !important;
  color: #e2e8f0;
}

.active-projects-card--light {
  background: rgba(255, 255, 255, 0.94) !important;
  border: 1px solid rgba(15, 23, 42, 0.08) !important;
  color: #0f172a;
}

.projects-card-title {
  display: flex;
  align-items: center;
  color: inherit;
}

.projects-card-title--dark {
  color: #f8fafc !important;
}

.projects-card-title--light {
  color: #1e293b !important;
}

.projects-btn--dark {
  color: #e2e8f0 !important;
  border-color: rgba(226, 232, 240, 0.4) !important;
}

.projects-btn--light {
  color: #1e293b !important;
  border-color: rgba(15, 23, 42, 0.16) !important;
  background-color: rgba(255, 255, 255, 0.85) !important;
}

.projects-btn--dark:hover,
.projects-btn--light:hover {
  box-shadow: 0 4px 12px rgba(15, 118, 210, 0.2);
}

.projects-btn-outline-warning.projects-btn--light {
  background-color: rgba(253, 224, 71, 0.14) !important;
  color: #1f2937 !important;
}

.projects-btn-outline-warning.projects-btn--dark {
  border-color: rgba(255, 193, 7, 0.4) !important;
}
</style>
