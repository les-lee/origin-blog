module.exports = {
  theme: 'vuepress-theme-les',
  title: '恭喜恭喜',
  description: '对技术以及生活的一些看法',
  head: [
    ['link', {rel: 'icon', href: '/rong.ico'}]
  ],
  markdown: {
    lineNumbers: true,
    anchor: {
      permalinkBefore: true,
      permalink: true
    }
  },
  themeConfig: {
    // logo: 'https://avatars2.githubusercontent.com/u/18657834?s=400&u=e5f519261c01ba75c84d4b5cbd6ce4f12734d006&v=4',
    docsRepo: 'les-lee',
    editLinkText: '在Github上编辑此页',
    editLinks: 'https://baidu.com',
    lastUpdated: 'Last Updated',
    nav: [  
      { text: '首页', link: '/' },
      { 
        text: '文章', 
        items:[
          { text: 'js' , link:'/js/'},
          { text: 'webpack' , link:'/webpack/'},
          { text: '翻译' , link:'/translate/'},
          // { text: '' , link:'/webtel/'}
        ]
      },
      { text: 'To segmentfalut', link: 'https://segmentfault.com/blog/les-lee'},
      { text: 'To 掘金', link: 'https://juejin.im/user/5b15d5265188251360238c35/posts' },
      { text: 'To GitHub', link: 'https://github.com/les-lee'},
      { text: 'To Chat(请备注来处)', link: 'contact/'}
    ]
    // ,
    // sidebar: [
    //   {
    //     title: 'js',
    //     collapsable: false,
    //     children: [
    //       ['js/object_edvanced/', 'js对象进阶'],
    //     ]
    //   },
      // {
      //   title: 'webpack',
      //   collapsable: false,
      //   children: [
      //     ['webpack/', 'webpack']
      //   ]
      // },
      // {
      //   title: '翻译',
      //   collapsable: false,
      //   children: [
      //     ['translate/', '请等待...']
      //   ]
      // }
    // ]
  }
  // lastUpdated: 'Last Updated',
  // displayAllHeaders: true
}