<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectWithRelations } from '@/stores/projects'

const DEFAULT_COVER = '/logoserresp600_598.png'

const props = defineProps<{
  project: ProjectWithRelations
}>()

const statusLabelMap: Record<string, string> = {
  'in-progress': 'Em progresso',
  completed: 'Concluído',
}

const statusColorMap: Record<string, string> = {
  'in-progress': 'warning',
  completed: 'success',
}

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch (error) {
    console.error('Erro ao formatar data', error)
    return value
  }
}

const organizationName = computed(
  () => props.project.organization?.name ?? 'Sem organização vinculada',
)

const coverImage = computed(() => props.project.cover_image_url ?? DEFAULT_COVER)
</script>

<template>
  <div>
    <v-responsive aspect-ratio="16/9" class="mb-4 project-details__cover">
      <v-img :src="coverImage" cover alt="Imagem de capa do projeto" />
    </v-responsive>

    <header class="mb-4">
      <h2 class="text-h6 mb-1">{{ project.name }}</h2>
      <div class="d-flex align-center gap-2">
        <v-chip
          size="small"
          :color="statusColorMap[project.status] ?? 'info'"
          variant="tonal"
          class="text-capitalize"
        >
          {{ statusLabelMap[project.status] ?? project.status }}
        </v-chip>
        <span class="text-body-2 text-grey-lighten-1">
          Criado em {{ formatDate(project.created_at) }}
        </span>
      </div>
    </header>

    <v-divider class="mb-4" />

    <v-list density="comfortable" lines="two" class="project-details__list">
      <v-list-item>
        <template #prepend>
          <v-icon icon="mdi-domain" />
        </template>
        <v-list-item-title>Organização</v-list-item-title>
        <v-list-item-subtitle>{{ organizationName }}</v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <template #prepend>
          <v-icon icon="mdi-text-long" />
        </template>
        <v-list-item-title>Descrição</v-list-item-title>
        <v-list-item-subtitle>
          <span v-if="project.description">{{ project.description }}</span>
          <span v-else class="text-grey-lighten-1">Nenhuma descrição cadastrada</span>
        </v-list-item-subtitle>
      </v-list-item>

      <v-list-item>
        <template #prepend>
          <v-icon icon="mdi-update" />
        </template>
        <v-list-item-title>Última atualização</v-list-item-title>
        <v-list-item-subtitle>{{ formatDate(project.updated_at) }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.project-details__list {
  background-color: transparent;
}

.project-details__cover {
  border-radius: 12px;
  overflow: hidden;
}
</style>
