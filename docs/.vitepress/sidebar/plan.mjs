export default [
  {
    text: '个人规划',
    items: [
      { text: '规划首页', link: '/plan/index' },
      {
        text: '年度规划',
        collapsed: false,
        items: [
          { text: '2026', link: '/plan/2026/index' },
          { text: '2026Q1 复盘', link: '/plan/2026/2026_01_03_re' },
          { text: '2026Q2 规划', link: '/plan/2026/2026_04_06' },
        ]
      }
    ]
  }
];
