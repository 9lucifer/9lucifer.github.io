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
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
