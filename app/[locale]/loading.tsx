import { PageSpinner } from '@/components/ui/Spinner'

/**
 * Loading state for locale pages
 * Shown during route transitions via Next.js Suspense
 */
export default function LocaleLoading() {
  return <PageSpinner />
}