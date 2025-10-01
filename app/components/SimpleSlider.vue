<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '@/stores/preferences'

// Slider images
const slides = [
  { src: '/slides/TROTE-LEGAL.jpeg', alt: 'Trote Legal - Projeto Social' },
  { src: '/slides/bike-sem-barreiras-768x576.jpg', alt: 'Bike Sem Barreiras' },
  { src: '/slides/ser-leitor-768x576.jpg', alt: 'Ser Leitor - Projeto de Leitura' },
  { src: '/slides/ser11.jpeg', alt: 'Projeto SerResponsável' },
]

const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)

const currentSlide = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const isDarkTheme = computed(() => theme.value === 'dark')

const startSlideShow = () => {
  intervalId = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 7000)
}

onMounted(() => {
  startSlideShow()
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>
<template>
  <v-card
    elevation="15"
    :class="['slider-card', isDarkTheme ? 'slider-card--dark' : 'slider-card--light']"
    rounded="xl"
  >
    <v-card-title class="d-flex align-center pa-4">
      <v-icon icon="mdi-image-multiple" class="me-2" color="primary" />
      Projetos em Destaque
    </v-card-title>
    <v-card-text class="pa-0">
      <div class="slider-container">
        <div class="slider-wrapper">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="slide"
            :class="{ active: index === currentSlide }"
          >
            <v-img :src="slide.src" :alt="slide.alt" aspect-ratio="2.5" cover class="slide-image" />
            <div
              :class="[
                'slide-overlay',
                isDarkTheme ? 'slide-overlay--dark' : 'slide-overlay--light',
              ]"
            >
              <div class="slide-content">
                <h3 class="text-h5 text-white font-weight-bold mb-2">
                  {{ slide.alt }}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Slider Controls -->
        <div class="slider-controls">
          <v-btn
            icon
            size="small"
            :class="[
              'control-btn',
              'prev',
              isDarkTheme ? 'control-btn--dark' : 'control-btn--light',
            ]"
            @click="currentSlide = (currentSlide - 1 + slides.length) % slides.length"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            :class="[
              'control-btn',
              'next',
              isDarkTheme ? 'control-btn--dark' : 'control-btn--light',
            ]"
            @click="currentSlide = (currentSlide + 1) % slides.length"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <!-- Slider Indicators -->
        <div class="slider-indicators">
          <button
            v-for="index in slides.length"
            :key="`indicator-${index - 1}`"
            :class="[
              'indicator',
              isDarkTheme ? 'indicator--dark' : 'indicator--light',
              { active: index - 1 === currentSlide },
            ]"
            @click="currentSlide = index - 1"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Slider Styles */
.slider-card {
  overflow: hidden;
}

.slider-card--dark {
  background: rgba(33, 38, 45, 0.9) !important;
  border: 1px solid rgba(25, 118, 210, 0.2);
  color: #e2e8f0;
}

.slider-card--light {
  background: rgba(255, 255, 255, 0.92) !important;
  border: 1px solid rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 0 0 16px 16px;
}

.slider-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide.active {
  opacity: 1;
  transform: translateX(0);
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.slide-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 24px 24px;
}

.slide-overlay--dark {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.45) 55%,
    transparent 100%
  );
}

.slide-overlay--light {
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.78) 0%,
    rgba(15, 23, 42, 0.42) 55%,
    transparent 100%
  );
}

.slide-content {
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.6s ease 0.2s;
}

.slide.active .slide-content {
  transform: translateY(0);
  opacity: 1;
}

/* Slider Controls */
.slider-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  pointer-events: none;
}

.control-btn {
  pointer-events: all;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.control-btn--dark {
  background: rgba(15, 23, 42, 0.6) !important;
  color: #f8fafc !important;
  border: 2px solid rgba(255, 255, 255, 0.25);
}

.control-btn--light {
  background: rgba(255, 255, 255, 0.88) !important;
  color: #0f172a !important;
  border: 2px solid rgba(15, 23, 42, 0.12);
}

.control-btn:hover {
  transform: scale(1.1);
}

.control-btn--dark:hover {
  background: rgba(25, 118, 210, 0.8) !important;
  border-color: rgba(25, 118, 210, 0.8);
}

.control-btn--light:hover {
  background: rgba(59, 130, 246, 0.85) !important;
  color: #f8fafc !important;
  border-color: rgba(59, 130, 246, 0.85);
}

/* Slider Indicators */
.slider-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator--dark {
  border: 2px solid rgba(255, 255, 255, 0.45);
  background: transparent;
}

.indicator--light {
  border: 2px solid rgba(15, 23, 42, 0.35);
  background: rgba(255, 255, 255, 0.6);
}

.indicator.active {
  background: rgba(25, 118, 210, 0.92);
  border-color: rgba(25, 118, 210, 0.92);
  transform: scale(1.2);
}

.indicator--dark:hover {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

.indicator--light:hover {
  border-color: rgba(59, 130, 246, 0.65);
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .slider-container {
    height: 250px;
  }

  .slide-overlay {
    padding: 20px 16px 16px;
  }

  .slide-content h3 {
    font-size: 1.1rem;
  }
}
</style>
