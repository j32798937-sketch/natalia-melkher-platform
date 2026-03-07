/**
 * AI Services configuration
 */
export const aiConfig = {
    /**
     * OpenAI API settings
     */
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 4096,
      temperature: 0.7,
      baseUrl: 'https://api.openai.com/v1',
    },
  
    /**
     * AI Writing Assistant settings
     */
    assistant: {
      /**
       * System prompt for the literary AI assistant
       */
      systemPrompt: `Ты — литературный ассистент для писательницы Натальи Мельхер.
  Ты помогаешь с текстами в художественном стиле: поэзия, проза, эссе, размышления.
  Твои ответы должны быть:
  - Литературно выверенными
  - Стилистически элегантными
  - Уважающими авторский голос
  - На языке оригинала текста
  
  Ты НЕ пишешь тексты за автора. Ты предлагаешь варианты, улучшения, развитие идей.
  Ты сохраняешь интонацию и ритм оригинального текста.`,
  
      /**
       * Maximum input length for assistant
       */
      maxInputLength: 10000,
  
      /**
       * Rate limit: requests per hour
       */
      rateLimit: 30,
    },
  
    /**
     * AI Translation settings
     */
    translation: {
      /**
       * System prompt for translation
       */
      systemPrompt: `Ты — профессиональный литературный переводчик.
  Ты переводишь художественные тексты, сохраняя:
  - Поэтический ритм и размер (для стихов)
  - Авторский стиль и интонацию
  - Образность и метафоры
  - Эмоциональную окраску
  - Структуру и форматирование текста
  
  Перевод должен звучать естественно на целевом языке,
  не как дословный перевод, а как литературная адаптация.`,
  
      /**
       * Maximum input length for translation
       */
      maxInputLength: 50000,
  
      /**
       * Rate limit: requests per hour
       */
      rateLimit: 20,
    },
  
    /**
     * AI Recommendations settings
     */
    recommendations: {
      /**
       * Maximum number of recommendations to return
       */
      maxResults: 6,
  
      /**
       * Minimum similarity score (0-1) for recommendations
       */
      minSimilarity: 0.3,
    },
  
    /**
     * AI Illustration settings
     */
    illustration: {
      /**
       * DALL-E model
       */
      model: 'dall-e-3',
  
      /**
       * Default image size
       */
      size: '1024x1024' as const,
  
      /**
       * Style prompt prefix
       */
      stylePrefix:
        'Minimalist, elegant, artistic illustration in muted warm tones. Literary and poetic atmosphere. Subtle textures, soft lighting. ',
  
      /**
       * Quality setting
       */
      quality: 'standard' as const,
  
      /**
       * Rate limit: requests per hour
       */
      rateLimit: 10,
    },
  
    /**
     * Semantic Search settings
     */
    search: {
      /**
       * Embedding model for semantic search
       */
      embeddingModel: 'text-embedding-3-small',
  
      /**
       * Maximum search results
       */
      maxResults: 20,
  
      /**
       * Minimum relevance score
       */
      minScore: 0.5,
    },
  
    /**
     * Check if AI services are available
     */
    isAvailable(): boolean {
      return Boolean(this.openai.apiKey && this.openai.apiKey !== 'sk-your-key-here')
    },
  } as const