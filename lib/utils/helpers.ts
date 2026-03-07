/**
 * General helper functions for the platform
 */

/**
 * Calculate reading time for a given text
 * @param text - The text content
 * @param wordsPerMinute - Reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
    if (!text || text.trim().length === 0) return 0
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    const wordCount = cleanText.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return Math.max(1, minutes)
  }
  
  /**
   * Truncate text to a maximum length, preserving whole words
   * @param text - The text to truncate
   * @param maxLength - Maximum character length
   * @param suffix - Suffix to append (default: '…')
   */
  export function truncateText(text: string, maxLength: number, suffix = '…'): string {
    if (!text) return ''
    if (text.length <= maxLength) return text
  
    const truncated = text.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
  
    if (lastSpaceIndex > maxLength * 0.7) {
      return truncated.substring(0, lastSpaceIndex) + suffix
    }
  
    return truncated + suffix
  }
  
  /**
   * Strip HTML tags from a string
   */
  export function stripHtml(html: string): string {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').trim()
  }
  
  /**
   * Generate excerpt from content
   */
  export function generateExcerpt(content: string, maxLength = 160): string {
    const plainText = stripHtml(content)
    return truncateText(plainText, maxLength)
  }
  
  /**
   * Format a number with thousand separators
   */
  export function formatNumber(num: number): string {
    return new Intl.NumberFormat('ru-RU').format(num)
  }
  
  /**
   * Capitalize first letter of a string
   */
  export function capitalize(str: string): string {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  
  /**
   * Debounce function
   */
  export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
  
    return function (this: unknown, ...args: Parameters<T>) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
  
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        timeoutId = null
      }, wait)
    }
  }
  
  /**
   * Throttle function
   */
  export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false
  
    return function (this: unknown, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => {
          inThrottle = false
        }, limit)
      }
    }
  }
  
  /**
   * Deep clone an object
   */
  export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj
    return JSON.parse(JSON.stringify(obj))
  }
  
  /**
   * Check if code is running on server
   */
  export function isServer(): boolean {
    return typeof window === 'undefined'
  }
  
  /**
   * Check if code is running on client
   */
  export function isClient(): boolean {
    return typeof window !== 'undefined'
  }
  
  /**
   * Generate a random ID
   */
  export function generateId(length = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const cryptoObj = typeof window !== 'undefined' ? window.crypto : null
  
    if (cryptoObj) {
      const values = new Uint32Array(length)
      cryptoObj.getRandomValues(values)
      for (let i = 0; i < length; i++) {
        result += chars[values[i] % chars.length]
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
      }
    }
  
    return result
  }
  
  /**
   * Wait for a specified duration
   */
  export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  
  /**
   * Clamp a number between min and max
   */
  export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }
  
  /**
   * Linear interpolation between two values
   */
  export function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
  }
  
  /**
   * Map a value from one range to another
   */
  export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }
  
  /**
   * Get initials from a name
   */
  export function getInitials(name: string): string {
    if (!name) return ''
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }
  
  /**
   * Pluralize a Russian word based on count
   */
  export function pluralizeRu(
    count: number,
    one: string,
    few: string,
    many: string
  ): string {
    const mod10 = count % 10
    const mod100 = count % 100
  
    if (mod100 >= 11 && mod100 <= 19) return many
    if (mod10 === 1) return one
    if (mod10 >= 2 && mod10 <= 4) return few
    return many
  }
  
  /**
   * Format reading time in Russian
   */
  export function formatReadingTime(minutes: number): string {
    return `${minutes} ${pluralizeRu(minutes, 'минута', 'минуты', 'минут')}`
  }
  
  /**
   * Format views count in Russian
   */
  export function formatViews(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return `${views} ${pluralizeRu(views, 'просмотр', 'просмотра', 'просмотров')}`
  }
  
  /**
   * Create URL-safe string from any text
   */
  export function toUrlSafe(text: string): string {
    return encodeURIComponent(text.toLowerCase().replace(/\s+/g, '-'))
  }
  
  /**
   * Extract domain from URL
   */
  export function extractDomain(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }