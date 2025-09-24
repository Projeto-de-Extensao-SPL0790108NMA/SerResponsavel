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
    <v-container>
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
            © {{ currentYear }} SerResponsável. Todos os direitos reservados.
            <span class="text-grey-darken-1">
              Desenvolvido com
              <v-icon size="12" color="red">mdi-heart</v-icon>
              para transparência social
            </span>
          </p>
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
</style>
