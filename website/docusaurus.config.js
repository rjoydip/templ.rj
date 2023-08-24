// @ts-check

// Note: type annotations allow type checking and IDEs autocompletion
// eslint-disable-next-line no-undef
const lightCodeTheme = require('prism-react-renderer').themes.github
// eslint-disable-next-line no-undef
const darkCodeTheme = require('prism-react-renderer').themes.dracula

const organizationName = 'rjoydip' // Usually your GitHub org/user name.
const projectName = 'templ' // Usually your repo name.
// const branch = 'main'
const repoUrl = `https://github.com/${organizationName}/${projectName}`

const config = {
  title: 'Templ',
  tagline: '',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://github.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: organizationName, // Usually your GitHub org/user name.
  projectName: projectName, // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'pages',
          routeBasePath: 'pages',
          // eslint-disable-next-line no-undef
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/rjoydip/templ/tree/main/website/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/rjoydip/templ/tree/main/website/blog/',
        },
        theme: {
          // eslint-disable-next-line no-undef
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Templ',
        logo: {
          alt: 'Templ Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            label: 'Docs',
            position: 'left',
            docId: 'getting-started',
          },
          {
            type: 'doc',
            label: 'API',
            position: 'left',
            docId: 'api',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: repoUrl,
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/pages/getting-started',
              },
            ],
          },
          {
            title: 'API',
            items: [
              {
                label: 'API',
                to: '/pages/api',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/templ',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/rjoydip/templ',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Templ.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

// eslint-disable-next-line no-undef
module.exports = config
