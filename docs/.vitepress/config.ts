import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Templ",
  description: "A project template",
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
  },
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/rjoydip/templ/edit/main/docs/:path'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Joydip Roy'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'API', link: '/api' },
    ],
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'CLI', link: '/guide/cli' },
          { text: 'Config', link: '/guide/config' },
          { text: 'Core', link: '/guide/core' },
          { text: 'Utils', link: '/guide/utils' },
        ]
      },
      {
        text: 'API',
        link: '/api'
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rjoydip/templ' }
    ]
  }
})
