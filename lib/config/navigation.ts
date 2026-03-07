export interface NavItem {
    label: string
    href: string
    translationKey: string
    icon?: string
    children?: NavItem[]
  }
  
  export const mainNavigation: NavItem[] = [
    {
      label: 'Главная',
      href: '/',
      translationKey: 'nav.home',
      icon: '◈',
    },
    {
      label: 'Библиотека',
      href: '/library',
      translationKey: 'nav.library',
      icon: '✦',
      children: [
        {
          label: 'Поэзия',
          href: '/library/poetry',
          translationKey: 'nav.poetry',
        },
        {
          label: 'Проза',
          href: '/library/prose',
          translationKey: 'nav.prose',
        },
        {
          label: 'Эссе',
          href: '/library/essays',
          translationKey: 'nav.essays',
        },
        {
          label: 'Размышления',
          href: '/library/reflections',
          translationKey: 'nav.reflections',
        },
        {
          label: 'Дневник',
          href: '/library/diary',
          translationKey: 'nav.diary',
        },
      ],
    },
    {
      label: 'Об авторе',
      href: '/about',
      translationKey: 'nav.about',
      icon: '○',
    },
    {
      label: 'Контакт',
      href: '/contact',
      translationKey: 'nav.contact',
      icon: '△',
    },
  ]
  
  export const cmsNavigation: NavItem[] = [
    {
      label: 'Панель управления',
      href: '/cms',
      translationKey: 'cms.dashboard',
      icon: '◈',
    },
    {
      label: 'Публикации',
      href: '/cms/posts',
      translationKey: 'cms.posts',
      icon: '✦',
    },
    {
      label: 'Медиа',
      href: '/cms/media',
      translationKey: 'cms.media',
      icon: '◇',
    },
    {
      label: 'Категории',
      href: '/cms/categories',
      translationKey: 'cms.categories',
      icon: '○',
    },
    {
      label: 'Аналитика',
      href: '/cms/analytics',
      translationKey: 'cms.analytics',
      icon: '△',
    },
    {
      label: 'Настройки',
      href: '/cms/settings',
      translationKey: 'cms.settings',
      icon: '⚙',
    },
  ]
  
  export const footerNavigation = {
    literary: [
      { label: 'Поэзия', href: '/library/poetry', translationKey: 'nav.poetry' },
      { label: 'Проза', href: '/library/prose', translationKey: 'nav.prose' },
      { label: 'Эссе', href: '/library/essays', translationKey: 'nav.essays' },
      { label: 'Размышления', href: '/library/reflections', translationKey: 'nav.reflections' },
      { label: 'Дневник', href: '/library/diary', translationKey: 'nav.diary' },
    ],
    about: [
      { label: 'Об авторе', href: '/about', translationKey: 'nav.about' },
      { label: 'Контакт', href: '/contact', translationKey: 'nav.contact' },
    ],
  }