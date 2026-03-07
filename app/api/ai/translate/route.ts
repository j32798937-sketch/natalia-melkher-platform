import { NextRequest, NextResponse } from 'next/server'
import { aiConfig } from '@/config/ai.config'
import { runAITranslate } from '@/lib/services/AiService'
import {
  aiTranslateSchema,
  validateData,
  formatZodErrors,
  type AITranslateInput,
} from '@/lib/utils/validation'
import { isValidLocale } from '@/lib/i18n/config'
import type { Locale } from '@/lib/utils/constants'

/**
 * POST /api/ai/translate
 *
 * Literary translation endpoint.
 * Accepts source/target locales and text, returns translated text.
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

  const body = (json || {}) as AITranslateInput

  const validation = validateData(aiTranslateSchema, body)

  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: formatZodErrors(validation.errors),
      },
      { status: 400 }
    )
  }

  const { sourceLang, targetLang, text, preserveFormatting } = validation.data

  // Extra safeguard on locales
  if (!isValidLocale(sourceLang) || !isValidLocale(targetLang)) {
    return NextResponse.json(
      { error: 'Unsupported locale' },
      { status: 400 }
    )
  }

  try {
    const result = await runAITranslate({
      text,
      sourceLang: sourceLang as Locale,
      targetLang: targetLang as Locale,
      preserveFormatting,
    })

    return NextResponse.json(
      {
        result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Melkher][AI] Translation error:', error)

    return NextResponse.json(
      { error: 'AI translation request failed' },
      { status: 500 }
    )
  }
}

