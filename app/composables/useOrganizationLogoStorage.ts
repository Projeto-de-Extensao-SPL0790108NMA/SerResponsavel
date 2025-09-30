import { ref } from 'vue'
import { resizeImageFile } from '@/utils/imageProcessing'

const ORGANIZATION_LOGO_BUCKET = 'organizations-logo'

const sanitizeIdentifier = (value: string) => {
  const normalized = value?.trim().toLowerCase() || 'organization'
  return normalized.replace(/[^a-z0-9-]+/g, '-') || 'organization'
}

const buildUniqueFileName = (identifier: string) => {
  const sanitized = sanitizeIdentifier(identifier)
  const uniqueSuffix = `${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`
  return `${sanitized}/${uniqueSuffix}.webp`
}

const extractPathFromPublicUrl = (value: string): string | null => {
  try {
    const url = new URL(value)
    const marker = `${ORGANIZATION_LOGO_BUCKET}/`
    const index = url.pathname.indexOf(marker)
    if (index === -1) return null
    return url.pathname.slice(index + marker.length)
  } catch {
    return null
  }
}

const normalizeStoragePath = (value?: string | null): string | null => {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) {
    const extracted = extractPathFromPublicUrl(trimmed)
    return extracted ? extracted.replace(/^\/+/, '') : null
  }
  return trimmed.replace(/^\/+/, '') || null
}

export const useOrganizationLogoStorage = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)

  const uploadLogo = async (file: File, identifier: string) => {
    loading.value = true
    try {
      const resizedBlob = await resizeImageFile(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.85,
        mimeType: 'image/webp',
      })

      const path = buildUniqueFileName(identifier)
      const { error: uploadError } = await supabase.storage
        .from(ORGANIZATION_LOGO_BUCKET)
        .upload(path, resizedBlob, {
          contentType: 'image/webp',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Não foi possível enviar a imagem: ${uploadError.message}`)
      }

      const { data: publicUrlData, error: urlError } = supabase.storage
        .from(ORGANIZATION_LOGO_BUCKET)
        .getPublicUrl(path)

      if (urlError) {
        throw new Error(`Não foi possível obter a URL da imagem: ${urlError.message}`)
      }

      return {
        path,
        url: publicUrlData.publicUrl,
      }
    } finally {
      loading.value = false
    }
  }

  const removeLogo = async (value?: string | null) => {
    const normalizedPath = normalizeStoragePath(value)
    if (!normalizedPath) return

    const segments = normalizedPath.split('/')
    const fileName = segments.pop()
    const directory = segments.join('/')

    if (!fileName) return

    const { data: existingObjects, error: listError } = await supabase.storage
      .from(ORGANIZATION_LOGO_BUCKET)
      .list(directory || undefined, { search: fileName })

    if (listError) {
      console.warn('Falha ao verificar existência da logo de organização:', listError.message)
      return
    }

    const fileExists = existingObjects?.some((item) => item.name === fileName)

    if (!fileExists) {
      console.info('Logo da organização não encontrada no bucket. Nenhuma remoção necessária.')
      return
    }

    const { error: removeError } = await supabase.storage
      .from(ORGANIZATION_LOGO_BUCKET)
      .remove([normalizedPath])

    if (removeError) {
      console.warn('Falha ao remover logo da organização:', removeError.message)
    }
  }

  return {
    uploadLogo,
    removeLogo,
    loading,
  }
}
