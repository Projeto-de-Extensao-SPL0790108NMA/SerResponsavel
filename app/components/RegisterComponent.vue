<script setup lang="ts">
import type { RegisterForm } from '@/types/AuthForm'

const emit = defineEmits<{
  close: []
  switchToLogin: []
}>()

const { register, loading } = useAuth()
const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)
const { serverError, realtimeErrors, handleRegisterForm, handleServerError, hasRealtimeErrors } =
  useRegisterFormErrors()

const isDarkTheme = computed(() => theme.value === 'dark')

const formData = ref<RegisterForm>({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  bio: '',
  avatarUrl: '',
})

watchDebounced(
  formData,
  () => {
    void handleRegisterForm(formData.value)
  },
  {
    debounce: 800,
    deep: true,
  },
)

const successMessage = ref('')

const requiredFieldsSatisfied = computed(() => {
  const requiredValues = [
    formData.value.firstName,
    formData.value.lastName,
    formData.value.username,
    formData.value.email,
    formData.value.password,
    formData.value.confirmPassword,
  ]
  return requiredValues.every((value) => value.trim().length > 0)
})

const submitDisabled = computed(
  () => loading.value || hasRealtimeErrors.value || !requiredFieldsSatisfied.value,
)

const handleSubmit = async () => {
  if (loading.value) return

  serverError.value = ''
  successMessage.value = ''

  await handleRegisterForm(formData.value)

  if (hasRealtimeErrors.value) {
    return
  }

  const { error } = await register(formData.value)

  if (error) {
    handleServerError(error)
    return
  }

  successMessage.value =
    'Cadastro realizado! Verifique seu email para confirmar a conta e faça login em seguida.'
  formData.value = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    avatarUrl: '',
  }

  setTimeout(() => {
    emit('switchToLogin')
    successMessage.value = ''
  }, 2500)
}

const handleCancel = () => {
  emit('close')
}

const goToLogin = () => {
  emit('switchToLogin')
}
</script>

<template>
  <v-card
    elevation="15"
    class="register-card pa-6 borda-radial-branco"
    rounded="xl"
    :class="isDarkTheme ? 'register-card--dark' : 'register-card--light'"
  >
    <v-card-title
      class="text-center mb-4"
      :class="isDarkTheme ? 'register-card__title--dark' : 'register-card__title--light'"
    >
      <v-icon
        icon="mdi-account-plus"
        class="me-2"
        color="secondary"
        :class="isDarkTheme ? '' : 'register-card__icon--light'"
      />
      Crie sua conta
    </v-card-title>

    <v-form :aria-busy="loading" @submit.prevent="handleSubmit">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.firstName"
            label="Nome"
            variant="outlined"
            density="compact"
            rounded
            prepend-inner-icon="mdi-account"
            :error-messages="realtimeErrors.firstName"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.lastName"
            label="Sobrenome"
            variant="outlined"
            density="compact"
            rounded
            prepend-inner-icon="mdi-account"
            :error-messages="realtimeErrors.lastName"
            required
          />
        </v-col>
      </v-row>

      <v-text-field
        v-model="formData.username"
        label="Nome de usuário"
        variant="outlined"
        density="compact"
        rounded
        prepend-inner-icon="mdi-account-badge"
        :error-messages="realtimeErrors.username"
        class="mb-2"
        required
      />

      <v-text-field
        v-model="formData.email"
        label="Email"
        variant="outlined"
        density="compact"
        rounded
        prepend-inner-icon="mdi-email"
        :error-messages="realtimeErrors.email"
        class="mb-2"
        required
      />

      <v-textarea
        v-model="formData.bio"
        label="Biografia (opcional)"
        variant="outlined"
        density="compact"
        rounded
        auto-grow
        rows="2"
        max-rows="4"
        prepend-inner-icon="mdi-text"
        :error-messages="realtimeErrors.bio"
        class="mb-2"
      />

      <v-text-field
        v-model="formData.avatarUrl"
        label="URL do avatar (opcional)"
        variant="outlined"
        density="compact"
        rounded
        prepend-inner-icon="mdi-link"
        :error-messages="realtimeErrors.avatarUrl"
        class="mb-2"
      />

      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.password"
            label="Senha"
            variant="outlined"
            density="compact"
            rounded
            prepend-inner-icon="mdi-lock"
            :type="'password'"
            :error-messages="realtimeErrors.password"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.confirmPassword"
            label="Confirmar senha"
            variant="outlined"
            density="compact"
            rounded
            prepend-inner-icon="mdi-lock-check"
            :type="'password'"
            :error-messages="realtimeErrors.confirmPassword"
            required
          />
        </v-col>
      </v-row>

      <v-alert
        v-if="serverError"
        type="error"
        variant="tonal"
        class="mb-3"
        density="compact"
        :class="isDarkTheme ? '' : 'register-card__alert--light'"
      >
        {{ serverError }}
      </v-alert>

      <v-alert v-if="successMessage" type="success" variant="tonal" density="compact" class="mb-3">
        {{ successMessage }}
      </v-alert>

      <v-btn
        elevation="15"
        type="submit"
        rounded="xl"
        color="secondary"
        size="small"
        block
        class="mb-3 btn-selected-custom"
        prepend-icon="mdi-account-plus"
        :loading="loading"
        :disabled="submitDisabled"
      >
        Cadastrar
      </v-btn>

      <v-row class="text-center mt-2">
        <v-col class="d-flex flex-column gap-2">
          <v-btn
            variant="text"
            size="small"
            prepend-icon="mdi-login"
            class="btn-selected-custom"
            :disabled="loading"
            @click="goToLogin"
          >
            Já tenho uma conta
          </v-btn>
          <v-btn
            variant="tonal"
            color="warning"
            size="small"
            prepend-icon="mdi-close"
            class="btn-selected-custom"
            :disabled="loading"
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
.register-card {
  backdrop-filter: blur(10px);
  transition:
    background 0.3s ease,
    color 0.3s ease,
    border 0.3s ease;
}

.register-card--dark {
  background: rgba(24, 32, 45, 0.95) !important;
  border: 1px solid rgba(94, 234, 212, 0.25);
  color: #e2e8f0;
}

.register-card--light {
  background: rgba(255, 255, 255, 0.94) !important;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #0f172a;
}

.register-card__title--light {
  color: #0f172a;
}

.register-card__title--dark {
  color: #e2e8f0;
}

.register-card__icon--light {
  color: #0f172a !important;
}

.register-card__alert--light {
  background-color: rgba(244, 67, 54, 0.08) !important;
  color: #b71c1c !important;
}
</style>
