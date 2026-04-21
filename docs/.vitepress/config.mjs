import { defineConfig } from 'vitepress';
import { execSync } from 'child_process';
import tailwindcss from '@tailwindcss/vite';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import annualSummarySidebar from './sidebar/annual-summary.mjs';
import computerSidebar from './sidebar/computer.mjs';
import javaBasicSidebar from './sidebar/java-basic.mjs';
import javaSpringSidebar from './sidebar/java-spring.mjs';
import javaJvmSidebar from './sidebar/java-jvm.mjs';
import javaNewResearchSidebar from './sidebar/java/new-research.mjs';
import algorithmHot100Sidebar from './sidebar/algorithm-hot100.mjs';
import algorithmTipSidebar from './sidebar/algorithm-tip.mjs';
import aiSidebar from './sidebar/ai.mjs';
import womenHealthSidebar from './sidebar/women-health.mjs';
import designSidebar from './sidebar/design.mjs';
import productSidebar from './sidebar/product.mjs';
import goSidebar from './sidebar/go.mjs';
import planSidebar from './sidebar/plan.mjs';

export default defineConfig({
  title: 'IsaacE2',
  description: "null",
  ignoreDeadLinks: [
    // 蹇界暐 public 鐩綍涓嬬殑 HTML 鏂囦欢
    /\/i-interview-protected\.html$/
  ],
  head: [
    // 鍩虹favicon
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    // 鐜颁唬娴忚鍣ㄩ€傞厤
    ['link', { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }],
    ['link', { rel: 'dns-prefetch', href: 'https://cn.vercount.one' }],
    ['link', { rel: 'preconnect', href: 'https://cn.vercount.one', crossorigin: '' }],
    // Vercount 璁块棶缁熻锛堝浗鍐呬紭鍖栵級
    ['script', { defer: true, async: true, src: 'https://cn.vercount.one/js' }],
    // 鑷畾涔?CSS
    ['link', { rel: 'stylesheet', href: '/css/home.css?v=20260421-home-latest-ui-2' }],
    // 鑷畾涔?JS
    ['script', { defer: true, src: '/js/home.js?v=20260421-home-latest-ui-2' }]
  ],
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [tailwindcss(), groupIconVitePlugin()]
  },
  
  themeConfig: {
    logo: '/hero-image.png',
    siteTitle: 'IsaacE2',

    // 鎼滅储閰嶇疆
    search: {
      provider: 'local'
    },


    // 瀵艰埅鏍?
    nav: [
      {
        text: '后端',
        activeMatch: '/(java|go)/',
        items: [
          {
            text: 'Java',
            items: [
              { text: 'Java 基础', link: '/java/basic/' },
              { text: 'Spring 框架', link: '/java/spring/' },
              { text: 'JVM', link: '/java/jvm/' },
              { text: '前沿探索', link: '/java/new-research/' }
            ]
          },
          {
            text: 'Go',
            items: [
              { text: 'Go 基础', link: '/go/basic/' },
              { text: 'Go 进阶', link: '/go/advanced/' }
            ]
          }
        ]
      },
      { text: '基础', link: '/computer/', activeMatch: '/computer/' },
      { text: '数据库', link: '/mysql/', activeMatch: '/mysql/' },
      { text: '中间件', link: '/center/', activeMatch: '/center/' },
      {
        text: '算法',
        activeMatch: '/algorithm/',
        items: [
          { text: 'Hot100', link: '/algorithm/hot100/' },
          { text: '算法技巧', link: '/algorithm/tip/' }
        ]
      },
      { text: 'AI', link: '/ai/', activeMatch: '/ai/' },
      { text: '产品', link: '/product/', activeMatch: '/product/' },
      { text: '系统设计', link: '/design/', activeMatch: '/design/' },
    ],

    // 渚ц竟鏍?
    sidebar: {
      '/annual-summary/': annualSummarySidebar,
      '/computer/': computerSidebar,
      '/project/': [
        {
          text: '鎴戠殑椤圭洰',
          items: [
            { text: '瑗挎箹璁哄墤', link: '/project/lakesword' },
            { text: '鎷煎洟浜ゆ槗', link: '/project/group-buy' },
            { text: 'ai浠ｇ爜璇勫', link: '/project/openai-code-review' },
          ]
        }
      ],
      '/java/basic/': javaBasicSidebar,
      '/java/spring/': javaSpringSidebar,
      '/java/jvm/': javaJvmSidebar,
      '/java/new-research/': javaNewResearchSidebar,
      '/front/': [
        {
          text: '前端学习',
          items: [
            { text: 'Mark.js 的使用入门', link: '/front/mark-js' },
            { text: 'Mammoth.js 渲染 Word 文档为 HTML', link: '/front/Mammoth-js' },
            { text: '好上手的古早前端框架 layUi', link: '/front/layui-admin' },
          ]
        }
      ],
      '/mysql/': [
        {
          text: '数据库学习',
          items: [
              { text: 'MySQL 知识体系索引', link: '/mysql/mysql-info-index' },
              { text: 'MySQL 锁梳理', link: '/mysql/mysql_lock' },
              { text: '分布式事务基本理论', link: '/mysql/Distributed_Transactions_Study_NotesPart1' },
              { text: 'Seata 简介', link: '/mysql/Distributed_Transactions_Study_NotesPart2' },
              { text: 'Seata AT 模式介绍', link: '/mysql/Distributed_Transactions_Study_NotesPart3' },
              { text: 'TCC 模式介绍', link: '/mysql/Distributed_Transactions_Study_NotesPart4' },
              { text: 'Redis 知识体系索引', link: '/mysql/redis-info-index' },
          ]
        }
      ],
      '/center/': [
        {
          text: '中间件学习',
          items: [
            { text: '中间件学习首页', link: '/center/index' },
            {
              text: 'RabbitMQ 学习',
              items: [
                { text: 'RabbitMQ 五种模式总结', link: '/center/rabbitmq/rabbitmq-base' },
                { text: 'RabbitMQ 五种模式的实现 SpringBoot', link: '/center/rabbitmq/rabbitmq-sb' }
              ]
            },
            {
              text: 'Kafka 学习',
              items: [
                { text: 'Kafka 简介', link: '/center/kafka/kafka-basic' },
                { text: 'Kafka 知识点汇总', link: '/center/kafka-info' },
                { text: 'Kafka 疑难杂症', link: '/center/kafka-problem' },
                { text: 'Kafka 2.7.2 源码编译记录', link: '/center/kafka/Kafka-compile' },
                { text: '生产者发送消息流程', link: '/center/kafka/producer-send' }
              ]
            }
          ]
        }
      ],
      '/algorithm/hot100/': algorithmHot100Sidebar,
      '/algorithm/tip/': algorithmTipSidebar,
      '/ai/': aiSidebar,
      '/product/': productSidebar,
      '/women-health/': womenHealthSidebar,
      '/design/': designSidebar,
      '/plan/': planSidebar,
      ...goSidebar
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/9lucifer/9lucifer.github.io' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/662223993' }
    ],
    

    // 鍚敤鐩綍绱㈠紩
    outline: 'deep', // 鎴栬€呰缃负鏁板瓧锛屼緥濡?2
    lastUpdated: true, // 鍚敤鏈€鍚庢洿鏂版椂闂?

    // 椤佃剼閰嶇疆
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 漏 2024-present IsaacE2'
    }
  },

});

