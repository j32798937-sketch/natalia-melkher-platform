import { NextRequest, NextResponse } from 'next/server'
import { aiConfig } from '@/config/ai.config'
import { runAIAssist } from '@/lib/services/AiService'
import {
  aiAssistSchema,
  validateData,
  formatZodErrors,
  type AIAssistInput,
} from '@/lib/utils/validation'
import { isValidLocale } from '@/lib/i18n/config'
import type { Locale, PostType } from '@/lib/utils/constants'

/**
 * POST /api/ai/assistant
 *
 * Literary AI assistant for the author.
 * Accepts a text fragment and an action (improve, continue, etc.)
 * and returns a refined or extended version.
 */
export async function POST(request: NextRequest) {
  if (!aiConfig.isAvailable()) {
    return NextResponse.json(
      { error: 'AI services are not configured' },
      { status: 503 }
    )
  }

  let json: unknown

  try {
    json = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  // Extract locale/postType outside of aiAssistSchema
  const { locale, postType, ...rest } = (json || {}) as {
    locale?: string
    postType?: PostType
  } & Partial<AIAssistInput>

  const validation = validateData(aiAssistSchema, rest)

  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: formatZodErrors(validation.errors),
      },
      { status: 400 }
    )
  }

  const targetLocale: Locale | undefined =
    locale && isValidLocale(locale) ? (locale as Locale) : undefined

  try {
    const result = await runAIAssist({
      ...validation.data,
      locale: targetLocale,
      postType,
    })

    return NextResponse.json(
      {
        result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Melkher][AI] Assistant error:', error)

    return NextResponse.json(
      { error: 'AI assistant request failed' },
      { status: 500 }
    )
  }
}

