import { getAllPosts } from '@/lib/services/PostService'
import { getCategoriesWithCounts } from '@/lib/services/CategoryService'
import { PostsListClient } from '@/components/cms/PostsListClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Публикации',
}

export default async function CMSPostsPage() {
  let postsResult: Awaited<ReturnType<typeof getAllPosts>> = { data: [], total: 0, page: 1, limit: 20, totalPages: 0 }
  let categories: { id: number; name: string; slug: string }[] = []

  try {
    postsResult = await getAllPosts({ page: 1, limit: 20, sortBy: 'newest' })
    categories = (await getCategoriesWithCounts()).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }))
  } catch (error) {
    console.error('[Melkher] Posts list error:', error)
  }

  return (
    <PostsListClient
      initialPosts={postsResult.data}
      totalPosts={postsResult.total}
      categories={categories}
    />
  )
}