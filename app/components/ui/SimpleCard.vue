<!--suppress CssUnusedSymbol -->
<script setup lang="ts">
import type { CardProps } from '~/types/ui'

type Props = CardProps

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
  animated: false,
  clickable: false,
})

const emit = defineEmits<{
  click: [cardData: Props['cardData']]
}>()

// Computed para classes e tamanhos baseado no size
const iconSize = computed(() => (props.size === 'big' ? '40px' : '32px'))
const titleClass = computed(() => (props.size === 'big' ? 'text-h4' : 'text-h6'))
const subtitleClass = computed(() => (props.size === 'big' ? 'text-subtitle-1' : 'text-caption'))

// Animações disponíveis
const iconAnimations = ['icon-bounce', 'icon-pulse', 'icon-swing', 'icon-shake', 'icon-float']
const backgroundAnimations = [
  'bg-glow',
  'bg-pulse',
  'bg-gradient-shift',
  'bg-shimmer',
  'bg-breathe',
]

// Sorteio estável por instância (evita trocar a cada re-render)
const iconAnim = ref('')
const bgAnim = ref('')

onMounted(() => {
  if (props.animated) {
    iconAnim.value = iconAnimations[Math.floor(Math.random() * iconAnimations.length)] || ''
    bgAnim.value =
      backgroundAnimations[Math.floor(Math.random() * backgroundAnimations.length)] || ''
  }
})

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.cardData)
  }
}
</script>

<template>
  <v-card
    :color="props.cardData.color || 'primary'"
    variant="tonal"
    :class="['text-center pa-4', bgAnim, { 'card-clickable': props.clickable }]"
    rounded="xl"
    elevation="15"
    :hover="props.clickable"
    @click="handleClick"
  >
    <v-icon :icon="props.cardData.icon" :size="iconSize" :class="['mb-2', iconAnim]" />
    <div :class="titleClass">{{ props.cardData.title }}</div>
    <div :class="subtitleClass">{{ props.cardData.subtitle }}</div>
  </v-card>
</template>

<style scoped>
/* eslint-disable vue-scoped-css/no-unused-selector */
/* SimpleCard Icon Animations - Classes applied dynamically via refs */
/* noinspection CssUnusedSymbol */
@keyframes icon-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes icon-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes icon-swing {
  0%,
  100% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(5deg);
  }
  80% {
    transform: rotate(-5deg);
  }
}

@keyframes icon-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-3px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(3px);
  }
}

@keyframes icon-float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Classes de animação de ícone */
.icon-bounce {
  animation: icon-bounce 2s infinite;
}

.icon-pulse {
  animation: icon-pulse 2s infinite;
}

.icon-swing {
  animation: icon-swing 2s ease-in-out infinite;
}

.icon-shake {
  animation: icon-shake 2.5s infinite;
}

.icon-float {
  animation: icon-float 3s ease-in-out infinite;
}

/* Background Animations */
@keyframes bg-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(25, 118, 210, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(25, 118, 210, 0.6);
  }
}

@keyframes bg-pulse {
  0%,
  100% {
    background-color: rgba(25, 118, 210, 0.1);
  }
  50% {
    background-color: rgba(25, 118, 210, 0.3);
  }
}

@keyframes bg-gradient-shift {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@keyframes bg-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes bg-breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* Background animation classes */
.bg-glow {
  animation: bg-glow 2.5s ease-in-out infinite;
}

/* Menos custoso: cor apenas */
.bg-pulse {
  animation: bg-pulse 2s ease-in-out infinite;
}

.bg-gradient-shift {
  background-color: rgba(25, 118, 210, 0.15);
  background-image: linear-gradient(
    45deg,
    rgba(25, 118, 210, 0.1),
    rgba(25, 118, 210, 0.3),
    rgba(25, 118, 210, 0.1)
  );
  background-size: 300% 300%;
  background-position: 0 50%;
  animation: bg-gradient-shift 3s ease-in-out infinite;
}

.bg-shimmer {
  position: relative;
  overflow: hidden;
}

.bg-shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  background-size: 200% 100%;
  animation: bg-shimmer 2s infinite;
  pointer-events: none;
}

.bg-breathe {
  animation: bg-breathe 3s ease-in-out infinite;
  transform-origin: center;
}

/* Clickable card styles */
.card-clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-clickable:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important;
}

.card-clickable:active {
  transform: translateY(-2px) scale(1.01);
  transition: all 0.1s ease;
}

/* Respeita usuários com redução de movimento */
@media (prefers-reduced-motion: reduce) {
  .icon-bounce,
  .icon-pulse,
  .icon-swing,
  .icon-shake,
  .icon-float,
  .bg-glow,
  .bg-pulse,
  .bg-gradient-shift,
  .bg-shimmer::before,
  .bg-breathe {
    animation: none !important;
    transition: none !important;
  }

  .card-clickable:hover,
  .card-clickable:active {
    transform: none !important;
    transition: none !important;
  }
}
</style>
