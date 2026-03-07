/**
 * HTML sanitization utilities
 * Protects against XSS attacks while preserving safe literary formatting
 */

/**
 * Map of allowed HTML tags and their permitted attributes
 */
const ALLOWED_TAGS: Record<string, string[]> = {
    // Block elements
    'p': ['class', 'style'],
    'div': ['class'],
    'h1': ['class', 'id'],
    'h2': ['class', 'id'],
    'h3': ['class', 'id'],
    'h4': ['class', 'id'],
    'h5': ['class', 'id'],
    'h6': ['class', 'id'],
    'blockquote': ['class', 'cite'],
    'pre': ['class'],
    'hr': [],
  
    // Inline elements
    'span': ['class', 'style'],
    'strong': ['class'],
    'b': ['class'],
    'em': ['class'],
    'i': ['class'],
    'u': ['class'],
    's': ['class'],
    'mark': ['class'],
    'small': ['class'],
    'sub': [],
    'sup': [],
    'br': [],
  
    // Lists
    'ul': ['class'],
    'ol': ['class', 'start', 'type'],
    'li': ['class'],
  
    // Links
    'a': ['href', 'title', 'target', 'rel', 'class'],
  
    // Images
    'img': ['src', 'alt', 'title', 'width', 'height', 'class', 'loading'],
  
    // Table
    'table': ['class'],
    'thead': [],
    'tbody': [],
    'tr': [],
    'th': ['class', 'colspan', 'rowspan'],
    'td': ['class', 'colspan', 'rowspan'],
  
    // Semantic
    'figure': ['class'],
    'figcaption': ['class'],
    'details': ['class', 'open'],
    'summary': ['class'],
    'time': ['datetime', 'class'],
    'abbr': ['title', 'class'],
  }
  
  /**
   * Allowed CSS properties for style attributes
   */
  const ALLOWED_CSS_PROPERTIES: string[] = [
    'color',
    'background-color',
    'font-size',
    'font-weight',
    'font-style',
    'text-align',
    'text-decoration',
    'text-indent',
    'line-height',
    'letter-spacing',
    'margin',
    'margin-top',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'padding',
    'padding-top',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'opacity',
  ]
  
  /**
   * Dangerous URL protocols
   */
  const DANGEROUS_PROTOCOLS = [
    'javascript:',
    'vbscript:',
    'data:text/html',
    'data:application',
  ]
  
  /**
   * Sanitize a style attribute value
   */
  function sanitizeStyle(style: string): string {
    const declarations = style.split(';').filter(Boolean)
    const safe: string[] = []
  
    for (const declaration of declarations) {
      const [property, ...valueParts] = declaration.split(':')
      if (!property || valueParts.length === 0) continue
  
      const prop = property.trim().toLowerCase()
      const value = valueParts.join(':').trim()
  
      if (ALLOWED_CSS_PROPERTIES.includes(prop)) {
        // Check for dangerous values
        if (
          !value.includes('expression(') &&
          !value.includes('url(') &&
          !value.includes('javascript:')
        ) {
          safe.push(`${prop}: ${value}`)
        }
      }
    }
  
    return safe.join('; ')
  }
  
  /**
   * Check if a URL is safe
   */
  function isSafeUrl(url: string): boolean {
    const trimmed = url.trim().toLowerCase()
    return !DANGEROUS_PROTOCOLS.some((protocol) => trimmed.startsWith(protocol))
  }
  
  /**
   * Sanitize an attribute value based on the attribute name
   */
  function sanitizeAttribute(tagName: string, attrName: string, attrValue: string): string | null {
    const lowerAttr = attrName.toLowerCase()
  
    // Check if the attribute is allowed for this tag
    const allowedAttrs = ALLOWED_TAGS[tagName.toLowerCase()]
    if (!allowedAttrs || !allowedAttrs.includes(lowerAttr)) {
      return null
    }
  
    // Sanitize href and src
    if (lowerAttr === 'href' || lowerAttr === 'src') {
      if (!isSafeUrl(attrValue)) return null
    }
  
    // Sanitize style
    if (lowerAttr === 'style') {
      const sanitized = sanitizeStyle(attrValue)
      return sanitized || null
    }
  
    // Sanitize target
    if (lowerAttr === 'target') {
      return attrValue === '_blank' ? '_blank' : null
    }
  
    // Add rel=noopener for external links
    if (lowerAttr === 'rel' && tagName.toLowerCase() === 'a') {
      return 'noopener noreferrer'
    }
  
    return attrValue
  }
  
  /**
   * Escape HTML special characters
   */
  export function escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
  
    return text.replace(/[&<>"']/g, (char) => map[char] || char)
  }
  
  /**
   * Unescape HTML entities
   */
  export function unescapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
    }
  
    return text.replace(/&(?:amp|lt|gt|quot|#039|#x27|#x2F);/g, (entity) => map[entity] || entity)
  }
  
  /**
   * Sanitize HTML content — removes dangerous tags and attributes
   * while preserving safe literary formatting.
   *
   * This is a lightweight sanitizer. For production use with user-generated
   * content, consider using DOMPurify or rehype-sanitize.
   *
   * @param html - Raw HTML string
   * @returns Sanitized HTML string
   */
  export function sanitizeHtml(html: string): string {
    if (!html) return ''
  
    // Remove script tags and their content
    let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
    // Remove style tags and their content
    clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
    // Remove event handler attributes
    clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  
    // Process tags
    clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)?\/?>/g, (match, tagName, attrs) => {
      const lowerTag = tagName.toLowerCase()
  
      // Remove disallowed tags entirely
      if (!ALLOWED_TAGS[lowerTag]) {
        return ''
      }
  
      // Self-closing tags
      if (['br', 'hr', 'img'].includes(lowerTag)) {
        if (match.startsWith('</')) return ''
  
        if (!attrs) return `<${lowerTag} />`
  
        // Process attributes
        const safeAttrs = processAttributes(lowerTag, attrs)
        return `<${lowerTag}${safeAttrs} />`
      }
  
      // Closing tags
      if (match.startsWith('</')) {
        return `</${lowerTag}>`
      }
  
      // Opening tags with attributes
      if (!attrs || attrs.trim() === '') {
        return `<${lowerTag}>`
      }
  
      const safeAttrs = processAttributes(lowerTag, attrs)
      return `<${lowerTag}${safeAttrs}>`
    })
  
    return clean
  }
  
  /**
   * Process and sanitize tag attributes
   */
  function processAttributes(tagName: string, attrsString: string): string {
    const attrRegex = /([a-zA-Z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g
    const safeAttrs: string[] = []
    let attrMatch: RegExpExecArray | null
  
    while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
      const attrName = attrMatch[1]
      const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? ''
  
      const sanitized = sanitizeAttribute(tagName, attrName, attrValue)
      if (sanitized !== null) {
        safeAttrs.push(`${attrName.toLowerCase()}="${escapeHtml(sanitized)}"`)
      }
    }
  
    // Auto-add rel="noopener noreferrer" for links with target="_blank"
    if (tagName === 'a' && safeAttrs.some((a) => a.includes('target="_blank"'))) {
      if (!safeAttrs.some((a) => a.startsWith('rel='))) {
        safeAttrs.push('rel="noopener noreferrer"')
      }
    }
  
    return safeAttrs.length > 0 ? ' ' + safeAttrs.join(' ') : ''
  }
  
  /**
   * Sanitize plain text input (for search queries, form fields, etc.)
   */
  export function sanitizeInput(input: string): string {
    if (!input) return ''
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
  }
  
  /**
   * Sanitize a filename
   */
  export function sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^[._]/, '')
      .substring(0, 255)
  }