import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 新增 markdown 配置
  markdown: {
    languages: [
      {
        id: 'sql',
        scopeName: 'source.sql',
        aliases: ['mysql'],
        grammar: null, // 使用内置 SQL 语法
      }
    ]
  },

  // 在现有配置中添加忽略死链（临时方案）
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/hero-image.png', 
    siteTitle: '9lucifer 🏠',
    // https://vitepress.dev/reference/default-theme-config
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Examples', link: '/markdown-examples' },
        { 
          text: '🗄️ 数据库', 
          // 修改为有效的路径
          link: '/sql/mysql/',
          // 添加下拉菜单项
          items: [
            { text: 'MySQL', link: '/sql/mysql/' },
            { text: 'Redis', link: '/sql/redis/' }
          ]
        },
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
        // 新增数据库总目录页面
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
        { icon: 'bilibili', link: 'https://space.bilibili.com/662223993?spm_id_from=333.1007.0.0' } // 🔹 添加 Bilibili 主页
      ],
    }
})
