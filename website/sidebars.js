// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'doc',
        id: 'getting-started',
      },
      items: [],
    },
    {
      type: 'category',
      label: 'CLI',
      link: {
        type: 'doc',
        id: 'cli',
      },
      items: [],
    },
    {
      type: 'category',
      label: 'Core',
      link: {
        type: 'doc',
        id: 'core',
      },
      items: [],
    },
    {
      type: 'category',
      label: 'Config',
      link: {
        type: 'doc',
        id: 'config',
      },
      items: [],
    },
    {
      type: 'category',
      label: 'UI',
      link: {
        type: 'doc',
        id: 'ui',
      },
      items: [],
    },
    {
      type: 'category',
      label: 'Utils',
      link: {
        type: 'doc',
        id: 'utils',
      },
      items: [],
    },
  ],
  api: ['api', 'api/templ'],
}

// eslint-disable-next-line no-undef
module.exports = sidebars
