<script setup lang="ts">
// Emits
const emit = defineEmits<{
  close: []
}>()

const { serverError, realtimeErrors, handleServerError, handleLoginForm } = useFormErrors()
const { login, loginWithProvider, loading } = useAuth()

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
  <v-card elevation="15" class="login-card pa-6 borda-radial-branco" rounded="xl">
    <v-card-title class="text-center mb-4 text-white">
      <v-icon icon="mdi-login" class="me-2" color="primary" />
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
      <v-alert v-if="serverError" type="error" variant="tonal" class="mb-3" density="compact">
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
        class="mb-3 btn-selected-custom"
        prepend-icon="mdi-login"
      >
        Entrar
      </v-btn>

      <v-divider class="my-4" />

      <v-btn
        elevation="15"
        type="button"
        rounded="xl"
        color="white"
        variant="outlined"
        size="small"
        block
        class="mb-3 text-grey-lighten-1 btn-selected-custom"
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
            class="text-grey-lighten-1 btn-selected-custom ma-2"
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
            class="text-grey-lighten-1 btn-selected-custom ma-2"
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
  background: rgba(33, 38, 45, 0.95) !important;
  backdrop-filter: blur(10px);
}
</style>
