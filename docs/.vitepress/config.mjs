import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    languages: [
      {
        id: 'sql',
        scopeName: 'source.sql',
        aliases: ['mysql'],
        grammar: null,
      }
    ]
  },
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/hero-image.png', 
    siteTitle: '9lucifer 🏠',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { 
        text: '🗄️ 数据库', 
        link: '/sql/mysql/',
        items: [
          { text: 'MySQL', link: '/sql/mysql/' },
          { text: 'Redis', link: '/sql/redis/' }
        ]
      }
    ],

    sidebar: {
      '/sql/mysql/': [
        {
          text: 'MySQL 专栏',
          collapsible: true,
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
          items: [
            { text: '🏗️ 基础应用', link: '/sql/redis/redis-basic' },
            { text: '🚀 高级特性', link: '/sql/redis/redis-advanced' }
          ]
        }
      ],
      '/sql/': [
        {
          text: '数据库系统',
          items: [
            { text: '📖 MySQL 专题', link: '/sql/mysql/' },
            { text: '⚡ Redis 专题', link: '/sql/redis/' }
          ]
        }
      ],
      '/':[
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/9lucifer/9lucifer.github.io' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/662223993?spm_id_from=333.1007.0.0' }
    ]
  }
}) // 修复括号闭合
