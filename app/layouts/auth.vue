<template>
  <v-app theme="dark" class="app-background">
    <!-- Navigation Bar -->
    <NavBar />
    <!-- Main Content -->
    <v-main class="login-page-wrapper">
      <NuxtPage />
    </v-main>

    <footer-component />
  </v-app>
</template>

<script setup lang="ts">
// Structured data for better SEO - only keeping this here
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
</script>
