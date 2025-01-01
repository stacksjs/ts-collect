import type { HeadConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig } from 'vitepress'
import dynamicRoutes from '../api/dynamicRoutes'
import viteConfig from './vite.config'

// https://vitepress.dev/reference/site-config

const analyticsHead: HeadConfig[] = [
  [
    'script',
    {
      'src': 'https://cdn.usefathom.com/script.js',
      'data-site': 'EGVEPJYT',
      'defer': '',
    },
  ],
]
const nav = [
  { text: 'News', link: 'https://stacksjs.org/news' },
  { text: 'Changelog', link: 'https://github.com/stacksjs/ts-collect/releases' },
  {
    text: 'Resources',
    items: [
      { text: 'Showcase', link: '/Showcase' },
      { text: 'Team', link: '/team' },
      { text: 'Sponsors', link: '/sponsors' },
      { text: 'Partners', link: '/partners' },
      { text: 'Postcardware', link: '/postcardware' },
      { text: 'License', link: '/license' },
      {
        items: [
          { text: 'Awesome Stacks', link: 'https://github.com/stacksjs/awesome-stacks' },
          { text: 'Contributing', link: 'https://github.com/stacksjs/ts-collect/blob/main/.github/CONTRIBUTING.md' },
        ],
      },
    ],
  },
]

const sidebar = [
  {
    text: 'Get Started',
    items: [
      { text: 'Intro', link: '/intro' },
      { text: 'Install', link: '/install' },
      { text: 'Usage', link: '/usage' },
    ],
  },
  {
    text: 'API',
    items: [
      {
        text: 'Aggregation',
        collapsed: false,
        items: dynamicRoutes
          .filter(route => [
            'aggregate',
            'average',
            'avg',
            'count',
            'countBy',
            'max',
            'median',
            'min',
            'mode',
            'sum',
            'product',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
      {
        text: 'Array Operations',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'chunk',
            'collapse',
            'flatten',
            'flip',
            'pad',
            'reverse',
            'shuffle',
            'slice',
            'splice',
            'wrap',
            'unfold',
            'unwrap',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
      {
        text: 'Collection Manipulation',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'combine',
            'concat',
            'merge',
            'mergeRecursive',
            'push',
            'pop',
            'pull',
            'put',
            'replace',
            'replaceRecursive',
            'shift',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
      {
        text: 'Filtering',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'filter',
            'filterAsync',
            'reject',
            'where',
            'whereBetween',
            'whereIn',
            'whereInstanceOf',
            'whereLike',
            'whereNotBetween',
            'whereNotIn',
            'whereNotNull',
            'whereRegex',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
      {
        text: 'Mapping & Transformation',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'map',
            'flatMap',
            'mapAsync',
            'mapInto',
            'mapOption',
            'mapSpread',
            'mapToDictionary',
            'mapToGroups',
            'mapUntil',
            'mapWithKeys',
            'reduce',
            'reduceAsync',
            'transform',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
      {
        text: 'Grouping & Sorting',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'groupBy',
            'groupByMultiple',
            'sortBy',
            'sortByDesc',
            'sortKeys',
            'sortKeysDesc',
            'keyBy',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
      {
        text: 'Statistics & Math',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'standardDeviation',
            'variance',
            'covariance',
            'kurtosis',
            'skewness',
            'zscore',
            'linearRegression',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
      {
        text: 'Time Series',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'timeSeries',
            'forecast',
            'seasonality',
            'trend',
            'movingAverage',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
      {
        text: 'Utilities',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'debug',
            'dd',
            'dump',
            'tap',
            'pipe',
            'profile',
            'validate',
            'validateSync',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
      {
        text: 'Query & Search',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'first',
            'firstWhere',
            'firstOrFail',
            'last',
            'lazy',
            'query',
            'search',
            'fuzzyMatch',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Data Transformation',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'pivot',
            'pivotTable',
            'transform',
            'split',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Data Conversion',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'toArray',
            'toMap',
            'toSet',
            'toPandas',
            'toSql',
            'toGraphQL',
            'toElastic',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Set Operations',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'union',
            'intersect',
            'difference',
            'symmetricDiff',
            'unique',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Iteration & Flow Control',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'each',
            'eachSpread',
            'everyAsync',
            'someAsync',
            'unless',
            'when',
            'whenEmpty',
            'whenNotEmpty',
            'takeUntil',
            'takeWhile',
            'skipUntil',
            'skipWhile',
            'times',
            'parallel',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Joins & Relations',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'join',
            'leftJoin',
            'crossJoin',
            'zip',
            'cartesianProduct',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Validation & Checking',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'assertValid',
            'contains',
            'containsAll',
            'containsOneItem',
            'doesntContain',
            'has',
            'isEmpty',
            'isNotEmpty',
            'unlessEmpty',
            'unlessNotEmpty',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Advanced Math',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'convolve',
            'correlate',
            'differentiate',
            'entropy',
            'fft',
            'frequency',
            'geoDistance',
            'integrate',
            'interpolate',
            'kmeans',
            'power',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Data Formatting',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'cast',
            'dateTime',
            'implode',
            'money',
            'slug',
            'lower',
            'upper',
            'sanitize',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Performance & Diagnostics',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'batch',
            'benchmark',
            'cursor',
            'explain',
            'metrics',
            'parallel',
            'profile',
            'stream',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Data Access',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'except',
            'first',
            'get',
            'keys',
            'last',
            'nth',
            'only',
            'pluck',
            'random',
            'values',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Diff & Comparison',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'diffAssoc',
            'diffKeys',
            'diffUsing',
            'duplicates',
            'outliers',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Pagination',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'forPage',
            'paginate',
            'skip',
            'take',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Object Manipulation',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'as',
            'forget',
            'having',
            'index',
            'macro',
            'make',
            'omit',
            'partition',
            'pick',
            'prepend',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },

      {
        text: 'Helper Methods',
        collapsed: true,
        items: dynamicRoutes
          .filter(route => [
            'all',
            'configure',
            'describe',
            'fromStream',
            'playground',
            'scan',
            'sole',
            'undot',
          ].includes(route.path))
          .sort((a, b) => a.path.localeCompare(b.path))
          .map(route => ({
            text: route.path,
            link: `/api/${route.path}`,
          })),
      },
    ],
  },
  { text: 'Showcase', link: '/Showcase' },
]

const description = 'Lightweight & powerful Laravel-like Collections written for TypeScript.'
const title = 'ts-collect | Lightweight & powerful Laravel-like Collections written for TypeScript.'

export default withPwa(
  defineConfig({
    lang: 'en-US',
    title: 'ts-collect',
    description: 'Lightweight & powerful Laravel-like Collections written for TypeScript.',
    metaChunk: true,
    cleanUrls: true,
    lastUpdated: true,

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: './images/logo-mini.svg' }],
      ['link', { rel: 'icon', type: 'image/png', href: './images/logo.png' }],
      ['meta', { name: 'theme-color', content: '#0A0ABC' }],
      ['meta', { name: 'title', content: title }],
      ['meta', { name: 'description', content: description }],
      ['meta', { name: 'author', content: 'Stacks.js, Inc.' }],
      ['meta', {
        name: 'tags',
        content: 'ts-collect, typescript, collection, lightweight, Laravel-like, type-safe, API documentation, data processing, statistical analysis, machine learning, clustering algorithms, linear regression, K-means clustering, KNN, anomaly detection, normalization, outlier detection, z-score, standard deviation, time series, moving average, trend detection, forecasting, stream processing, JSON serialization, CSV export, XML generation, Elasticsearch integration, Pandas DataFrame, sentiment analysis, text processing, n-grams, word frequency, advanced mathematics, FFT, signal processing, differentiation, integration, geographic calculations, financial formatting, currency handling, datetime operations, version tracking, data validation, schema validation, lazy evaluation, asynchronous operations, batch processing, caching mechanisms, debugging tools, profiling utilities, performance monitoring, memory optimization, error handling, internationalization, locale support, timezone management',
      }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'en' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:site_name', content: 'ts-collect' }],
      ['meta', { property: 'og:image', content: '/images/og-image.jpg' }],
      ['meta', { property: 'og:url', content: 'https://ts-collect.netlify.app/' }],
      // ['script', { 'src': 'https://cdn.usefathom.com/script.js', 'data-site': '', 'data-spa': 'auto', 'defer': '' }],
      ...analyticsHead,
    ],

    themeConfig: {
      search: {
        provider: 'local',
      },

      logo: {
        light: './images/logo-transparent.svg',
        dark: './images/logo-white-transparent.svg',
      },

      nav,
      sidebar,

      editLink: {
        pattern: 'https://github.com/stacksjs/stacks/edit/main/docs/docs/:path',
        text: 'Edit this page on GitHub',
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2025-present Stacks.js, Inc.',
      },

      socialLinks: [
        { icon: 'twitter', link: 'https://twitter.com/stacksjs' },
        { icon: 'bluesky', link: 'https://bsky.app/profile/chrisbreuer.dev' },
        { icon: 'github', link: 'https://github.com/stacksjs/ts-collect' },
        { icon: 'discord', link: 'https://discord.gg/stacksjs' },
      ],

      // algolia: services.algolia,

      // carbonAds: {
      //   code: '',
      //   placement: '',
      // },
    },

    pwa: {
      manifest: {
        theme_color: '#0A0ABC',
      },
    },

    markdown: {
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },

      codeTransformers: [
        transformerTwoslash(),
      ],
    },

    vite: viteConfig,
  }),
)
