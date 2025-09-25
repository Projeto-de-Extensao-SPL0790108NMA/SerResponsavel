<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Database } from '~~/database/types'

const props = defineProps<{
  modelValue: boolean
  profile: Database['public']['Tables']['profiles']['Row'] | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const formState = reactive({
  fullName: '',
  username: '',
  bio: '',
})

const validationErrors = reactive({
  fullName: '' as string,
  username: '' as string,
})

const loading = ref(false)
const serverError = ref('')

const dialogTitle = computed(() => 'Editar Perfil')

const closeDialog = () => {
  emit('update:modelValue', false)
  serverError.value = ''
  validationErrors.fullName = ''
  validationErrors.username = ''
}

watch(
  () => props.modelValue,
  (value) => {
    if (value && props.profile) {
      formState.fullName = props.profile.full_name || ''
      formState.username = props.profile.username || ''
      formState.bio = props.profile.bio || ''
      serverError.value = ''
      validationErrors.fullName = ''
      validationErrors.username = ''
    }
  },
)

const { updateProfile } = useProfile()

const validate = () => {
  validationErrors.fullName = formState.fullName.trim() ? '' : 'Informe o nome completo'
  validationErrors.username = formState.username.trim() ? '' : 'Informe o username'
  return !validationErrors.fullName && !validationErrors.username
}

const submit = async () => {
  if (!validate()) {
    return
  }

  loading.value = true
  serverError.value = ''

  try {
    const { error } = await updateProfile({
      full_name: formState.fullName.trim(),
      username: formState.username.trim(),
      bio: formState.bio.trim() || null,
    })

    if (error) {
      serverError.value = error.message || 'Não foi possível salvar as alterações.'
      return
    }

    emit('saved')
    closeDialog()
  } catch (error) {
    serverError.value =
      error instanceof Error ? error.message : 'Não foi possível salvar as alterações.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="xl" elevation="15">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-account-edit" class="me-2" color="primary" />
        {{ dialogTitle }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="formState.fullName"
            label="Nome completo"
            variant="outlined"
            density="comfortable"
            :error-messages="validationErrors.fullName"
            prepend-inner-icon="mdi-account"
            autocomplete="name"
            required
          />

          <v-text-field
            v-model="formState.username"
            label="Username"
            variant="outlined"
            density="comfortable"
            :error-messages="validationErrors.username"
            prepend-inner-icon="mdi-account-badge-outline"
            autocomplete="username"
            required
          />

          <v-textarea
            v-model="formState.bio"
            label="Bio"
            variant="outlined"
            rows="4"
            max-rows="6"
            prepend-inner-icon="mdi-text"
            auto-grow
            counter="160"
          />

          <v-alert
            v-if="serverError"
            type="error"
            density="comfortable"
            variant="tonal"
            class="mt-2"
          >
            {{ serverError }}
          </v-alert>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" :loading="loading" @click="submit"> Salvar alterações </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
