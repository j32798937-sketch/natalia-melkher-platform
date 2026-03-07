import { z } from 'zod'
import { LOCALES, POST_STATUS, POST_TYPES } from '@/lib/utils/constants'

/**
 * Common validation schemas using Zod
 */

// ── Primitive Validators ────────────────────────────────

export const emailSchema = z
  .string()
  .min(1, 'Email обязателен')
  .email('Некорректный email')
  .max(255, 'Email слишком длинный')

export const passwordSchema = z
  .string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .max(128, 'Пароль слишком длинный')
  .regex(/[A-Z]/, 'Пароль должен содержать заглавную букву')
  .regex(/[a-z]/, 'Пароль должен содержать строчную букву')
  .regex(/[0-9]/, 'Пароль должен содержать цифру')

export const usernameSchema = z
  .string()
  .min(3, 'Имя пользователя минимум 3 символа')
  .max(50, 'Имя пользователя максимум 50 символов')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Имя пользователя может содержать только буквы, цифры, дефис и подчёркивание'
  )

export const slugSchema = z
  .string()
  .min(1, 'Slug обязателен')
  .max(100, 'Slug слишком длинный')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Некорректный формат slug')

export const localeSchema = z.enum(LOCALES)

// ── Post Schemas ────────────────────────────────────────

export const postCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Заголовок обязателен')
    .max(255, 'Заголовок слишком длинный'),
  slug: z
    .string()
    .max(100, 'Slug слишком длинный')
    .optional(),
  content: z
    .string()
    .min(1, 'Содержание обязательно'),
  excerpt: z
    .string()
    .max(500, 'Описание слишком длинное')
    .optional(),
  type: z.enum([
    POST_TYPES.POETRY,
    POST_TYPES.PROSE,
    POST_TYPES.ESSAY,
    POST_TYPES.REFLECTION,
    POST_TYPES.DIARY,
  ]),
  status: z
    .enum([POST_STATUS.DRAFT, POST_STATUS.PUBLISHED, POST_STATUS.ARCHIVED])
    .default(POST_STATUS.DRAFT),
  categoryId: z
    .number()
    .int()
    .positive()
    .optional(),
  coverImage: z
    .string()
    .url('Некорректный URL изображения')
    .optional()
    .or(z.literal('')),
  featured: z
    .boolean()
    .default(false),
  metaTitle: z
    .string()
    .max(60, 'Meta title максимум 60 символов')
    .optional(),
  metaDescription: z
    .string()
    .max(160, 'Meta description максимум 160 символов')
    .optional(),
  tagIds: z
    .array(z.number().int().positive())
    .optional(),
})

export const postUpdateSchema = postCreateSchema.partial()

export type PostCreateInput = z.infer<typeof postCreateSchema>
export type PostUpdateInput = z.infer<typeof postUpdateSchema>

// ── Translation Schemas ─────────────────────────────────

export const translationSchema = z.object({
  postId: z.number().int().positive(),
  locale: localeSchema,
  title: z
    .string()
    .min(1, 'Заголовок перевода обязателен')
    .max(255),
  content: z
    .string()
    .min(1, 'Содержание перевода обязательно'),
  excerpt: z
    .string()
    .max(500)
    .optional(),
  metaTitle: z
    .string()
    .max(60)
    .optional(),
  metaDescription: z
    .string()
    .max(160)
    .optional(),
  aiTranslated: z
    .boolean()
    .default(false),
})

export type TranslationInput = z.infer<typeof translationSchema>

// ── Category Schemas ────────────────────────────────────

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Название категории обязательно')
    .max(100, 'Название слишком длинное'),
  slug: z
    .string()
    .max(100)
    .optional(),
  description: z
    .string()
    .max(500)
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Некорректный цвет')
    .optional(),
  icon: z
    .string()
    .max(10)
    .optional(),
  sortOrder: z
    .number()
    .int()
    .min(0)
    .default(0),
})

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>

// ── Tag Schemas ─────────────────────────────────────────

export const tagCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Название тега обязательно')
    .max(50, 'Название тега слишком длинное'),
  slug: z
    .string()
    .max(60)
    .optional(),
})

export type TagCreateInput = z.infer<typeof tagCreateSchema>

// ── Auth Schemas ────────────────────────────────────────

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Имя пользователя обязательно'),
  password: z
    .string()
    .min(1, 'Пароль обязателен'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ── Search Schema ───────────────────────────────────────

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Введите поисковый запрос')
    .max(200, 'Запрос слишком длинный'),
  locale: localeSchema.optional(),
  category: z.string().optional(),
  type: z
    .enum([
      POST_TYPES.POETRY,
      POST_TYPES.PROSE,
      POST_TYPES.ESSAY,
      POST_TYPES.REFLECTION,
      POST_TYPES.DIARY,
    ])
    .optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(12),
})

export type SearchInput = z.infer<typeof searchSchema>

// ── AI Schemas ──────────────────────────────────────────

export const aiAssistSchema = z.object({
  text: z
    .string()
    .min(1, 'Текст обязателен')
    .max(10000, 'Текст слишком длинный'),
  action: z.enum(['improve', 'continue', 'rephrase', 'summarize', 'expand']),
  style: z
    .enum(['poetic', 'prose', 'essay', 'neutral'])
    .default('neutral'),
})

export type AIAssistInput = z.infer<typeof aiAssistSchema>

export const aiTranslateSchema = z.object({
  text: z
    .string()
    .min(1, 'Текст обязателен')
    .max(50000, 'Текст слишком длинный для перевода'),
  sourceLang: localeSchema,
  targetLang: localeSchema,
  preserveFormatting: z.boolean().default(true),
})

export type AITranslateInput = z.infer<typeof aiTranslateSchema>

// ── Contact Schema ──────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя обязательно')
    .max(100, 'Имя слишком длинное'),
  email: emailSchema,
  subject: z
    .string()
    .min(3, 'Тема обязательна')
    .max(200, 'Тема слишком длинная'),
  message: z
    .string()
    .min(10, 'Сообщение минимум 10 символов')
    .max(5000, 'Сообщение слишком длинное'),
})

export type ContactInput = z.infer<typeof contactSchema>

// ── Settings Schema ─────────────────────────────────────

export const settingsSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(10000),
  type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
})

export type SettingsInput = z.infer<typeof settingsSchema>

// ── Validation Helpers ──────────────────────────────────

/**
 * Validate data against a Zod schema and return typed result
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

/**
 * Format Zod errors into a user-friendly object
 */
export function formatZodErrors(
  error: z.ZodError
): Record<string, string> {
  const formatted: Record<string, string> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (!formatted[path]) {
      formatted[path] = issue.message
    }
  }

  return formatted
}