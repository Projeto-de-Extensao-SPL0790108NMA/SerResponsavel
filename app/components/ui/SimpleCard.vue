<!--suppress CssUnusedSymbol -->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '@/stores/preferences'
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
const cardRef = ref<HTMLElement | { $el: HTMLElement } | null>(null)
const resolvedColor = ref<string | null>(null)
const isDarkBackground = ref(true)
const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)
const isDarkTheme = computed(() => theme.value === 'dark')

const HEX_SHORT_REGEX = /^#([\da-f])([\da-f])([\da-f])$/i
const HEX_LONG_REGEX = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i

type ParsedColor = {
  rgb: [number, number, number]
  alpha: number
}

const parseHexToRgb = (value: string): ParsedColor | null => {
  const normalized = value.trim()
  if (HEX_SHORT_REGEX.test(normalized)) {
    const [, r, g, b] = normalized.match(HEX_SHORT_REGEX) ?? []
    return {
      rgb: [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)],
      alpha: 1,
    }
  }

  if (HEX_LONG_REGEX.test(normalized)) {
    const [, r, g, b] = normalized.match(HEX_LONG_REGEX) ?? []
    return {
      rgb: [parseInt(r ?? '00', 16), parseInt(g ?? '00', 16), parseInt(b ?? '00', 16)],
      alpha: 1,
    }
  }
  return null
}

const parseRgbString = (value: string): ParsedColor | null => {
  const match = value.match(/rgba?\(([^)]+)\)/i)
  if (!match) return null
  const parts = match[1].split(',').map((component) => component.trim())
  if (parts.length < 3) return null

  const [r, g, b] = parts.slice(0, 3).map((component) => Number.parseFloat(component))
  if ([r, g, b].some((component) => Number.isNaN(component))) {
    return null
  }

  let alpha = 1
  if (parts[3] !== undefined) {
    const parsedAlpha = Number.parseFloat(parts[3])
    if (!Number.isNaN(parsedAlpha)) {
      alpha = Math.min(Math.max(parsedAlpha, 0), 1)
    }
  }

  return {
    rgb: [r, g, b],
    alpha,
  }
}

const getLuminance = ([r, g, b]: [number, number, number]) => {
  const toLinear = (channel: number) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4)
  }

  const [lr, lg, lb] = [r, g, b].map(toLinear) as [number, number, number]
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

const getCardElement = (): HTMLElement | null => {
  const target = cardRef.value
  if (!target) return null
  if (target instanceof HTMLElement) return target
  if (typeof target === 'object' && '$el' in target && target.$el instanceof HTMLElement) {
    return target.$el
  }
  return null
}

const resolveBackgroundColor = () => {
  if (import.meta.server) return

  const colorValue = props.cardData.color || 'primary'
  let resolved = colorValue

  const isDirectColor =
    colorValue.startsWith('#') ||
    colorValue.startsWith('rgb') ||
    colorValue.startsWith('hsl') ||
    colorValue.startsWith('var(')

  if (!isDirectColor) {
    const cssVar = getComputedStyle(document.documentElement).getPropertyValue(
      `--v-theme-${colorValue}`,
    )

    if (cssVar?.trim()) {
      resolved = cssVar.trim()
    } else {
      const temp = document.createElement('span')
      temp.style.color = colorValue
      document.body.appendChild(temp)
      const computedColor = getComputedStyle(temp).color
      document.body.removeChild(temp)
      if (computedColor) {
        resolved = computedColor
      }
    }
  }

  const cardElement = getCardElement()

  if (cardElement) {
    const computedBackground = getComputedStyle(cardElement).getPropertyValue('background-color')
    if (computedBackground && computedBackground.trim() && computedBackground !== 'transparent') {
      resolved = computedBackground.trim()
    }
  }

  if (resolved.startsWith('var(')) {
    const cssVarMatch = resolved.match(/var\((--[^)]+)\)/)
    if (cssVarMatch?.[1]) {
      const cssVarValue = getComputedStyle(document.documentElement).getPropertyValue(
        cssVarMatch[1],
      )
      if (cssVarValue?.trim()) {
        resolved = cssVarValue.trim()
      }
    }
  }

  resolvedColor.value = resolved

  const DEFAULT_COLORS: Record<string, ParsedColor> = {
    primary: { rgb: [25, 118, 210], alpha: 1 },
    secondary: { rgb: [156, 39, 176], alpha: 1 },
    accent: { rgb: [255, 193, 7], alpha: 1 },
    info: { rgb: [0, 188, 212], alpha: 1 },
    success: { rgb: [76, 175, 80], alpha: 1 },
    warning: { rgb: [255, 152, 0], alpha: 1 },
    error: { rgb: [244, 67, 54], alpha: 1 },
  }

  const fallbackColor = DEFAULT_COLORS[colorValue.toLowerCase()] ?? DEFAULT_COLORS.primary
  const parsedColor = parseHexToRgb(resolved) ?? parseRgbString(resolved) ?? fallbackColor

  if (!parsedColor) {
    isDarkBackground.value = true
    return
  }

  const luminance = getLuminance(parsedColor.rgb)

  if (parsedColor.alpha < 0.45) {
    isDarkBackground.value = false
    return
  }

  if (luminance >= 0.55) {
    isDarkBackground.value = false
    return
  }

  isDarkBackground.value = luminance < 0.5
}

onMounted(() => {
  if (props.animated) {
    iconAnim.value = iconAnimations[Math.floor(Math.random() * iconAnimations.length)] || ''
    bgAnim.value =
      backgroundAnimations[Math.floor(Math.random() * backgroundAnimations.length)] || ''
  }

  void nextTick(resolveBackgroundColor)
})

watch(
  () => props.cardData.color,
  () => {
    void nextTick(resolveBackgroundColor)
  },
  { immediate: true },
)

const paletteTextColor: Record<string, string> = {
  primary: '#0d3c8a',
  secondary: '#6a1b9a',
  accent: '#ad1457',
  success: '#1b5e20',
  info: '#006064',
  warning: '#e65100',
  error: '#b71c1c',
}

const textStyle = computed(() => {
  const strokeColor = isDarkTheme.value ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)'
  const strokeWidth = isDarkTheme.value ? '1.2px' : '1.8px'

  if (isDarkBackground.value) {
    return {
      color: 'rgba(249, 250, 255, 0.97)',
      textShadow:
        '0 0 2px rgba(0, 0, 0, 0.95), 0 0 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.85)',
      WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
    }
  }

  const colorKey = (props.cardData.color ?? '').toString().toLowerCase()
  const paletteColor = paletteTextColor[colorKey] ?? '#0f172a'

  return {
    color: paletteColor,
    textShadow:
      '0 0 2px rgba(255, 255, 255, 0.9), 0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(15, 23, 42, 0.55)',
    WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
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
    ref="cardRef"
    :color="props.cardData.color || 'primary'"
    variant="tonal"
    :class="[
      'text-center',
      'pa-4',
      bgAnim,
      { 'card-clickable': props.clickable },
      isDarkTheme ? 'simple-card--dark' : 'simple-card--light',
    ]"
    rounded="xl"
    elevation="15"
    :hover="props.clickable"
    @click="handleClick"
  >
    <v-icon
      :icon="props.cardData.icon"
      :size="iconSize"
      :class="['mb-2', iconAnim]"
      :style="textStyle"
    />
    <div :class="titleClass" :style="textStyle">{{ props.cardData.title }}</div>
    <div :class="['simple-card__subtitle', subtitleClass]" :style="textStyle">
      {{ props.cardData.subtitle }}
    </div>
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
    filter: brightness(1);
  }
  50% {
    transform: scale(1.02);
    filter: brightness(1.08);
  }
}

.bg-glow {
  animation: bg-glow 4s ease-in-out infinite;
}

.bg-pulse {
  animation: bg-pulse 3s ease-in-out infinite;
}

.bg-gradient-shift {
  background: linear-gradient(45deg, rgba(25, 118, 210, 0.2), rgba(25, 118, 210, 0.4));
  background-size: 200%;
  animation: bg-gradient-shift 6s ease infinite;
}

.bg-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  animation: bg-shimmer 3s ease-in-out infinite;
}

.bg-breathe {
  animation: bg-breathe 5s ease-in-out infinite;
}

.card-clickable {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.3s ease;
}

.card-clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(25, 118, 210, 0.25);
}

.card-clickable:active {
  transform: translateY(0);
  box-shadow: 0 10px 20px rgba(25, 118, 210, 0.2);
}

.simple-card__subtitle {
  letter-spacing: 0.02em;
  opacity: 0.92;
}

.simple-card--light {
  border: 1px solid rgba(15, 23, 42, 0.4) !important;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.12);
}

.simple-card--dark {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* eslint-enable vue-scoped-css/no-unused-selector */
</style>
