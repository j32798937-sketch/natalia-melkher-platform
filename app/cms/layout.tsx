import { redirect } from 'next/navigation'
import { getCurrentSession, getCurrentUser } from '@/lib/services/AuthService'
import { CMSLayout } from '@/components/cms/CMSLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'CMS — Наталья Мельхер',
    template: '%s — CMS',
  },
  robots: { index: false, follow: false },
}

interface CMSRootLayoutProps {
  children: React.ReactNode
}

export default async function CMSRootLayout({ children }: CMSRootLayoutProps) {
  const session = await getCurrentSession()

  // Login page doesn't need the CMS layout shell
  // This layout wraps everything under /cms including /cms/login
  // But CMSLayout (sidebar) only renders for authenticated users

  if (!session) {
    // The middleware already handles redirect for protected paths
    // But /cms/login is allowed without auth
    // Just render children without the CMS shell
    return <>{children}</>
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect('/cms/login')
  }

  return (
    <CMSLayout user={user}>
      {children}
    </CMSLayout>
  )
}