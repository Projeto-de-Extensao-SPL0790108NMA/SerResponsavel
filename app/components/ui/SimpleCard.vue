<script setup lang="ts">
interface CardData {
  icon: string
  color?: string
  title: string | number
  subtitle: string
}

interface Props {
  cardData: CardData
  size?: 'normal' | 'big'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
})

// Computed para classes e tamanhos baseado no size
const iconSize = computed(() => (props.size === 'big' ? '40px' : '32px'))
const titleClass = computed(() => (props.size === 'big' ? 'text-h4' : 'text-h6'))
const subtitleClass = computed(() => (props.size === 'big' ? 'text-subtitle-1' : 'text-caption'))
</script>

<template>
  <v-card :color="props.cardData.color || 'primary'" variant="tonal" class="text-center pa-4">
    <v-icon :icon="props.cardData.icon" :size="iconSize" class="mb-2" />
    <div :class="titleClass">{{ props.cardData.title }}</div>
    <div :class="subtitleClass">{{ props.cardData.subtitle }}</div>
  </v-card>
</template>
