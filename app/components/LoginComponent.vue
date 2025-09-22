<script setup lang="ts">
const { serverError, handleServerError, handleLoginForm } = useFormErrors()

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

const signIn = async () => {
  if (loading.value) return

  const { error } = await login(formData.value)
  if (!error) return navigateTo('/home')

  handleServerError(error)
}
</script>
<template>
  <v-card elevation="15" class="login-card pa-6 sticky-login" rounded="xl">
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
      <v-btn
        elevation="15"
        rounded="xl"
        variant="outlined"
        size="small"
        block
        class="mb-4 light-btn-outlined-variant btn-selected-custom"
        :disabled="loading"
        prepend-icon="mdi-account-plus"
      >
        Criar Conta
      </v-btn>
      <div class="text-center">
        <v-btn
          elevation="15"
          rounded="xl"
          type="submit"
          :disabled="loading"
          variant="text"
          size="small"
          prepend-icon="mdi-help-circle"
          class="text-grey-lighten-1 btn-selected-custom"
        >
          Esqueci minha senha
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<style scoped>
.login-card {
  background: rgba(33, 38, 45, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important; /* xl = 24px */
}

.sticky-login {
  position: sticky;
  top: 20px;
  height: fit-content;
}
</style>
