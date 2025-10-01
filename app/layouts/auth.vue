<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from 'vuetify'
import { usePreferencesStore } from '@/stores/preferences'
// Structured data for better SEO - only keeping this here
import NavBar from '~/layouts/baseComponents/NavBar.vue'
import FooterComponent from '~/layouts/baseComponents/FooterComponent.vue'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SerResponsável',
        description: 'Plataforma de Transparência e Gestão de Responsabilidade Social',
        url: 'https://ser-responsavel.vercel.app/',
        logo: 'https://ser-responsavel.vercel.app/logoserresp600_598.png',
        foundingDate: '2025',
        founders: [
          {
            '@type': 'Organization',
            name: 'Uninorte - Centro Universitário do Norte',
          },
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'contato@serresponsavel.com.br',
        },
        sameAs: [
          'https://www.linkedin.com/company/serresponsavel',
          'https://www.instagram.com/serresponsavel',
        ],
      }),
    },
  ],
})

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
  <v-app :theme="currentTheme" :class="layoutBackgroundClass">
    <!-- Navigation Bar -->
    <nav-bar />
    <!-- Main Content -->
    <v-main class="login-page-wrapper">
      <NuxtPage />
    </v-main>

    <footer-component />
  </v-app>
</template>
