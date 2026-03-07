import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/services/PostService'
import { getCategoriesWithCounts } from '@/lib/services/CategoryService'
import { PostEditorClient } from '@/components/cms/PostEditorClient'
import type { Metadata } from 'next'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const { id } = await params
  const post = await getPostById(parseInt(id))

  return {
    title: post ? `Редактировать: ${post.title}` : 'Публикация не найдена',
  }
}

export default async function CMSEditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const postId = parseInt(id)

  if (isNaN(postId)) notFound()

  const post = await getPostById(postId)
  if (!post) notFound()

  let categories: { id: number; name: string; slug: string; icon: string }[] = []

  try {
    categories = (await getCategoriesWithCounts()).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
    }))
  } catch (error) {
    console.error('[Melkher] Categories error:', error)
  }

  return (
    <PostEditorClient
      mode="edit"
      categories={categories}
      initialData={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        type: post.type,
        status: post.status,
        categoryId: post.category_id ? String(post.category_id) : '',
        coverImage: post.cover_image || '',
        featured: post.featured === 1,
        metaTitle: post.meta_title || '',
        metaDescription: post.meta_desc || '',
      }}
    />
  )
}