<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from 'vuetify'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)
const vuetifyTheme = useTheme()

if (import.meta.server) {
  vuetifyTheme.change(theme.value)
} else {
  vuetifyTheme.change(theme.value)

  watch(
    theme,
    (mode) => {
      vuetifyTheme.change(mode)
    },
    { immediate: false },
  )
}

const currentTheme = computed(() => theme.value)

const layoutBackgroundClass = computed(() => 'app-background')
</script>
<template>
  <v-app :class="layoutBackgroundClass" :theme="currentTheme">
    <!-- Navigation Bar -->
    <nav-bar />

    <!-- Main Content -->
    <v-main>
      <div class="main-layout">
        <v-container fluid class="pa-0">
          <NuxtPage />
        </v-container>
      </div>
    </v-main>

    <footer-component />
  </v-app>
</template>

<style scoped>
.main-layout {
  min-height: calc(100vh - 64px); /* Full height minus navbar only */
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .main-layout {
    min-height: calc(100vh - 56px);
    padding-top: 56px; /* Slightly smaller navbar on mobile */
  }
}
</style>
