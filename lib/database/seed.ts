import bcrypt from 'bcryptjs'
import { execute, queryOne, transaction, getTableCount } from '@/lib/database/index'
import { authConfig } from '@/config/auth.config'
import { databaseConfig } from '@/config/database.config'
import { slugify } from '@/lib/utils/slugify'
import { calculateReadingTime } from '@/lib/utils/helpers'

/**
 * Database Seed Data
 *
 * Populates the database with initial content:
 * - Default admin user
 * - Literary categories
 * - Sample tags
 * - Sample publications
 * - Default settings
 */

/**
 * Seed the admin user
 */
async function seedAdminUser(): Promise<void> {
  const existing = await queryOne<{ id: number }>(
    `SELECT id FROM users WHERE username = ?`,
    [authConfig.defaultAdmin.username]
  )

  if (existing) {
    console.log('[Melkher] Admin user already exists, skipping')
    return
  }

  const hashedPassword = bcrypt.hashSync(
    authConfig.defaultAdmin.password,
    authConfig.password.saltRounds
  )

  await execute(
    `INSERT INTO users (username, email, password, role, bio) VALUES (?, ?, ?, 'admin', ?)`,
    [
      authConfig.defaultAdmin.username,
      authConfig.defaultAdmin.email,
      hashedPassword,
      'Писатель, поэт, автор эссе и художественной прозы. Создатель пространства, где слова становятся искусством.',
    ]
  )

  console.log('[Melkher] Admin user created')
}

/**
 * Seed literary categories
 */
async function seedCategories(): Promise<void> {
  const count = await getTableCount('categories')
  if (count > 0) {
    console.log('[Melkher] Categories already exist, skipping')
    return
  }

  const categories = [
    { name: 'Поэзия', slug: 'poetry', description: 'Стихи и поэтические произведения', color: '#C4A882', icon: '✦', sort_order: 1 },
    { name: 'Проза', slug: 'prose', description: 'Рассказы и художественная проза', color: '#8B7355', icon: '◈', sort_order: 2 },
    { name: 'Эссе', slug: 'essays', description: 'Эссе и аналитические размышления', color: '#A6935F', icon: '◇', sort_order: 3 },
    { name: 'Размышления', slug: 'reflections', description: 'Философские заметки и наблюдения', color: '#7A6C5B', icon: '○', sort_order: 4 },
    { name: 'Дневник', slug: 'diary', description: 'Личные записи и наблюдения', color: '#65523B', icon: '△', sort_order: 5 },
  ]

  for (const cat of categories) {
    await execute(
      `INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
      [cat.name, cat.slug, cat.description, cat.color, cat.icon, cat.sort_order]
    )
  }

  console.log('[Melkher] Categories seeded')
}

/**
 * Seed sample tags
 */
async function seedTags(): Promise<void> {
  const count = await getTableCount('tags')
  if (count > 0) {
    console.log('[Melkher] Tags already exist, skipping')
    return
  }

  const tags = [
    'тишина', 'природа', 'время', 'любовь', 'свет',
    'память', 'город', 'ночь', 'море', 'душа',
    'осень', 'весна', 'зима', 'лето', 'дождь',
    'одиночество', 'надежда', 'красота', 'мечта', 'путь',
  ]

  for (const tag of tags) {
    await execute(
      `INSERT INTO tags (name, slug) VALUES (?, ?)`,
      [tag, slugify(tag)]
    )
  }

  console.log('[Melkher] Tags seeded')
}

/**
 * Seed sample publications
 */
async function seedPosts(): Promise<void> {
  const count = await getTableCount('posts')
  if (count > 0) {
    console.log('[Melkher] Posts already exist, skipping')
    return
  }

  const admin = await queryOne<{ id: number }>(`SELECT id FROM users LIMIT 1`)
  if (!admin) {
    console.log('[Melkher] No users found, skipping post seeding')
    return
  }

  const poetryCategory = await queryOne<{ id: number }>(
    `SELECT id FROM categories WHERE slug = 'poetry'`
  )
  const proseCategory = await queryOne<{ id: number }>(
    `SELECT id FROM categories WHERE slug = 'prose'`
  )
  const essayCategory = await queryOne<{ id: number }>(
    `SELECT id FROM categories WHERE slug = 'essays'`
  )
  const reflectionCategory = await queryOne<{ id: number }>(
    `SELECT id FROM categories WHERE slug = 'reflections'`
  )

  const posts = [
    {
      title: 'Тишина между строк',
      slug: 'tishina-mezhdu-strok',
      content: `<p>Тишина живёт между строк,</p>
<p>Там, где слово ещё не родилось,</p>
<p>Где мысль — как утренний поток —</p>
<p>Течёт туда, где сердце билось.</p>

<p>Не говори мне о делах,</p>
<p>О суете и шуме дня.</p>
<p>Послушай тишину в словах —</p>
<p>Она звучит, как песнь огня.</p>

<p>В ней есть и нежность, и печаль,</p>
<p>И свет, что виден лишь в ночи.</p>
<p>Она прозрачна, словно шаль</p>
<p>Из лунного литого луча.</p>`,
      excerpt: 'Стихотворение о тишине, которая живёт между словами и строками, о пространстве, где рождаются мысли.',
      type: 'poetry',
      category_id: poetryCategory?.id,
      featured: 1,
      status: 'published',
    },
    {
      title: 'Утро в старом городе',
      slug: 'utro-v-starom-gorode',
      content: `<p>Старый город просыпается медленно, будто нехотя. Первые лучи солнца скользят по каменным стенам, находя трещины, которых вчера ещё не было — или которые были всегда, просто никто не замечал.</p>

<p>Я иду по узкой улице, и мои шаги отдаются эхом от стен, помнящих другие шаги — тысячи, миллионы шагов тех, кто проходил здесь до меня. Каждый камень под ногами — чья-то история. Каждая дверь — чья-то тайна.</p>

<p>В маленькой кофейне на углу пахнет свежим хлебом и корицей. Хозяйка — пожилая женщина с добрыми глазами — ставит передо мной чашку, не спрашивая, что я хочу. Она знает. Здесь все друг друга знают, даже незнакомцев.</p>

<p>Я сижу у окна и смотрю, как город наполняется жизнью. Вот открывается цветочный магазин напротив, и запах роз смешивается с запахом кофе. Вот проходит мальчик с огромным рюкзаком, торопясь в школу. Вот старик на скамейке разворачивает газету, хотя все новости он уже знает — он читает не новости, а привычку.</p>

<p>Утро в старом городе — это не время суток. Это состояние души.</p>`,
      excerpt: 'Зарисовка о пробуждении старого города, где каждый камень хранит историю, а утро — это состояние души.',
      type: 'prose',
      category_id: proseCategory?.id,
      featured: 1,
      status: 'published',
    },
    {
      title: 'О природе вдохновения',
      slug: 'o-prirode-vdokhnoveniya',
      content: `<p>Вдохновение не приходит по расписанию. Оно не подчиняется будильникам и календарям. Оно приходит тогда, когда ты перестаёшь его ждать — в три часа ночи, в очереди за хлебом, в момент, когда ты уже решил, что сегодня ничего не напишешь.</p>

<p>Многие считают вдохновение даром. Я считаю его дисциплиной. Не потому, что его можно вызвать усилием воли, а потому, что нужно быть готовым, когда оно придёт. Готовым — значит внимательным. Значит открытым. Значит живым.</p>

<p>Писатель, который ждёт вдохновения, подобен рыбаку, который ждёт, пока рыба сама запрыгнет в лодку. Нужно забросить сеть. Нужно сидеть у воды. Нужно быть терпеливым и бдительным одновременно.</p>

<p>Вдохновение — это не молния. Это медленный рассвет. Сначала едва заметный, потом всё ярче, и вот уже весь мир залит светом, и ты видишь то, чего не видел минуту назад. И тогда ты пишешь — не потому что хочешь, а потому что не можешь не писать.</p>`,
      excerpt: 'Эссе о природе творческого вдохновения, о дисциплине внимания и готовности к моменту, когда слова начинают звучать.',
      type: 'essay',
      category_id: essayCategory?.id,
      featured: 0,
      status: 'published',
    },
    {
      title: 'Свет сквозь листву',
      slug: 'svet-skvoz-listvu',
      content: `<p>Свет сквозь листву — как слово сквозь молчание.</p>
<p>Он падает неровно, пятнами,</p>
<p>Рисуя на земле узоры,</p>
<p>Которые не повторятся никогда.</p>

<p>Я стою под деревом и думаю</p>
<p>О том, что каждый луч —</p>
<p>Это чья-то мысль,</p>
<p>Пробившаяся сквозь преграды.</p>

<p>И если бы я мог</p>
<p>Собрать все эти лучи в ладони,</p>
<p>Я бы знал ответы</p>
<p>На вопросы, которые ещё не задал.</p>`,
      excerpt: 'Стихотворение о свете, пробивающемся сквозь листву, как метафора мыслей, пробивающихся сквозь тишину.',
      type: 'poetry',
      category_id: poetryCategory?.id,
      featured: 0,
      status: 'published',
    },
    {
      title: 'Записка перед рассветом',
      slug: 'zapiska-pered-rassvetom',
      content: `<p>Четыре утра. За окном — та особенная тишина, которая бывает только перед рассветом. Город спит, и в этом сне он настоящий. Без масок, без спешки, без притворства.</p>

<p>Я не могу спать. Не потому что тревожно — наоборот, потому что так спокойно, что хочется это спокойствие запомнить. Записать. Сохранить.</p>

<p>Иногда мне кажется, что самые важные мысли приходят именно в эти часы — между ночью и днём, между сном и явью. Когда мир ещё не определился, кем ему быть сегодня.</p>

<p>Скоро рассвет. Скоро всё начнётся сначала. Но сейчас — эта минута тишины — она моя.</p>`,
      excerpt: 'Дневниковая запись о тишине перед рассветом и мыслях, которые приходят между ночью и днём.',
      type: 'diary',
      category_id: reflectionCategory?.id,
      featured: 0,
      status: 'published',
    },
  ]

  for (const post of posts) {
    const readingTime = calculateReadingTime(post.content)
    const now = new Date().toISOString()

    await execute(
      `INSERT INTO posts (title, slug, author_id, category_id, content, excerpt, type, status, featured, reading_time, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post.title,
        post.slug,
        admin.id,
        post.category_id || null,
        post.content,
        post.excerpt,
        post.type,
        post.status,
        post.featured,
        readingTime,
        now,
        now,
        now,
      ]
    )
  }

  // Assign tags to posts
  const allPosts = [
    { slug: 'tishina-mezhdu-strok', tags: ['тишина', 'душа', 'красота'] },
    { slug: 'utro-v-starom-gorode', tags: ['город', 'время', 'память'] },
    { slug: 'o-prirode-vdokhnoveniya', tags: ['свет', 'путь', 'надежда'] },
    { slug: 'svet-skvoz-listvu', tags: ['свет', 'природа', 'тишина'] },
    { slug: 'zapiska-pered-rassvetom', tags: ['ночь', 'тишина', 'время'] },
  ]

  const insertPostTag =
    databaseConfig.provider === 'postgresql'
      ? `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?) ON CONFLICT (post_id, tag_id) DO NOTHING`
      : `INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)`

  for (const postData of allPosts) {
    const post = await queryOne<{ id: number }>(
      `SELECT id FROM posts WHERE slug = ?`,
      [postData.slug]
    )
    if (!post) continue

    for (const tagName of postData.tags) {
      const tag = await queryOne<{ id: number }>(
        `SELECT id FROM tags WHERE name = ?`,
        [tagName]
      )
      if (!tag) continue

      try {
        await execute(insertPostTag, [post.id, tag.id])
      } catch {
        // Ignore duplicate entries
      }
    }
  }

  console.log('[Melkher] Sample posts seeded')
}

/**
 * Seed default settings
 */
async function seedSettings(): Promise<void> {
  const count = await getTableCount('settings')
  if (count > 0) {
    console.log('[Melkher] Settings already exist, skipping')
    return
  }

  const settings = [
    { key: 'site_name', value: 'Наталья Мельхер', type: 'string' },
    { key: 'site_description', value: 'Литературная платформа — поэзия, проза, размышления', type: 'string' },
    { key: 'default_locale', value: 'ru', type: 'string' },
    { key: 'posts_per_page', value: '12', type: 'number' },
    { key: 'enable_ai', value: 'true', type: 'boolean' },
    { key: 'enable_tts', value: 'true', type: 'boolean' },
    { key: 'enable_analytics', value: 'false', type: 'boolean' },
    { key: 'author_bio', value: 'Писатель, поэт, автор эссе и художественной прозы.', type: 'string' },
    { key: 'contact_email', value: 'contact@natalia-melkher.com', type: 'string' },
    { key: 'theme_default', value: 'light', type: 'string' },
  ]

  for (const setting of settings) {
    await execute(
      `INSERT INTO settings (key, value, type) VALUES (?, ?, ?)`,
      [setting.key, setting.value, setting.type]
    )
  }

  console.log('[Melkher] Settings seeded')
}

/**
 * Run all seed functions
 */
export async function seedDatabase(): Promise<void> {
  console.log('[Melkher] Seeding database...')

  await transaction(async () => {
    await seedAdminUser()
    await seedCategories()
    await seedTags()
    await seedPosts()
    await seedSettings()
  })

  console.log('[Melkher] Database seeding complete')
}

/**
 * Initialize database and seed if empty
 */
export async function initializeAndSeed(): Promise<void> {
  const { initializeDatabase } = await import('@/lib/database/migrations')
  await initializeDatabase()

  const userCount = await getTableCount('users')
  if (userCount === 0) {
    await seedDatabase()
  } else {
    console.log('[Melkher] Database already has data, skipping seed')
  }
}