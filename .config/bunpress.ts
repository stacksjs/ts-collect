import type { BunpressConfig } from 'bunpress'

const config: BunpressConfig = {
  name: 'ts-collect',
  description: 'A powerful, fully-typed collections library for TypeScript',
  url: 'https://ts-collect.stacksjs.org',
  theme: 'docs',

  nav: [
    { text: 'Guide', link: '/guide/getting-started' },
    { text: 'Methods', link: '/guide/methods' },
    { text: 'GitHub', link: 'https://github.com/stacksjs/ts-collect' },
  ],

  sidebar: [
    {
      text: 'Introduction',
      items: [
        { text: 'Overview', link: '/' },
        { text: 'Getting Started', link: '/guide/getting-started' },
      ],
    },
    {
      text: 'Core Concepts',
      items: [
        { text: 'Collection Methods', link: '/guide/methods' },
        { text: 'Lazy Collections', link: '/guide/lazy' },
        { text: 'Custom Macros', link: '/guide/macros' },
      ],
    },
    {
      text: 'Features',
      items: [
        { text: 'Transformation Methods', link: '/features/transformations' },
        { text: 'Filtering & Searching', link: '/features/filtering' },
        { text: 'Aggregation', link: '/features/aggregation' },
        { text: 'Higher-Order Methods', link: '/features/higher-order' },
      ],
    },
    {
      text: 'Advanced',
      items: [
        { text: 'Performance Optimization', link: '/advanced/performance' },
        { text: 'Memory Management', link: '/advanced/memory' },
        { text: 'Custom Iterators', link: '/advanced/iterators' },
        { text: 'Extending Collections', link: '/advanced/extending' },
      ],
    },
  ],

  socialLinks: [
    { icon: 'github', link: 'https://github.com/stacksjs/ts-collect' },
  ],
}

export default config
