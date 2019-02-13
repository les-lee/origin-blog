// var utils = require('../../utils')
// var sidebarConfig = utils.build_sidebar_sync()
var sidebarConfig = import("./sidebar_config.js");
module.exports = {
  theme: "vuepress-theme-les",
  title: "Les Lee’s 空间",
  description: "对所有热爱分享的技术人致敬",
  head: [["link", { rel: "icon", href: "/rong.ico" }]],
  markdown: {
    lineNumbers: true,
    anchor: {
      permalinkBefore: true,
      permalink: true
    }
  },
  themeConfig: {
    // logo: 'https://avatars2.githubusercontent.com/u/18657834?s=400&u=e5f519261c01ba75c84d4b5cbd6ce4f12734d006&v=4',
    docsRepo: "les-lee/origin-blog",
    editLinkText: "有错请在这里指正",
    docsDir: "blog",
    editLinks: true,
    lastUpdated: "最近更新时间",
    displayAllHeaders: true,
    nav: [
      { text: "首页", link: "/" },
      {
        text: "文章",
        items: [
          { text: "js", link: "/js/" },
          { text: "css", link: "/css/" }, 
          { text: "webpack", link: "/webpack/" },
          { text: "翻译", link: "/translate/" }
        ]
      },
      {
        text: "To segmentfalut",
        link: "https://segmentfault.com/blog/les-lee"
      },
      {
        text: "To 掘金",
        link: "https://juejin.im/user/5b15d5265188251360238c35/posts"
      },
      { text: "To GitHub", link: "https://github.com/les-lee" },
      { text: "联系我(请备注来处)", link: "./contact" }
    ],
    // sidebar: 'auto'
    sidebar: {
      "/js/": ["jsobj_advanced", "bitmarks"],

      "/css/": [
        "scroll_snap"
      ],

      "/webpack/": [
        // '',
        "tapable_document",
        "tapable_guide_two",
        "tapable_guide_three",
        "tapable"
      ],
      "/translate/": [""]
    }
  }
};
