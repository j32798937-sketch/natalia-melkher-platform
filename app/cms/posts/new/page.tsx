import { getCategoriesWithCounts } from '@/lib/services/CategoryService'
import { PostEditorClient } from '@/components/cms/PostEditorClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Новая публикация',
}

export default async function CMSNewPostPage() {
  let categories: { id: number; name: string; slug: string; icon: string }[] = []

  try {
    categories = (await getCategoriesWithCounts()).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
    }))
  } catch (error) {
    console.error('[Melkher] Categories fetch error:', error)
  }

  return (
    <PostEditorClient
      mode="create"
      categories={categories}
    />
  )
}