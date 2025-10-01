<script setup lang="ts">
// Emits
const emit = defineEmits<{
  close: []
}>()

const { serverError, realtimeErrors, handleServerError, handleLoginForm } = useFormErrors()
const { login, loginWithProvider, loading } = useAuth()
const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)

const isDarkTheme = computed(() => theme.value === 'dark')

const formData = ref({
  email: '',
  password: '',
})

watchDebounced(
  formData,
  () => {
    handleLoginForm(formData.value)
  },
  {
    debounce: 1000,
    deep: true,
  },
)

const hasRealtimeErrors = () =>
  Boolean(realtimeErrors.value.email.length || realtimeErrors.value.password.length)

const signIn = async () => {
  if (loading.value) return

  serverError.value = ''
  await handleLoginForm(formData.value)

  if (hasRealtimeErrors()) {
    return
  }

  const { error } = await login(formData.value)
  if (!error) {
    emit('close') // Fechar dialog após login bem-sucedido
    return navigateTo('/home')
  }

  handleServerError(error)
}

const signInWithGithub = async () => {
  if (loading.value) return

  serverError.value = ''
  const { error } = await loginWithProvider('github')

  if (error) {
    handleServerError(error)
  }
}

// Função para cancelar e fechar o dialog
const handleCancel = () => {
  emit('close')
}
</script>
<template>
  <v-card
    elevation="15"
    class="login-card pa-6 borda-radial-branco"
    rounded="xl"
    :class="isDarkTheme ? 'login-card--dark' : 'login-card--light'"
  >
    <v-card-title
      class="text-center mb-4"
      :class="isDarkTheme ? 'login-card__title--dark' : 'login-card__title--light'"
    >
      <v-icon
        icon="mdi-login"
        class="me-2"
        color="primary"
        :class="isDarkTheme ? '' : 'login-card__icon--light'"
      />
      Acesse a Plataforma
    </v-card-title>
    <v-form :aria-busy="loading" @submit.prevent="signIn">
      <v-text-field
        v-model="formData.email"
        label="Email"
        variant="outlined"
        density="compact"
        rounded
        prepend-inner-icon="mdi-account"
        class="mb-2"
        required
        :error-messages="realtimeErrors.email"
      />
      <v-text-field
        v-model="formData.password"
        label="Senha"
        density="compact"
        variant="outlined"
        rounded
        prepend-inner-icon="mdi-lock"
        type="password"
        class="mb-2"
        required
        :error-messages="realtimeErrors.password"
      />
      <!-- Error Alert -->
      <v-alert
        v-if="serverError"
        type="error"
        variant="tonal"
        class="mb-3"
        density="compact"
        :class="isDarkTheme ? '' : 'login-card__alert--light'"
      >
        {{ serverError }}
      </v-alert>

      <v-btn
        elevation="15"
        type="submit"
        rounded="xl"
        color="primary"
        size="small"
        block
        :loading="loading"
        :disabled="loading"
        class="mb-3 btn-selected-custom login-card__submit"
        prepend-icon="mdi-login"
      >
        Entrar
      </v-btn>

      <v-divider class="my-4" />

      <v-btn
        elevation="15"
        type="button"
        rounded="xl"
        :color="isDarkTheme ? 'white' : 'primary'"
        :variant="isDarkTheme ? 'outlined' : 'tonal'"
        size="small"
        block
        class="mb-3 btn-selected-custom"
        prepend-icon="mdi-github"
        :disabled="loading"
        @click="signInWithGithub"
      >
        Entrar com GitHub
      </v-btn>

      <v-row class="text-center mt-5">
        <v-col>
          <v-btn
            elevation="15"
            rounded="xl"
            type="submit"
            :disabled="loading"
            variant="text"
            size="small"
            prepend-icon="mdi-help-circle"
            :class="[
              'btn-selected-custom',
              'ma-2',
              isDarkTheme ? 'login-card__link--dark' : 'login-card__link--light',
            ]"
          >
            Esqueci minha senha
          </v-btn>

          <v-btn
            elevation="15"
            rounded="xl"
            :disabled="loading"
            variant="tonal"
            size="small"
            prepend-icon="mdi-close"
            :class="[
              'btn-selected-custom',
              'ma-2',
              isDarkTheme ? 'login-card__link--dark' : 'login-card__link--light',
            ]"
            @click="handleCancel"
          >
            Cancelar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<style scoped>
.login-card {
  backdrop-filter: blur(10px);
  transition:
    background 0.3s ease,
    color 0.3s ease,
    border 0.3s ease;
}

.login-card--dark {
  background: rgba(24, 32, 45, 0.95) !important;
  border: 1px solid rgba(25, 118, 210, 0.2);
  color: #e2e8f0;
}

.login-card--light {
  background: rgba(255, 255, 255, 0.94) !important;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #0f172a;
}

.login-card__title--light {
  color: #0f172a;
}

.login-card__title--dark {
  color: #f8fafc;
}

.login-card__icon--light {
  filter: drop-shadow(0 2px 5px rgba(15, 23, 42, 0.1));
}

.login-card__alert--light {
  color: #b91c1c !important;
}

.login-card__submit {
  color: #f8fafc !important;
}

.login-card__link--dark {
  color: #d1d9f5 !important;
}

.login-card__link--light {
  color: #1f3a6e !important;
}
</style>
