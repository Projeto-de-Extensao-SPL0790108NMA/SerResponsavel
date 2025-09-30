<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProjectWithRelations } from '@/stores/projects'

const DEFAULT_COVER = '/logoserresp600_598.png'

const props = defineProps<{
  project: ProjectWithRelations
  variant?: 'default' | 'compact'
}>()

const statusLabelMap: Record<string, string> = {
  'in-progress': 'Em progresso',
  completed: 'Concluído',
}

const statusColorMap: Record<string, string> = {
  'in-progress': 'warning',
  completed: 'success',
}

const taskStatusLabelMap: Record<string, string> = {
  'in-progress': 'Em progresso',
  completed: 'Concluída',
}

const formatDateTime = (value?: string | null) => {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch (error) {
    console.error('Erro ao formatar data', error)
    return value ?? '—'
  }
}

const coverImage = computed(() => props.project.cover_image_url ?? DEFAULT_COVER)
const organizationName = computed(
  () => props.project.organization?.name ?? 'Sem organização vinculada',
)
const organizationBio = computed(
  () => props.project.organization?.bio ?? 'Nenhuma biografia disponível',
)
const projectTasks = computed(() => props.project.tasks ?? [])
const hasTasks = computed(() => projectTasks.value.length > 0)
const hasDescription = computed(() => Boolean(props.project.description?.trim()))
const isCompact = computed(() => (props.variant ?? 'default') === 'compact')

const collaboratorsLabel = computed(() => {
  const collaborators = props.project.collaborators ?? []
  if (!collaborators.length) return 'Nenhum colaborador cadastrado'
  return collaborators.join(', ')
})

const coverImageUrlLabel = computed(() => props.project.cover_image_url ?? 'Não informada')
const coverImagePathLabel = computed(() => props.project.cover_image_path ?? 'Não informado')
const statusLabel = computed(() => statusLabelMap[props.project.status] ?? props.project.status)

const detailedMetadata = computed(() => [
  {
    icon: 'mdi-identifier',
    label: 'ID',
    value: String(props.project.id),
  },
  {
    icon: 'mdi-link-variant',
    label: 'Slug',
    value: props.project.slug,
  },
  {
    icon: 'mdi-flag-outline',
    label: 'Status atual',
    value: statusLabel.value,
  },
  {
    icon: 'mdi-calendar-clock',
    label: 'Criado em',
    value: formatDateTime(props.project.created_at),
  },
  {
    icon: 'mdi-update',
    label: 'Atualizado em',
    value: formatDateTime(props.project.updated_at),
  },
  {
    icon: 'mdi-account-multiple',
    label: 'Colaboradores',
    value: collaboratorsLabel.value,
  },
  {
    icon: 'mdi-image',
    label: 'URL da capa',
    value: coverImageUrlLabel.value,
  },
  {
    icon: 'mdi-file-image',
    label: 'Path da capa',
    value: coverImagePathLabel.value,
  },
])

const isImagePreviewOpen = ref(false)

const openImagePreview = () => {
  isImagePreviewOpen.value = true
}

const closeImagePreview = () => {
  isImagePreviewOpen.value = false
}
</script>

<template>
  <div
    :class="[
      'project-details',
      isCompact ? 'project-details--compact' : 'project-details--default',
    ]"
  >
    <template v-if="isCompact">
      <v-row class="project-details__layout" align="stretch" no-gutters>
        <v-col cols="12" sm="5" md="4" class="project-details__media">
          <v-img
            :src="coverImage"
            alt="Imagem de capa do projeto"
            class="project-details__image"
            cover
          />
        </v-col>

        <v-col cols="12" sm="7" md="8" class="project-details__content">
          <header class="project-details__header">
            <div class="d-flex flex-wrap align-center gap-2">
              <v-chip
                size="small"
                :color="statusColorMap[project.status] ?? 'info'"
                variant="tonal"
                class="text-capitalize"
              >
                {{ statusLabelMap[project.status] ?? project.status }}
              </v-chip>
              <span class="text-body-2 text-grey-lighten-1 ml-5">
                Criado em {{ formatDateTime(project.created_at) }}
              </span>
            </div>
          </header>

          <section class="project-details__section">
            <p v-if="hasDescription" class="text-body-1 project-details__description">
              {{ project.description }}
            </p>
            <p v-else class="text-body-2 text-grey-lighten-1">Nenhuma descrição cadastrada</p>
          </section>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <section class="project-details__section">
            <h3 class="text-subtitle-1 text-medium-emphasis mb-3">Organização</h3>
            <div class="d-flex align-center gap-3">
              <v-avatar
                v-if="project.organization?.logo_url"
                size="56"
                rounded="lg"
                class="simple-border"
              >
                <v-img :src="project.organization.logo_url" alt="Logo da organização" />
              </v-avatar>
              <v-avatar v-else size="56" color="grey-darken-3">
                <v-icon icon="mdi-domain" />
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ organizationName }}
                </div>
                <div class="text-body-2 text-grey-lighten-1">
                  {{ organizationBio }}
                </div>
              </div>
            </div>
          </section>
        </v-col>
        <v-col>
          <section class="project-details__section">
            <h3 class="text-subtitle-1 text-medium-emphasis mb-3">Estatísticas</h3>
            <div class="d-flex flex-column gap-4">
              <ui-project-rating-summary
                v-if="project.id"
                :project-id="project.id"
                class="project-details__rating-summary"
              />
              <ui-project-rating-display v-if="project.id" :project-id="project.id" />
            </div>
          </section>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <section class="project-details__section">
            <h3 class="text-subtitle-1 text-medium-emphasis mb-3">Tarefas relacionadas</h3>
            <v-list v-if="hasTasks" density="compact" class="project-details__tasks">
              <v-list-item v-for="task in projectTasks" :key="task.id">
                <template #prepend>
                  <v-icon icon="mdi-clipboard-text" />
                </template>
                <v-list-item-title>{{ task.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  Status: {{ taskStatusLabelMap[task.status] ?? task.status }} • Prazo:
                  {{ task.due_date ? formatDateTime(task.due_date) : 'Sem prazo definido' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <p v-else class="text-body-2 text-grey-lighten-1">
              Nenhuma tarefa vinculada disponível para este projeto.
            </p>
          </section>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <div class="project-details__default">
        <div class="project-details__cover-wrapper">
          <v-hover v-slot="{ isHovering, props: hoverProps }">
            <v-responsive aspect-ratio="16/9" class="project-details__cover" v-bind="hoverProps">
              <v-img
                :src="coverImage"
                cover
                alt="Imagem de capa do projeto"
                class="project-details__cover-img project-details__cover-img--clickable"
                @click="openImagePreview"
              />

              <transition name="project-details-fade">
                <div v-if="isHovering" class="project-details__cover-overlay">
                  <div class="project-details__cover-overlay-content">
                    <v-icon icon="mdi-magnify-plus" size="28" class="mr-2" />
                    <span>Clique para ampliar</span>
                  </div>
                </div>
              </transition>

              <v-btn
                class="project-details__cover-action"
                size="small"
                variant="tonal"
                color="primary"
                prepend-icon="mdi-magnify-plus"
                @click.stop="openImagePreview"
              >
                Ampliar
              </v-btn>
            </v-responsive>
          </v-hover>
        </div>

        <header class="project-details__header">
          <div class="d-flex flex-wrap align-center justify-space-between gap-3">
            <div>
              <h2 class="text-h5 text-md-h4 mb-1">{{ project.name }}</h2>
            </div>
            <div class="d-flex flex-wrap align-center gap-2">
              <v-chip
                size="small"
                :color="statusColorMap[project.status] ?? 'info'"
                variant="tonal"
                class="text-capitalize"
              >
                {{ statusLabelMap[project.status] ?? project.status }}
              </v-chip>
              <span class="text-body-2 text-grey-lighten-1">
                Criado em {{ formatDateTime(project.created_at) }}
              </span>
            </div>
          </div>
        </header>

        <v-divider class="my-4" />

        <section class="project-details__section">
          <h3 class="text-subtitle-1 text-medium-emphasis mb-2">Descrição</h3>
          <p v-if="hasDescription" class="text-body-1 project-details__description">
            {{ project.description }}
          </p>
          <p v-else class="text-body-2 text-grey-lighten-1">Nenhuma descrição cadastrada</p>
        </section>

        <section class="project-details__section">
          <h3 class="text-subtitle-1 text-medium-emphasis mb-3">Estatísticas</h3>
          <v-row class="project-details__stats" dense>
            <v-col cols="12" md="4">
              <ui-project-rating-summary v-if="project.id" :project-id="project.id" />
            </v-col>
            <v-col cols="12" md="8">
              <ui-project-rating-display
                v-if="project.id"
                :project-id="project.id"
                :readonly="true"
              />
            </v-col>
          </v-row>
        </section>

        <section class="project-details__section">
          <h3 class="text-subtitle-1 text-medium-emphasis mb-3">Dados do projeto</h3>
          <v-card variant="outlined" rounded="xl" class="project-details__card">
            <v-list density="comfortable" lines="two" class="project-details__list">
              <v-list-item v-for="item in detailedMetadata" :key="item.label">
                <template #prepend>
                  <v-icon :icon="item.icon" />
                </template>
                <v-list-item-title>{{ item.label }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </section>

        <section class="project-details__section">
          <h3 class="text-subtitle-1 text-medium-emphasis mb-3">Organização</h3>
          <v-card variant="tonal" class="pa-5" rounded="xl">
            <div class="d-flex align-center gap-4 flex-wrap">
              <v-avatar
                v-if="project.organization?.logo_url"
                size="72"
                rounded="lg"
                class="simple-border"
              >
                <v-img :src="project.organization.logo_url" alt="Logo da organização" />
              </v-avatar>
              <v-avatar v-else size="72" color="grey-darken-3">
                <v-icon icon="mdi-domain" size="32" />
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ organizationName }}
                </div>
                <div class="text-body-2 text-grey-lighten-1">
                  {{ organizationBio }}
                </div>
              </div>
            </div>
          </v-card>
        </section>

        <section class="project-details__section">
          <h3 class="text-subtitle-1 text-medium-emphasis mb-3">Tarefas relacionadas</h3>
          <v-card variant="outlined" rounded="xl" class="project-details__card">
            <v-list
              v-if="hasTasks"
              density="comfortable"
              lines="two"
              class="project-details__tasks"
            >
              <v-list-item v-for="task in projectTasks" :key="task.id">
                <template #prepend>
                  <v-icon icon="mdi-clipboard-text" />
                </template>
                <v-list-item-title>{{ task.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  Status: {{ taskStatusLabelMap[task.status] ?? task.status }} • Prazo:
                  {{ task.due_date ? formatDateTime(task.due_date) : 'Sem prazo definido' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="text-body-2 text-grey-lighten-1 pa-4">
              Nenhuma tarefa vinculada disponível para este projeto.
            </div>
          </v-card>
        </section>
      </div>
    </template>

    <v-dialog v-model="isImagePreviewOpen" max-width="960">
      <v-card class="project-details__preview-card" rounded="xl">
        <v-img
          :src="coverImage"
          cover
          alt="Pré-visualização da imagem do projeto"
          class="project-details__preview-img"
        />
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="closeImagePreview">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.project-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.project-details__layout {
  gap: 24px;
}

.project-details__media {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.project-details__image {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.project-details--compact .project-details__image {
  max-width: 320px;
  max-height: 240px;
}

.project-details__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.project-details__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-details__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-details__description {
  line-height: 1.6;
  color: #e0e0e0;
}

.project-details__tasks {
  background-color: transparent;
}

.project-details__list {
  background-color: transparent;
}

.project-details__cover-wrapper {
  display: flex;
  justify-content: center;
}

.project-details__cover {
  position: relative;
  width: 100%;
  max-width: 520px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  cursor: default;
}

.project-details__cover-img {
  width: 100%;
  height: 100%;
}

.project-details__cover-img--clickable {
  cursor: zoom-in;
}

.project-details__cover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.6));
  color: #ffffff;
  pointer-events: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.8rem;
}

.project-details__cover-overlay-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-details__cover-action {
  position: absolute;
  right: 16px;
  bottom: 16px;
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.35);
}

.project-details__preview-card {
  background: rgba(18, 18, 18, 0.95);
}

.project-details__preview-img {
  max-height: 70vh;
}

.project-details__card {
  background-color: rgba(255, 255, 255, 0.02);
}

@media (min-width: 600px) {
  .project-details__layout {
    flex-wrap: nowrap;
  }

  .project-details__media {
    justify-content: flex-start;
  }
}

@media (max-width: 960px) {
  .project-details__layout {
    gap: 16px;
  }

  .project-details--compact .project-details__image {
    max-width: 100%;
    max-height: 200px;
  }

  .project-details__cover {
    max-width: 100%;
  }

  .project-details__cover-action {
    right: 12px;
    bottom: 12px;
  }
}

.project-details-fade-enter-active,
.project-details-fade-leave-active {
  transition: opacity 0.2s ease;
}

.project-details-fade-enter-from,
.project-details-fade-leave-to {
  opacity: 0;
}
</style>
