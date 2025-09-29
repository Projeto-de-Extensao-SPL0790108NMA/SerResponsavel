<script setup lang="ts">
const props = defineProps<{
  projectId: number
}>()

const projectIdRef = computed(() => props.projectId)
const { useProjectRating } = useProjectRatings()

const { summary, projectLoading } = useProjectRating(projectIdRef, {
  loadUserRating: false,
})

const averageLabel = computed(() => {
  if (!summary.value || summary.value.total === 0) {
    return 'Sem avaliações'
  }
  return `${summary.value.average.toFixed(1)} / 5`
})

const totalLabel = computed(() => {
  const total = summary.value?.total ?? 0
  if (total === 0) return 'Seja o primeiro a avaliar'
  if (total === 1) return '1 avaliação'
  return `${total} avaliações`
})
</script>

<template>
  <div class="d-flex align-center flex-wrap gap-2 project-rating-summary">
    <v-icon icon="mdi-star" :color="summary ? 'warning' : 'grey'" size="20" />
    <span class="font-weight-medium">{{ averageLabel }}</span>
    <v-progress-circular
      v-if="projectLoading && !summary"
      indeterminate
      size="16"
      color="primary"
    />
    <span class="text-caption text-grey-lighten-1 ml-5">{{ totalLabel }}</span>
  </div>
</template>

<style scoped>
.project-rating-summary {
  min-height: 24px;
}
</style>
