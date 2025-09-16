<template>
  <v-app theme="dark" class="app-background">
    <NuxtPage />
  </v-app>
</template>
<script setup lang="ts">
// Global SEO configuration
useSeoMeta({
  title: 'SerResponsável - Plataforma de Transparência e Gestão de Responsabilidade Social',
  description: 'Primeira plataforma brasileira que unifica gestão acadêmica e corporativa de responsabilidade social. Centraliza, gerencia e mensura ações de empresas, ONGs, instituições de ensino e poder público.',
  keywords: 'responsabilidade social, ESG, transparência social, impacto social, sustentabilidade, Uninorte, Amazonas, ONGs, projetos sociais',
  author: 'Uninorte - Centro Universitário do Norte',
  
  // Open Graph / Facebook
  ogType: 'website',
  ogSiteName: 'SerResponsável',
  ogTitle: 'SerResponsável - Transparência Social Verificada',
  ogDescription: 'Transforme sua gestão de responsabilidade social com ranqueamento de impacto real, certificação digital e dashboard ESG automatizado.',
  ogImage: '/logoserresp600_598.png',
  ogImageWidth: '600',
  ogImageHeight: '598',
  ogLocale: 'pt_BR',
  
  // Twitter Cards
  twitterCard: 'summary_large_image',
  twitterSite: '@SerResponsavel',
  twitterCreator: '@SerResponsavel',
  twitterTitle: 'SerResponsável - Transparência Social Verificada',
  twitterDescription: 'Primeira plataforma que unifica gestão acadêmica e corporativa de responsabilidade social.',
  twitterImage: '/logoserresp600_598.png',
  
  // Additional meta tags
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  charset: 'utf-8'
})

// Structured data for better SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SerResponsável',
        description: 'Plataforma de Transparência e Gestão de Responsabilidade Social',
        url: 'https://ser-responsavel.vercel.app/',
        logo: 'https://ser-responsavel.vercel.app/logoserresp600_598.png',
        foundingDate: '2024',
        founders: [
          {
            '@type': 'Organization',
            name: 'Uninorte - Centro Universitário do Norte'
          }
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'contato@serresponsavel.com.br'
        },
        sameAs: [
          'https://www.linkedin.com/company/serresponsavel',
          'https://www.instagram.com/serresponsavel'
        ]
      })
    }
  ]
})
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

.app-background {
  background: linear-gradient(
    135deg,
    #0d1117 0%,
    #161b22 25%,
    #1c2128 50%,
    #21262d 75%,
    #0d1117 100%
  ) !important;
  background-attachment: fixed !important;
  min-height: 100vh !important;
}

.app-background::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(29, 155, 240, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 70%, rgba(34, 197, 94, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

/* Fix overscroll white background */
html {
  background: #0d1117 !important;
}
</style>
