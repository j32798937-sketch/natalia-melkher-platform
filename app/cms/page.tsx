import { getPostStats } from '@/lib/services/PostService'
import { getCategoriesWithCounts } from '@/lib/services/CategoryService'
import { DashboardClient } from '@/components/cms/DashboardClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Панель управления',
}

export default async function CMSDashboardPage() {
  let stats = { total: 0, published: 0, drafts: 0, totalViews: 0 }
  let categories: { name: string; post_count: number; icon: string }[] = []

  try {
    stats = await getPostStats()
    categories = (await getCategoriesWithCounts()).map((c) => ({
      name: c.name,
      post_count: c.post_count,
      icon: c.icon,
    }))
  } catch (error) {
    console.error('[Melkher] Dashboard data error:', error)
  }

  return <DashboardClient stats={stats} categories={categories} />
}