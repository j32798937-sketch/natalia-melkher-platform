import { NextRequest, NextResponse } from 'next/server'
import { aiConfig } from '@/config/ai.config'
import { runAIIllustration } from '@/lib/services/AiService'
import { isValidLocale } from '@/lib/i18n/config'
import type { Locale } from '@/lib/utils/constants'

interface IllustrationBody {
  prompt?: string
  locale?: string
  styleHint?: string
}

/**
 * POST /api/ai/illustration
 *
 * Generates a literary illustration using the configured
 * image model (DALL-E) and returns an image URL.
 */
export async function POST(request: NextRequest) {
  if (!aiConfig.isAvailable()) {
    return NextResponse.json(
      { error: 'AI services are not configured' },
      { status: 503 }
    )
  }

  let json: IllustrationBody

  try {
    json = (await request.json()) as IllustrationBody
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const { prompt, locale, styleHint } = json || {}

  if (!prompt || !prompt.trim()) {
    return NextResponse.json(
      { error: 'Prompt is required' },
      { status: 400 }
    )
  }

  const trimmedPrompt = prompt.trim()

  // Basic length guard against overly long prompts
  if (trimmedPrompt.length > 2000) {
    return NextResponse.json(
      { error: 'Prompt is too long' },
      { status: 400 }
    )
  }

  const targetLocale: Locale | undefined =
    locale && isValidLocale(locale) ? (locale as Locale) : undefined

  try {
    const result = await runAIIllustration({
      prompt: trimmedPrompt,
      locale: targetLocale,
      styleHint: styleHint?.trim() || undefined,
    })

    return NextResponse.json(
      {
        url: result.url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Melkher][AI] Illustration error:', error)

    return NextResponse.json(
      { error: 'AI illustration request failed' },
      { status: 500 }
    )
  }
}

