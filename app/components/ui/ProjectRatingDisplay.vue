<script setup lang="ts">
const props = defineProps<{
  projectId: number
  readonly?: boolean
}>()

const projectIdRef = computed(() => props.projectId)
const { useProjectRating } = useProjectRatings()

const isReadOnly = computed(() => props.readonly ?? false)

const { summary, userRating, projectLoading, projectError, submitRating } = useProjectRating(
  projectIdRef,
  {
    loadUserRating: !isReadOnly.value,
  },
)

const reactionOptions = [
  { value: 'like', emoji: '👍', label: 'Curtir' },
  { value: 'love', emoji: '❤️', label: 'Amei' },
  { value: 'care', emoji: '🤗', label: 'Acolher' },
  { value: 'wow', emoji: '😮', label: 'Surpreso' },
  { value: 'sad', emoji: '😢', label: 'Triste' },
  { value: 'angry', emoji: '😡', label: 'Indignado' },
]

const selectedReaction = ref<string | null>(null)
const localRating = ref<number>(0)

const activeReactionValue = computed(
  () => selectedReaction.value || userRating.value?.reaction || null,
)

const reactionCountsMap = computed(() => summary.value?.reactionCounts ?? {})
const reactionsWithCount = computed(() =>
  reactionOptions.filter((option) => (reactionCountsMap.value[option.value] ?? 0) > 0),
)

const handleRatingUpdate = async (value: string | number) => {
  if (isReadOnly.value) return
  const numericValue = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(numericValue) || numericValue === 0) return
  selectedReaction.value = selectedReaction.value || userRating.value?.reaction || null
  localRating.value = numericValue
  if (numericValue < 1 || numericValue > 5) return
  try {
    await submitRating(numericValue, selectedReaction.value)
  } catch (error) {
    console.error('Erro ao registrar avaliação', error)
  }
}

const handleReactionSelect = async (reactionValue: string) => {
  if (isReadOnly.value) return
  const ratingToSend = localRating.value || userRating.value?.rating || 5
  localRating.value = ratingToSend
  selectedReaction.value = reactionValue
  try {
    await submitRating(ratingToSend, reactionValue)
  } catch (error) {
    console.error('Erro ao registrar avaliação', error)
  }
}

watch(
  () => userRating.value,
  (value) => {
    if (isReadOnly.value) return
    if (!value) {
      localRating.value = 0
      selectedReaction.value = null
      return
    }
    localRating.value = value.rating
    selectedReaction.value = value.reaction
  },
  { immediate: true },
)
</script>

<template>
  <section class="project-rating-display mt-3">
    <ClientOnly>
      <template #default>
        <div class="mt-0 d-flex flex-column gap-3">
          <div class="d-flex align-center flex-wrap gap-2">
            <span class="text-caption">
              <b>Avalie essa ação:</b>
            </span>
            <v-rating
              :model-value="localRating"
              color="warning"
              active-color="warning"
              hover
              class="ml-2"
              length="5"
              size="24"
              :disabled="projectLoading"
              @update:model-value="handleRatingUpdate"
            />
            <v-progress-circular v-if="projectLoading" indeterminate size="20" color="primary" />
          </div>

          <div class="d-flex align-center flex-wrap gap-1">
            <span class="text-caption text-grey-lighten-1 me-2">Reações:</span>
            <v-btn
              v-for="option in reactionOptions"
              :key="option.value"
              size="small"
              density="compact"
              :variant="option.value === activeReactionValue ? 'tonal' : 'text'"
              class="emoji-btn"
              :class="{ 'emoji-btn--active': option.value === activeReactionValue }"
              :color="option.value === activeReactionValue ? 'warning' : undefined"
              :disabled="projectLoading"
              @click="handleReactionSelect(option.value)"
            >
              {{ option.emoji }}
            </v-btn>
          </div>

          <div v-if="reactionsWithCount.length" class="d-flex align-center flex-wrap gap-2">
            <span v-if="isReadOnly" class="text-caption text-grey-lighten-1 me-2">Reações:</span>
            <v-chip
              v-for="option in reactionsWithCount"
              :key="`count-${option.value}`"
              size="x-small"
              variant="tonal"
              color="grey-darken-3"
              class="my-1 mr-2"
            >
              {{ option.emoji }} {{ reactionCountsMap[option.value] }}
            </v-chip>
          </div>
          <p v-else-if="isReadOnly" class="text-caption text-grey-lighten-1 mb-0">
            Nenhuma reação registrada
          </p>

          <v-alert
            v-if="projectError"
            type="error"
            density="comfortable"
            variant="tonal"
            class="ma-0"
          >
            {{ projectError }}
          </v-alert>
        </div>
      </template>
      <template #fallback>
        <v-skeleton-loader type="text, text" class="mt-2" />
      </template>
    </ClientOnly>
  </section>
</template>

<style scoped>
.project-rating-display {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 5px;
}

.emoji-btn {
  min-width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  padding: 0;
}

.emoji-btn--active {
  box-shadow: 0 0 0 1px rgba(255, 193, 7, 0.35);
  border-radius: 3px;
}
</style>
