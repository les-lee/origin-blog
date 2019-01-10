module.exports = {
  // theme: require('./theme/layouts/Layout.vue'),
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
    lastUpdated: 'Last Updated',
    nav: [  
      { text: '首页', link: '/' },
      { 
        text: '文章', 
        items:[
          { text: '软技能' , link:'/softskill/'},
          { text: '前端技术' , link:'/webtel/'}
        ]
      },
      { text: 'To segmentfalut', link: 'https://segmentfault.com/blog/les-lee'},
      { text: 'To 掘金', link: 'https://juejin.im/user/5b15d5265188251360238c35/posts' },
      { text: 'To GitHub', link: '(https://github.com/les-lee'},
      { text: 'To Chat(请备注来处)', link: '/contact/'}
    ],
    sidebar: [
      {
        title: '主菜单',
        collapsable: false,
        children: [
          '/',
          'js/',
          ['tapable/', 'Explicit link text']
        ]
      }
    ]
  }
}