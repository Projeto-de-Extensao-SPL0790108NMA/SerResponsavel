<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePermissions } from '@/composables/usePermissions'
import type { ProjectWithRelations } from '@/stores/projects'
import { useOrganizationsStore } from '@/stores/organizations'
import type { Database } from '~~/database/types'

type ProjectStatus = Database['public']['Tables']['projects']['Row']['status']

const props = defineProps<{
  mode: 'create' | 'edit'
  project?: ProjectWithRelations | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      name: string
      slug: string
      description?: string
      status: ProjectStatus
      organizationId?: string | null
      coverFile?: File | null
      removeCover?: boolean
    },
  ): void
  (e: 'cancel'): void
}>()

const { isSuperAdmin, organizationId, canManageOrganization } = usePermissions()
const supabase = useSupabaseClient<Database>()
const organizationsStore = useOrganizationsStore()
const { items: organizationCache } = storeToRefs(organizationsStore)

const organizations = ref<Array<{ id: string; name: string }>>([])
const organizationsLoading = ref(false)
const coverInput = ref<File | File[] | null>(null)
const coverFile = ref<File | null>(null)
const coverPreview = ref<string | null>(null)
const coverPreviewIsObjectUrl = ref(false)
const removeCurrentCover = ref(false)

const statusItems: Array<{ value: ProjectStatus; title: string }> = [
  { value: 'in-progress', title: 'Em progresso' },
  { value: 'completed', title: 'Concluído' },
]

const form = reactive({
  name: '',
  slug: '',
  description: '',
  status: 'in-progress' as ProjectStatus,
  organizationId: organizationId.value ?? (null as string | null),
})

const errors = reactive<{ name?: string; slug?: string; organizationId?: string; cover?: string }>(
  {},
)
const slugDirty = ref(false)

const title = computed(() => (props.mode === 'create' ? 'Cadastrar projeto' : 'Editar projeto'))
const submitLabel = computed(() => (props.mode === 'create' ? 'Cadastrar' : 'Salvar alterações'))
const hasCoverPreview = computed(() => Boolean(coverPreview.value))
const canRemoveCover = computed(() => Boolean(props.project?.cover_image_url || coverFile.value))
const showRestoreCover = computed(
  () =>
    props.mode === 'edit' &&
    Boolean(props.project?.cover_image_url) &&
    (coverFile.value || removeCurrentCover.value),
)

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\p{ASCII}]/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const resetErrors = () => {
  errors.name = undefined
  errors.slug = undefined
  errors.organizationId = undefined
  errors.cover = undefined
}

const setCoverPreview = (value: string | null, isObjectUrl = false) => {
  if (coverPreviewIsObjectUrl.value && coverPreview.value) {
    URL.revokeObjectURL(coverPreview.value)
  }
  coverPreview.value = value
  coverPreviewIsObjectUrl.value = isObjectUrl
}

const applyProjectToForm = (project: ProjectWithRelations | null | undefined) => {
  resetErrors()

  if (!project) {
    form.name = ''
    form.slug = ''
    form.description = ''
    form.status = 'in-progress'
    form.organizationId = isSuperAdmin.value ? null : (organizationId.value ?? null)
    coverInput.value = null
    coverFile.value = null
    removeCurrentCover.value = false
    setCoverPreview(null)
    slugDirty.value = false
    return
  }

  form.name = project.name ?? ''
  form.slug = project.slug ?? ''
  form.description = project.description ?? ''
  form.status = project.status ?? 'in-progress'
  form.organizationId = project.organization_id ?? project.organization?.id ?? null
  coverInput.value = null
  coverFile.value = null
  removeCurrentCover.value = false
  setCoverPreview(project.cover_image_url ?? null)
  slugDirty.value = true
}

const loadOrganizations = async () => {
  organizationsLoading.value = true
  try {
    if (isSuperAdmin.value) {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .order('name', { ascending: true })

      if (error) {
        console.error('Erro ao carregar organizações', error)
        organizations.value = []
        return
      }

      organizations.value = data ?? []
      return
    }

    if (organizationId.value) {
      const cached = organizationCache.value[organizationId.value]
      const organization =
        cached ?? (await organizationsStore.fetchOrganization(organizationId.value))

      organizations.value = organization ? [{ id: organization.id, name: organization.name }] : []
      return
    }

    organizations.value = []
  } finally {
    organizationsLoading.value = false
  }
}

const handleCoverChange = (files?: File | File[] | null) => {
  errors.cover = undefined
  coverFile.value = null

  const file = Array.isArray(files) ? (files[0] ?? null) : (files ?? null)

  if (!file) {
    if (props.mode === 'edit' && props.project?.cover_image_url && !removeCurrentCover.value) {
      setCoverPreview(props.project.cover_image_url)
    } else {
      setCoverPreview(null)
    }
    return
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_FILE_SIZE) {
    errors.cover = 'Selecione uma imagem de até 5MB.'
    coverInput.value = null
    setCoverPreview(null)
    return
  }

  coverFile.value = file
  setCoverPreview(URL.createObjectURL(file), true)
  removeCurrentCover.value = props.mode === 'edit' && Boolean(props.project?.cover_image_url)
}

const handleRemoveCover = () => {
  coverInput.value = null
  coverFile.value = null
  removeCurrentCover.value = props.mode === 'edit'
  setCoverPreview(null)
}

const restoreExistingCover = () => {
  if (props.project?.cover_image_url) {
    coverInput.value = null
    coverFile.value = null
    removeCurrentCover.value = false
    setCoverPreview(props.project.cover_image_url)
  }
}

watch(
  () => props.project,
  (project) => {
    applyProjectToForm(project)
  },
  { immediate: true },
)

watch(
  () => props.mode,
  () => {
    if (props.mode === 'create') {
      applyProjectToForm(null)
    }
  },
)

watch(
  () => form.name,
  (value) => {
    if (props.mode === 'create' && !slugDirty.value) {
      form.slug = value ? slugify(value) : ''
    }
  },
)

watch(
  () => isSuperAdmin.value,
  () => {
    void loadOrganizations()
  },
)

watch(
  () => organizationId.value,
  () => {
    if (props.mode === 'create' && !isSuperAdmin.value) {
      form.organizationId = organizationId.value ?? null
    }
    void loadOrganizations()
  },
)

onMounted(() => {
  void loadOrganizations()
})

watch(coverInput, (files) => {
  handleCoverChange(files)
})

onBeforeUnmount(() => {
  setCoverPreview(null)
})

const validate = () => {
  resetErrors()
  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Informe o nome do projeto'
    isValid = false
  }

  if (!form.slug.trim()) {
    errors.slug = 'Informe o identificador do projeto'
    isValid = false
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(form.slug.trim())) {
    errors.slug = 'Use apenas letras minúsculas, números e hifens'
    isValid = false
  }

  if (!isSuperAdmin.value) {
    if (!organizationId.value) {
      errors.organizationId =
        'Você precisa estar vinculado a uma organização para gerenciar projetos'
      isValid = false
    } else if (!canManageOrganization(organizationId.value)) {
      errors.organizationId = 'Você não possui permissão para essa organização'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = () => {
  if (!validate()) return

  emit('submit', {
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim() ? form.description.trim() : undefined,
    status: form.status,
    organizationId: form.organizationId ?? organizationId.value ?? null,
    coverFile: coverFile.value,
    removeCover: removeCurrentCover.value,
  })
}

const handleCancel = () => {
  emit('cancel')
}

const selectedOrganizationLabel = computed(() => {
  if (!form.organizationId) return 'Sem organização'
  const organization = organizations.value.find((item) => item.id === form.organizationId)
  return organization?.name ?? 'Organização'
})
</script>

<template>
  <div>
    <header class="d-flex justify-space-between align-center mb-4">
      <div>
        <h2 class="text-h6 mb-1">{{ title }}</h2>
        <p class="text-body-2 text-grey-lighten-1 mb-0">
          Preencha os campos abaixo para {{ mode === 'create' ? 'cadastrar' : 'atualizar' }} o
          projeto.
        </p>
      </div>
    </header>

    <v-form @submit.prevent="handleSubmit">
      <v-row dense>
        <v-col cols="12">
          <div class="project-form__cover">
            <v-responsive
              v-if="hasCoverPreview"
              aspect-ratio="16/9"
              class="project-form__cover-media"
            >
              <v-img :src="coverPreview" cover :alt="form.name || 'Imagem de capa do projeto'" />
            </v-responsive>
            <div v-else class="project-form__cover-placeholder">
              <v-icon icon="mdi-image-plus" size="48" color="grey-darken-2" />
              <p class="text-body-2 text-grey-lighten-1 mb-0">Adicione uma imagem de capa</p>
            </div>

            <div class="d-flex flex-column flex-sm-row gap-2 mt-3">
              <v-file-input
                v-model="coverInput"
                label="Imagem de capa"
                accept="image/*"
                prepend-icon="mdi-image"
                density="comfortable"
                show-size
                :loading="loading"
                :disabled="loading"
              />
              <div class="d-flex gap-2">
                <v-btn
                  v-if="canRemoveCover"
                  variant="text"
                  color="error"
                  class="text-none"
                  :disabled="loading"
                  @click="handleRemoveCover"
                >
                  Remover capa
                </v-btn>
                <v-btn
                  v-if="showRestoreCover"
                  variant="text"
                  color="primary"
                  class="text-none"
                  :disabled="loading"
                  @click="restoreExistingCover"
                >
                  Restaurar capa atual
                </v-btn>
              </div>
            </div>
            <span v-if="errors.cover" class="text-error text-body-2">{{ errors.cover }}</span>
            <p class="text-caption text-grey-lighten-1 mt-1 mb-0">
              Formatos suportados: JPG, PNG ou WebP. A imagem será otimizada automaticamente.
            </p>
          </div>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="form.name"
            label="Nome do projeto"
            prepend-inner-icon="mdi-text"
            :error-messages="errors.name ? [errors.name] : []"
            autocomplete="off"
            required
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="form.slug"
            label="Identificador (slug)"
            prepend-inner-icon="mdi-link"
            hint="Utilizado na URL do projeto"
            persistent-hint
            autocomplete="off"
            required
            :error-messages="errors.slug ? [errors.slug] : []"
            @update:model-value="
              () => {
                slugDirty.value = true
              }
            "
          />
        </v-col>

        <v-col cols="12">
          <v-select
            v-model="form.status"
            :items="statusItems"
            label="Status"
            item-title="title"
            item-value="value"
            prepend-inner-icon="mdi-flag"
          />
        </v-col>

        <v-col v-if="isSuperAdmin" cols="12">
          <v-select
            v-model="form.organizationId"
            :items="organizations"
            item-title="name"
            item-value="id"
            label="Organização"
            prepend-inner-icon="mdi-domain"
            :loading="organizationsLoading"
            clearable
            :error-messages="errors.organizationId ? [errors.organizationId] : []"
          />
        </v-col>

        <v-col v-else cols="12">
          <v-alert type="info" variant="tonal" class="mb-2" border="start">
            <v-icon icon="mdi-domain" start />
            {{ selectedOrganizationLabel }}
          </v-alert>
          <span v-if="errors.organizationId" class="text-error text-body-2">{{
            errors.organizationId
          }}</span>
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="form.description"
            label="Descrição"
            rows="4"
            auto-grow
            prepend-inner-icon="mdi-text-long"
          />
        </v-col>
      </v-row>

      <div class="d-flex justify-end gap-2 mt-4">
        <v-btn variant="text" color="grey" :disabled="loading" @click="handleCancel">
          Cancelar
        </v-btn>
        <v-btn color="primary" type="submit" :loading="loading">
          {{ submitLabel }}
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<style scoped>
.project-form__cover {
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
}

.project-form__cover-media {
  border-radius: 10px;
  overflow: hidden;
}

.project-form__cover-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
}
</style>
