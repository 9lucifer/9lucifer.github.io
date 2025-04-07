import { defineConfig } from 'vitepress'

// 如果不打算自定义 SQL 的语法高亮，可以移除 grammar 项
export default defineConfig({
  markdown: {
    languages: [
      {
        id: 'sql',
        scopeName: 'source.sql',
        aliases: ['mysql'],
        // 可引入语法文件，也可以设置为 undefined 或删掉此项
        // grammar: require('some-sql-grammar.json')
      }
    ]
  },

  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/hero-image.png',
    siteTitle: '9lucifer 🏠',

    nav: [
      { text: 'Home', link: '/' },
      {
        text: '🗄️ 数据库',
        activeMatch: '^/sql/',
        items: [
          { text: '🏷️ MySQL', link: '/sql/mysql/' },
          { text: '🔑 Redis', link: '/sql/redis/' },
          { type: 'separator' },
          { text: '📚 数据库总览', link: '/sql/' }
        ]
      }
    ],

    sidebar: {
      '/sql/mysql/': [
        {
          text: 'MySQL 专栏',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '🔓📈 乐观锁指南', link: '/sql/mysql/mysql-happy' },
            { text: '📚 悲观锁解析', link: '/sql/mysql/mysql-sad' }
          ]
        }
      ],
      '/sql/redis/': [
        {
          text: 'Redis 实战',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '🏗️ 基础应用', link: '/sql/redis/redis-basic' },
            { text: '🚀 高级特性', link: '/sql/redis/redis-advanced' }
          ]
        }
      ],
      '/sql/': [
        {
          text: '数据库系统',
          collapsible: true,
          items: [
            { text: '📖 MySQL 专题', link: '/sql/mysql/' },
            { text: '⚡ Redis 专题', link: '/sql/redis/' }
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/9lucifer/9lucifer.github.io' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/662223993?spm_id_from=333.1007.0.0' }
    ]
  }
})
