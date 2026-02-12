import { defineConfig } from 'vitepress';
import { execSync } from 'child_process';
import annualSummarySidebar from './sidebar/annual-summary.mjs';
import computerSidebar from './sidebar/computer.mjs';
import javaBasicSidebar from './sidebar/java-basic.mjs';
import javaSpringSidebar from './sidebar/java-spring.mjs';
import javaJvmSidebar from './sidebar/java-jvm.mjs';
import algorithmHot100Sidebar from './sidebar/algorithm-hot100.mjs';
import algorithmTipSidebar from './sidebar/algorithm-tip.mjs';

export default defineConfig({
  title: "IsaacE2 🏠",
  description: "null",
  head: [
    // 基础favicon
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    // 现代浏览器适配
    ['link', { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }],
  ],
  
  themeConfig: {
    logo: '/hero-image.png', 
    siteTitle: 'IsaacE2 🏠',


    // 导航栏
    nav: [
      {
        text: '☕️ Java',
        activeMatch: '/java/',
        items: [
          { text: 'Java 基础', link: '/java/basic/' },
          { text: 'Spring 框架', link: '/java/spring/' },
          { text: 'JVM', link: '/java/jvm/' }
        ]
      },
      { text: '💻 计算机基础', link: '/computer/', activeMatch: '/computer/' },
      { text: '🗄️ 数据库', link: '/mysql/', activeMatch: '/mysql/' },
      { text: '🌐 前端', link: '/front/', activeMatch: '/front/' },
      { text: '⚙️ 中间件', link: '/center/', activeMatch: '/center/' },
      {
        text: '🚀 算法训练',
        activeMatch: '/algorithm/',
        items: [
          { text: '🔥 Hot100', link: '/algorithm/hot100/' },
          { text: '💡 算法技巧', link: '/algorithm/tip/' }
        ]
      },
      {
        text: '📄 刷题记录',
        link: '/shuait.html', // 必须添加 .html 扩展名
        target: '_blank' // 添加新标签页打开（可选）
      }
    ],

    // 侧边栏
    sidebar: {
      '/annual-summary/': annualSummarySidebar,
      '/computer/': computerSidebar,
      '/project/': [
        {
          text: '我的项目',
          items: [
            { text: '西湖论剑', link: '/project/lakesword' },
            { text: '拼团交易', link: '/project/group-buy' },
            { text: 'ai代码评审', link: '/project/openai-code-review' },
          ]
        }
      ],
      '/java/basic/': javaBasicSidebar,
      '/java/spring/': javaSpringSidebar,
      '/java/jvm/': javaJvmSidebar,
      '/front/': [
        {
          text: '前端学习',
          items: [
            { text: '🎨 Mark.js 的使用指南', link: '/front/mark-js' },
            { text: '📄 Mammoth.js 渲染 Word 文档为 HTML：详细教程 🚀', link: '/front/Mammoth-js' },
            { text: '🚀 后端程序员好上手的前端框架——layui', link: '/front/layui-admin' },
          ]
        }
      ],
      '/mysql/': [
        {
          text: 'MySQL 学习',
          items: [
            { text: '🔓📈 MySQL乐观锁终极指南', link: '/mysql/mysql-happy' },
            { text: '📚 MySQL悲观锁深度解析', link: '/mysql/mysql-sad' }
          ]
        }
      ],
      '/center/': [
        {
          text: '中间件学习',
          items: [
            {
              text: 'RabbitMQ 学习',
              items: [
                { text: 'RabbitMQ 学习', link: '/center/rabbitmq/' },
                { text: 'RabbitMQ 五种模式总结', link: '/center/rabbitmq/rabbitmq-base' },
                { text: 'RabbitMQ 五种模式的实现——SpringBoot', link: '/center/rabbitmq/rabbitmq-sb' }
              ]
            },
            {
              text: 'Kafka 学习',
              items: [
                { text: 'Kafka 学习', link: '/center/kafka/' },
                { text: 'Kafka2.7.2源码编译记录', link: '/center/kafka/Kafka-compile' }
              ]
            }
          ]
        }
      ],
      '/algorithm/hot100/': algorithmHot100Sidebar,
      '/algorithm/tip/': algorithmTipSidebar
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/whut-x-tech/01A' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/662223993?spm_id_from=333.1007.0.0' } // 🔹 添加 Bilibili 主页
    ],
    

    // 启用目录索引
    outline: 'deep', // 或者设置为数字，例如 2
    lastUpdated: true, // 启用最后更新时间

    // 页脚配置
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present IsaacE2'
    }
  },

});
