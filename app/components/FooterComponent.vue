<script lang="ts" setup>
const currentYear = computed(() => new Date().getFullYear())

const socialLinks = [
  { icon: 'mdi-github', url: '#', label: 'GitHub' },
  { icon: 'mdi-twitter', url: '#', label: 'Twitter' },
  { icon: 'mdi-linkedin', url: '#', label: 'LinkedIn' },
  { icon: 'mdi-instagram', url: '#', label: 'Instagram' },
]

const footerLinks = [
  { title: 'Sobre', url: '/about' },
  { title: 'Política de Privacidade', url: '/privacy' },
  { title: 'Termos de Uso', url: '/terms' },
  { title: 'Contato', url: '/contact' },
]
</script>

<template>
  <v-footer class="footer-gradient">
    <v-container max-width="1080">
      <v-row align="center" justify="center">
        <!-- Logo e Descrição -->
        <v-col cols="12" md="4" class="text-center text-md-start">
          <div class="d-flex align-center justify-center justify-md-start mb-3">
            <v-img
              src="/logoserresp600_598.png"
              alt="SerResponsável Logo"
              max-width="32"
              max-height="32"
              class="me-2"
            />
            <span class="text-h6 font-weight-bold text-white">SerResponsável</span>
          </div>
          <p class="text-body-2 text-grey-lighten-1 mb-0">Plataforma de Transparência Social</p>
        </v-col>

        <!-- Links -->
        <v-col cols="12" md="4" class="text-center">
          <div class="d-flex flex-wrap justify-center gap-4">
            <v-btn
              v-for="link in footerLinks"
              :key="link.title"
              :href="link.url"
              variant="text"
              size="small"
              rounded="xl"
              class="text-grey-lighten-1 px-2"
            >
              {{ link.title }}
            </v-btn>
          </div>
        </v-col>

        <!-- Social Networks -->
        <v-col cols="12" md="4" class="text-center text-md-end">
          <div class="d-flex justify-center justify-md-end align-center mb-3">
            <v-btn
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.url"
              :aria-label="social.label"
              variant="text"
              icon
              size="small"
              class="text-grey-lighten-1 mx-1"
            >
              <v-icon>{{ social.icon }}</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4 opacity-25" />

      <!-- Copyright -->
      <v-row>
        <v-col cols="12" class="text-center">
          <p class="text-caption text-grey-lighten-1 mb-0">
            © {{ currentYear }} SerResponsável (1.0.0-alpha.70). Todos os direitos reservados.<br />
            <span class="text-grey-darken-1">
              Desenvolvido com
              <v-icon size="12" color="red">mdi-heart</v-icon>
              para transparência social.
            </span>
          </p>
        </v-col>
      </v-row>

      <!-- Powered by -->
      <v-row>
        <v-col cols="12" class="text-center mb-2">
          <div class="d-flex align-center justify-center">
            <span class="text-caption text-grey-darken-1 me-2">Powered by</span>
            <v-tooltip location="top" content-class="custom-tooltip-bg" offset="8">
              <template #activator="{ props }">
                <a
                  v-bind="props"
                  href="https://stdout.dev.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="powered-by-link"
                >
                  <v-avatar color="white" class="pa-1">
                    <v-img src="/logo/logoStd500_500.png" alt="StdOut Dev Br" max-width="80" />
                  </v-avatar>
                </a>
              </template>
              <div class="tooltip-content">
                <div class="tooltip-title">✨ StdOut Dev</div>
                <div class="tooltip-subtitle">Todo poder emana do código!</div>
              </div>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<!--suppress CssUnusedSymbol, CssUnresolvedCustomProperty -->
<style scoped>
.footer-gradient {
  background: linear-gradient(
    135deg,
    #0d1117 0%,
    #161b22 25%,
    #1c2128 50%,
    #21262d 75%,
    #0d1117 100%
  ) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1001;
}

.footer-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(25, 118, 210, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.v-btn.text-grey-lighten-1:hover {
  color: rgb(var(--v-theme-primary)) !important;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.v-btn[aria-label]:hover .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.powered-by-link {
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.powered-by-link:hover {
  transform: translateY(-2px) scale(1.5);
}

.powered-by-link:hover .v-avatar {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.tooltip-content {
  text-align: center;
  padding: 8px 12px;
}

.tooltip-title {
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 2px;
}

.tooltip-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

/* Custom tooltip background */
:global(.custom-tooltip-bg) {
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.95) 0%,
    rgba(13, 71, 161, 0.95) 100%
  ) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: tooltip-appear 0.3s ease-out;
}

@keyframes tooltip-appear {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
