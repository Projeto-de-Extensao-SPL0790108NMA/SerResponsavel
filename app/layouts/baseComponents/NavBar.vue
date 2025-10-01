<script setup lang="ts">
const authStore = useAuthStore()
const preferencesStore = usePreferencesStore()
const { logout } = useAuth()
const dialog = ref(false)

// Reactive state
const drawer = ref(false)

// Theme state
const { theme } = storeToRefs(preferencesStore)
const isDarkTheme = computed(() => theme.value === 'dark')
const themeToggleIcon = computed(() =>
  isDarkTheme.value ? 'mdi-white-balance-sunny' : 'mdi-weather-night',
)
const themeToggleTooltip = computed(() =>
  isDarkTheme.value ? 'Ativar tema claro' : 'Ativar tema escuro',
)

const toggleTheme = () => {
  preferencesStore.toggleTheme()
}

const handleThemeSwitch = (value: boolean) => {
  preferencesStore.setTheme(value ? 'dark' : 'light')
}

// Reactive store refs
const { isAuthenticated, fullName, username, avatarUrl } = storeToRefs(authStore)

// Methods
const openLoginDialog = () => {
  dialog.value = true
  drawer.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close drawer when route changes
watch(
  () => useRoute().path,
  () => {
    drawer.value = false
  },
)
</script>

<template>
  <div>
    <v-app-bar app fixed elevation="15" class="navbar-color">
      <v-container style="max-width: 1080px" class="d-flex align-center pa-0">
        <!-- Logo/Brand -->
        <div class="d-flex align-center">
          <v-img
            src="/logoserresp600_598.png"
            alt="SerResponsável Logo"
            width="50"
            height="50"
            class="mx-3"
          />
          <span class="text-h6 font-weight-bold text-white">SerResponsável</span>
        </div>

        <v-spacer />

        <!-- Navigation Items -->
        <div class="d-none d-md-flex align-center">
          <v-tooltip :text="themeToggleTooltip" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                class="text-white me-2"
                @click="toggleTheme"
              >
                <v-icon :icon="themeToggleIcon" />
              </v-btn>
            </template>
          </v-tooltip>

          <template v-if="isAuthenticated">
            <!-- Authenticated Navigation -->

            <!-- User Menu -->
            <v-menu>
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="text" class="text-white ms-2">
                  <v-avatar size="32" class="me-2">
                    <v-img v-if="avatarUrl" :src="avatarUrl" :alt="fullName" />
                    <v-icon v-else>mdi-account-circle</v-icon>
                  </v-avatar>
                  {{ fullName }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title>Perfil</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Configurações</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item @click="handleLogout">
                  <v-list-item-title>Sair</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template v-else>
            <v-btn
              size="small"
              rounded="xl"
              variant="outlined"
              class="text-white ms-2 light-btn-outlined-variant"
              border="white"
              prepend-icon="mdi-login"
              @click="openLoginDialog"
            >
              Entrar
            </v-btn>

            <v-btn
              variant="flat"
              prepend-icon="mdi-account-plus"
              class="ms-2 mr-5"
              color="secondary"
              size="small"
              rounded="xl"
            >
              Cadastrar
            </v-btn>
          </template>
        </div>

        <!-- Mobile Menu -->
        <v-app-bar-nav-icon
          class="d-md-none"
          color="white"
          density="comfortable"
          @click="drawer = !drawer"
        />
      </v-container>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary location="right" width="280">
      <v-list>
        <v-list-item>
          <template #prepend>
            <v-icon>mdi-theme-light-dark</v-icon>
          </template>
          <v-list-item-title>Tema escuro</v-list-item-title>
          <template #append>
            <v-switch
              :model-value="isDarkTheme"
              color="primary"
              @update:model-value="handleThemeSwitch"
            />
          </template>
        </v-list-item>

        <v-divider class="my-2" />

        <!-- User Info (if authenticated) -->
        <template v-if="isAuthenticated">
          <v-list-item class="px-4 py-3">
            <template #prepend>
              <v-avatar size="48">
                <v-img v-if="avatarUrl" :src="avatarUrl" :alt="fullName" />
                <v-icon v-else size="48">mdi-account-circle</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">
              {{ fullName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ username }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider />

          <!-- Authenticated Mobile Navigation -->
          <v-list-item>
            <template #prepend>
              <v-icon>mdi-folder-multiple</v-icon>
            </template>
            <v-list-item-title>Projetos</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-format-list-checks</v-icon>
            </template>
            <v-list-item-title>Tarefas</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>Perfil</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title>Configurações</v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list-item @click="handleLogout">
            <template #prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </template>

        <template v-else>
          <!-- Unauthenticated Mobile Navigation -->
          <v-list-item @click="openLoginDialog">
            <template #prepend>
              <v-icon>mdi-login</v-icon>
            </template>
            <v-list-item-title>Entrar</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-account-plus</v-icon>
            </template>
            <v-list-item-title>Cadastrar</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-dialog
      v-model="dialog"
      max-width="50%"
      :fullscreen="$vuetify.display.smAndDown"
      transition="dialog-bottom-transition"
    >
      <LoginComponent @close="dialog = false" />
    </v-dialog>
  </div>
</template>
