<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ProjectComment } from '@/stores/projectComments'
import { useProjectComments } from '@/composables/useProjectComments'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  projectId: number
}>()

const { useComments } = useProjectComments()
const authStore = useAuthStore()

const projectIdRef = computed(() => props.projectId)

const { comments, summary, loading, error, isAuthenticated, submitComment } = useComments(
  projectIdRef,
  {
    subscribe: true,
    fetchOnMount: true,
  },
)

const newComment = ref('')
const authorName = ref('')
const isSubmitting = ref(false)
const successMessage = ref('')
const isComposerOpen = ref(false)

const canSubmit = computed(() => newComment.value.trim().length > 0 && !isSubmitting.value)

const commentCountLabel = computed(() => {
  const total = summary.value?.total ?? 0
  if (total === 0) return 'Ainda sem comentários!'
  if (total === 1) return '1 comentário'
  return `${total} comentários`
})

const displayName = (comment: ProjectComment) => {
  if (comment.authorName && comment.authorName.trim()) {
    return comment.authorName
  }
  return 'Anônimo'
}

const formatDateTime = (value: string) => {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch (error) {
    console.error('Erro ao formatar data de comentário', error)
    return value
  }
}

const resetComposer = () => {
  newComment.value = ''
  if (!isAuthenticated.value) {
    authorName.value = authorName.value.trim()
  }
}

const closeComposer = () => {
  isComposerOpen.value = false
}

const toggleComposer = () => {
  isComposerOpen.value = !isComposerOpen.value
  if (!isComposerOpen.value) {
    successMessage.value = ''
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true
  successMessage.value = ''

  try {
    await submitComment(newComment.value, {
      authorName: isAuthenticated.value ? authStore.fullName : authorName.value,
    })
    resetComposer()
    closeComposer()
    successMessage.value = 'Comentário enviado com sucesso!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (submitError) {
    console.error('Erro ao enviar comentário', submitError)
  } finally {
    isSubmitting.value = false
  }
}

const placeholderText = computed(() =>
  isAuthenticated.value
    ? `Compartilhe algo, ${authStore.fullName}...`
    : 'Compartilhe algo sobre este projeto...',
)

watch(
  () => isComposerOpen.value,
  (isOpen) => {
    if (!isOpen) {
      resetComposer()
    }
  },
)
</script>

<template>
  <section class="project-comments">
    <header class="project-comments__header">
      <div class="project-comments__header-row">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-forum" size="20" color="primary" />
          <h3 class="text-subtitle-1 mb-0">Comentários</h3>
          <v-chip size="x-small" color="primary" variant="tonal">
            {{ commentCountLabel }}
          </v-chip>
        </div>
        <v-btn
          size="x-small"
          variant="text"
          class="project-comments__toggle"
          :prepend-icon="isComposerOpen ? 'mdi-close' : 'mdi-comment-plus'"
          @click="toggleComposer"
        >
          {{ isComposerOpen ? 'Fechar' : 'Comentar' }}
        </v-btn>
      </div>
      <p class="text-caption text-grey-lighten-1 mt-1 mb-0">
        Compartilhe suas impressões sobre este projeto.
      </p>
    </header>

    <v-alert
      v-if="error && !isComposerOpen"
      type="error"
      density="comfortable"
      variant="tonal"
      class="mt-3"
    >
      {{ error }}
    </v-alert>

    <v-alert
      v-if="successMessage && !isComposerOpen"
      type="success"
      density="comfortable"
      variant="tonal"
      class="mt-3"
    >
      {{ successMessage }}
    </v-alert>

    <v-expand-transition>
      <v-card v-if="isComposerOpen" variant="tonal" class="mt-3" rounded="xl">
        <v-card-text>
          <v-alert v-if="error" type="error" density="comfortable" variant="tonal" class="mb-3">
            {{ error }}
          </v-alert>

          <div class="d-flex flex-column gap-2">
            <div v-if="!isAuthenticated" class="d-flex flex-column gap-1">
              <span class="text-caption text-grey-lighten-1">Como devemos te chamar?</span>
              <v-text-field
                v-model="authorName"
                variant="outlined"
                rounded="md"
                density="compact"
                placeholder="Seu nome (opcional)"
                :disabled="isSubmitting"
                hide-details
                class="project-comments__input"
              />
            </div>

            <v-textarea
              v-model="newComment"
              :label="isAuthenticated ? 'Escreva seu comentário' : 'Comentário anônimo'"
              :placeholder="placeholderText"
              auto-grow
              rounded="md"
              variant="outlined"
              rows="2"
              max-rows="4"
              density="compact"
              :disabled="isSubmitting"
              class="project-comments__input"
            />

            <div class="d-flex justify-end gap-2">
              <v-btn variant="text" size="x-small" :disabled="isSubmitting" @click="closeComposer">
                Cancelar
              </v-btn>
              <v-btn
                size="x-small"
                color="primary"
                rounded="xl"
                class="btn-selected-custom"
                :loading="isSubmitting"
                :disabled="!canSubmit"
                prepend-icon="mdi-send"
                @click="handleSubmit"
              >
                Enviar comentário
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <v-divider class="my-4" />

    <div class="project-comments__list">
      <template v-if="loading">
        <v-skeleton-loader type="heading, list-item-two-line, list-item-two-line" />
      </template>
      <template v-else-if="comments.length === 0">
        <div class="project-comments__empty">
          <v-icon icon="mdi-comment-outline" color="grey" size="28" class="mb-2" />
          <p class="text-body-2 text-grey-lighten-1 mb-0">Seja o primeiro a comentar.</p>
        </div>
      </template>
      <template v-else>
        <v-list density="compact" class="project-comments__dense-list" lines="two">
          <v-list-item v-for="comment in comments" :key="comment.id">
            <template #title>
              <div class="d-flex align-center gap-2">
                <span class="text-subtitle-2 font-weight-medium">{{ displayName(comment) }}</span>
                <span class="text-caption text-grey-lighten-1">{{
                  formatDateTime(comment.createdAt)
                }}</span>
              </div>
            </template>
            <template #subtitle>
              <span class="text-body-2">{{ comment.content }}</span>
            </template>
          </v-list-item>
        </v-list>
      </template>
    </div>
  </section>
</template>

<style scoped>
.project-comments {
  display: flex;
  flex-direction: column;
}

.project-comments__header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.project-comments__input {
  font-size: 0.85rem;
}

.project-comments__empty {
  text-align: center;
  padding: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 16px;
}

.project-comments__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-comments__dense-list {
  background: transparent;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.project-comments__toggle {
  min-width: 0;
  font-weight: 500;
}
</style>
