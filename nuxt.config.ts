// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'vuetify-nuxt-module',
    '@nuxtjs/supabase',
  ],

  ssr: true,
  
  // SEO and meta tag configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'SerResponsável - Plataforma de Transparência e Gestão de Responsabilidade Social',
      meta: [
        { name: 'description', content: 'Primeira plataforma brasileira que unifica gestão acadêmica e corporativa de responsabilidade social. Centraliza, gerencia e mensura ações de empresas, ONGs, instituições de ensino e poder público.' },
        { name: 'keywords', content: 'responsabilidade social, ESG, transparência social, impacto social, sustentabilidade, Uninorte, Amazonas, ONGs, projetos sociais' },
        { name: 'author', content: 'Uninorte - Centro Universitário do Norte' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'SerResponsável' },
        { property: 'og:title', content: 'SerResponsável - Transparência Social Verificada' },
        { property: 'og:description', content: 'Transforme sua gestão de responsabilidade social com ranqueamento de impacto real, certificação digital e dashboard ESG automatizado.' },
        { property: 'og:image', content: '/logoserresp600_598.png' },
        { property: 'og:image:width', content: '600' },
        { property: 'og:image:height', content: '598' },
        { property: 'og:locale', content: 'pt_BR' },
        { property: 'og:url', content: 'https://ser-responsavel.vercel.app/' },
        
        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@SerResponsavel' },
        { name: 'twitter:creator', content: '@SerResponsavel' },
        { name: 'twitter:title', content: 'SerResponsável - Transparência Social Verificada' },
        { name: 'twitter:description', content: 'Primeira plataforma que unifica gestão acadêmica e corporativa de responsabilidade social.' },
        { name: 'twitter:image', content: '/logoserresp600_598.png' },
        
        // Additional meta tags
        { name: 'robots', content: 'index, follow' },
      ]
    }
  },

  vuetify: {
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
          },
        },
      },
    },
  },
})
