import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "9lucifer",
  description: "A VitePress Site",
  head: [
    // 修复图标配置（添加sizes属性）
    ['link', { 
      rel: 'icon', 
      href: '/favicon.ico',
      type: 'image/x-icon',
      sizes: '48x48'  // 添加尺寸声明
    }],
    // 现代浏览器适配（PNG格式）
    ['link', { 
      rel: 'icon', 
      href: '/favicon-32x32.png',
      type: 'image/png',
      sizes: '32x32' 
    }]
  ],
  themeConfig: {
    logo: '/hero-image.png', 
    siteTitle: '9lucifer 🏠',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: '🗄️ 数据库', link: '/mysql/', activeMatch: '/mysql/' },
    ],

    sidebar: {
      '/mysql/': [
        {
          text: 'MySQL 学习',
          items: [
            { text: '🔓📈 MySQL乐观锁终极指南', link: '/mysql/mysql-happy' },
            { text: '📚 MySQL悲观锁深度解析', link: '/mysql/mysql-sad' }
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
