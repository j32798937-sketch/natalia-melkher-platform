import OpenAI from 'openai'
import { aiConfig } from '@/config/ai.config'
import type { Locale, PostType } from '@/lib/utils/constants'
import type {
  AIAssistInput,
  AITranslateInput,
} from '@/lib/utils/validation'

/**
 * AI Service
 *
 * Thin wrapper around the OpenAI client that:
 * - Uses centralized configuration from aiConfig
 * - Applies literary system prompts for assistant / translation
 * - Keeps a singleton client instance per runtime
 */

let openaiClient: OpenAI | null = null

function getClient(): OpenAI {
  if (!aiConfig.isAvailable()) {
    throw new Error('AI services are not configured')
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: aiConfig.openai.apiKey,
      baseURL: aiConfig.openai.baseUrl,
    })
  }

  return openaiClient
}

function mapPostTypeToStyle(type?: PostType): 'poetic' | 'prose' | 'essay' | 'neutral' {
  if (!type) return 'neutral'
  switch (type) {
    case 'poetry':
      return 'poetic'
    case 'prose':
      return 'prose'
    case 'essay':
      return 'essay'
    default:
      return 'neutral'
  }
}

function getLocaleLabel(locale?: Locale): string {
  switch (locale) {
    case 'ru':
      return 'русский'
    case 'en':
      return 'английский'
    case 'de':
      return 'немецкий'
    case 'fr':
      return 'французский'
    case 'cn':
      return 'китайский'
    case 'kr':
      return 'корейский'
    default:
      return 'язык оригинала'
  }
}

export interface AIAssistOptions extends AIAssistInput {
  locale?: Locale
  postType?: PostType
}

export interface AITranslateOptions extends AITranslateInput {}

export interface AIIllustrationOptions {
  /**
   * Literary prompt / description provided by the author.
   * Can be a fragment of the text or a separate brief.
   */
  prompt: string
  /**
   * Optional locale for hinting textual elements inside the image.
   */
  locale?: Locale
  /**
   * Optional explicit style override.
   * If not provided, uses aiConfig.illustration.stylePrefix.
   */
  styleHint?: string
}

/**
 * Literary assistant for the author.
 *
 * Supports several high-level actions:
 * - improve   — улучшить текст, не меняя голос автора
 * - continue  — продолжить текст в том же стиле
 * - rephrase  — переформулировать, сохранив смысл
 * - summarize — аккуратно сократить текст
 * - expand    — развить и расширить фрагмент
 */
export async function runAIAssist(options: AIAssistOptions): Promise<string> {
  const client = getClient()

  const { text, action, style, locale, postType } = options

  const targetStyle = style === 'neutral' ? mapPostTypeToStyle(postType) : style

  const localeLabel = getLocaleLabel(locale)

  let instruction: string

  switch (action) {
    case 'improve':
      instruction =
        'Аккуратно улучшить текст: сделать его более выразительным, точным и цельным, сохраняя авторский голос и интонацию. Не менять смысл и не переписывать текст полностью.'
      break
    case 'continue':
      instruction =
        'Продолжить текст в том же стиле, темпе и настроении, естественно развивая уже заданную интонацию. Не повторять исходный текст.'
      break
    case 'rephrase':
      instruction =
        'Переформулировать текст, сохраняя исходный смысл, образность и эмоциональный тон. Можно менять структуру фраз, но не смысл.'
      break
    case 'summarize':
      instruction =
        'Создать компактную литературную выжимку текста, уделяя внимание интонации и ключевым образам. Не превращать в сухое изложение.'
      break
    case 'expand':
      instruction =
        'Расширить текст: мягко развить мысли, добавить детали и образы, не ломая исходный стиль и голос автора.'
      break
    default:
      instruction =
        'Отнестись к тексту бережно и работать с ним как с литературным материалом.'
  }

  const styleNote =
    targetStyle === 'poetic'
      ? 'Работай с текстом как с поэзией: ритм, паузы, образность важнее буквальной логики.'
      : targetStyle === 'prose'
        ? 'Сохраняй плавность прозы, внимание к деталям и внутреннему ритму фраз.'
        : targetStyle === 'essay'
          ? 'Сохраняй эссеистский тон: размышление, интонация доверительного разговора и интеллектуальная ясность.'
          : 'Сохраняй общий литературный стиль и голос автора.'

  const systemPrompt = aiConfig.assistant.systemPrompt

  const userContent = [
    `Язык текста: ${localeLabel}.`,
    `Действие: ${action}.`,
    `Литературный режим: ${targetStyle}.`,
    '',
    instruction,
    styleNote,
    '',
    'Работай только с приведённым ниже фрагментом. Не добавляй объяснений, только результат.',
    '',
    'Текст:',
    text,
  ].join('\n')

  const completion = await client.chat.completions.create({
    model: aiConfig.openai.model,
    temperature: aiConfig.openai.temperature,
    max_tokens: aiConfig.openai.maxTokens,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
  })

  const result =
    completion.choices[0]?.message?.content?.toString().trim() ?? ''

  return result
}

/**
 * Literary translation helper.
 *
 * Uses aiConfig.translation.systemPrompt and preserves
 * formatting when requested.
 */
export async function runAITranslate(
  options: AITranslateOptions
): Promise<string> {
  const client = getClient()

  const { text, sourceLang, targetLang, preserveFormatting } = options

  const systemPrompt = aiConfig.translation.systemPrompt

  const sourceLabel = getLocaleLabel(sourceLang as Locale)
  const targetLabel = getLocaleLabel(targetLang as Locale)

  const userContent = [
    `Переведи приведённый ниже текст с языка "${sourceLabel}" на язык "${targetLabel}".`,
    preserveFormatting
      ? 'По возможности сохрани разметку и структуру абзацев (пустые строки, переносы строк).'
      : 'Разметку можно упростить, но важно сохранить структуру и ритм.',
    'Это художественный текст; важны голос автора, ритм, образность и интонация.',
    '',
    'Текст для перевода:',
    text,
  ].join('\n')

  const completion = await client.chat.completions.create({
    model: aiConfig.openai.model,
    temperature: aiConfig.openai.temperature,
    max_tokens: aiConfig.openai.maxTokens,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
  })

  const result =
    completion.choices[0]?.message?.content?.toString().trim() ?? ''

  return result
}

/**
 * Literary illustration generator.
 *
 * Produces a single image URL based on the configured DALL-E model
 * and a style prefix tuned for the Natalia Melkher platform.
 */
export async function runAIIllustration(
  options: AIIllustrationOptions
): Promise<{ url: string }> {
  const client = getClient()

  const { prompt, locale, styleHint } = options

  const localeLabel = getLocaleLabel(locale)

  const fullPrompt = [
    aiConfig.illustration.stylePrefix,
    `Литературная иллюстрация для произведения на языке: ${localeLabel}.`,
    'Изображение не должно содержать текст, логотипы или надписи, только визуальные образы.',
    '',
    'Сюжет / описание:',
    prompt,
    styleHint ? `\nДополнительные стилистические пожелания: ${styleHint}` : '',
  ]
    .join('\n')
    .trim()

  const response = await client.images.generate({
    model: aiConfig.illustration.model,
    prompt: fullPrompt,
    size: aiConfig.illustration.size,
    quality: aiConfig.illustration.quality,
    n: 1,
    response_format: 'url',
  })

  const url = response.data?.[0]?.url

  if (!url) {
    throw new Error('Failed to generate illustration')
  }

  return { url }
}

