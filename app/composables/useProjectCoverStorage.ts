import { resizeImageFile } from '@/utils/imageProcessing'

const PROJECT_COVER_BUCKET = 'project-covers'

const buildUniqueFileName = (slug: string) => {
  const normalizedSlug = slug?.trim() ? slug.trim().toLowerCase() : 'project'
  const sanitizedSlug = normalizedSlug.replace(/[^a-z0-9-]+/g, '-') || 'project'
  const uniqueSuffix = `${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`
  return `${sanitizedSlug}/${uniqueSuffix}.webp`
}

export const useProjectCoverStorage = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)

  const uploadCover = async (file: File, slug: string) => {
    loading.value = true
    try {
      const resizedBlob = await resizeImageFile(file, {
        maxWidth: 1280,
        maxHeight: 720,
        quality: 0.8,
        mimeType: 'image/webp',
      })

      const path = buildUniqueFileName(slug)

      const { error: uploadError } = await supabase.storage
        .from(PROJECT_COVER_BUCKET)
        .upload(path, resizedBlob, {
          contentType: 'image/webp',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Não foi possível enviar a imagem: ${uploadError.message}`)
      }

      const { data: publicUrlData, error: urlError } = supabase.storage
        .from(PROJECT_COVER_BUCKET)
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

  const removeCover = async (path?: string | null) => {
    if (!path) return

    const { error } = await supabase.storage.from(PROJECT_COVER_BUCKET).remove([path])

    if (error) {
      console.warn('Falha ao remover imagem de capa do projeto:', error.message)
    }
  }

  return {
    uploadCover,
    removeCover,
    loading,
  }
}
