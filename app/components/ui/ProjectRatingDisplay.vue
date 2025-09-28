<script setup lang="ts">
const props = defineProps<{
  projectId: number
}>()

const projectIdRef = computed(() => props.projectId)
const { useProjectRating } = useProjectRatings()

const { summary, userRating, projectLoading, projectError, submitRating } =
  useProjectRating(projectIdRef)

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

const averageLabel = computed(() => {
  if (!summary.value || summary.value.total === 0) {
    return 'Seja o primeiro a avaliar'
  }
  return `${summary.value.average.toFixed(1)} / 5`
})

const totalLabel = computed(() => {
  const total = summary.value?.total ?? 0
  if (total === 0) return 'Nenhuma avaliação ainda'
  if (total === 1) return '1 avaliação'
  return `${total} avaliações`
})

const activeReactionValue = computed(
  () => selectedReaction.value || userRating.value?.reaction || null,
)

const currentReactionEmoji = computed(
  () => reactionOptions.find((option) => option.value === activeReactionValue.value)?.emoji ?? null,
)

const reactionCountsMap = computed(() => summary.value?.reactionCounts ?? {})
const reactionsWithCount = computed(() =>
  reactionOptions.filter((option) => (reactionCountsMap.value[option.value] ?? 0) > 0),
)

const hasUserRating = computed(() => Boolean(userRating.value))

const handleRatingUpdate = async (value: number | null) => {
  if (!value) return
  selectedReaction.value = selectedReaction.value || userRating.value?.reaction || null
  localRating.value = value
  if (value < 1 || value > 5) return
  try {
    await submitRating(value, selectedReaction.value)
  } catch (error) {
    console.error('Erro ao registrar avaliação', error)
  }
}

const handleReactionSelect = async (reactionValue: string) => {
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
    <div class="d-flex flex-wrap align-center justify-space-between gap-2">
      <div class="d-flex align-center text-body-2">
        <v-icon icon="mdi-star" :color="summary ? 'warning' : 'grey'" size="20" class="me-1" />
        <span class="font-weight-medium">{{ averageLabel }}</span>
        <span class="text-caption text-grey-lighten-1 ms-2">{{ totalLabel }}</span>
      </div>
      <div v-if="hasUserRating" class="text-caption text-grey-lighten-1 d-flex align-center">
        <span v-if="currentReactionEmoji" class="me-1">{{ currentReactionEmoji }}</span>
        <span>Você avaliou {{ userRating?.rating }}/5</span>
      </div>
    </div>

    <ClientOnly>
      <template #default>
        <div class="mt-3 d-flex flex-column gap-2">
          <div class="d-flex align-center flex-wrap gap-2">
            <v-rating
              :model-value="localRating"
              color="warning"
              active-color="warning"
              hover
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
            <v-chip
              v-for="option in reactionsWithCount"
              :key="`count-${option.value}`"
              size="x-small"
              variant="tonal"
              color="grey-darken-3"
            >
              {{ option.emoji }} {{ reactionCountsMap[option.value] }}
            </v-chip>
          </div>

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
  padding-top: 12px;
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
  border-radius: 8px;
}
</style>
