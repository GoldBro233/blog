import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import { plumeTheme } from "vuepress-theme-plume";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "Goldbro's Planet",
  description: "一个充满幻想的星球🪐",

  bundler: viteBundler(),
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/webp",
        sizes: "32x32",
        href: "https://img.goldbro.top/FluentEmojiRingedPlanet.webp",
      },
    ],
  ],
  theme: plumeTheme({
    // 部署域名
    hostname: "https://blog.goldbro.top",
    // your git repo url
    docsRepo: "https://github.com/GoldBro233/blog",
    docsDir: "",
    blog: { exclude: [".vuepress/", "**/README.md", "**/friends.md"] },
    copyright: "CC-BY-NC-ND-4.0",
    plugins: {
      /**
       * Shiki 代码高亮
       * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
       */
      shiki: {
        // 强烈建议预设代码块高亮语言，插件默认加载所有语言会产生不必要的时间开销
        //   languages: ['shell', 'bash', 'typescript', 'javascript'],
        theme: { light: "snazzy-light", dark: "tokyo-night" },
      },

      /**
       * markdown enhance
       * @see https://theme-plume.vuejs.press/config/plugins/markdown-enhance/
       */
      markdownEnhance: {
        demo: true,
        chartjs: true,
        echarts: true,
        flowchart: true,
        markmap: true,
      },

      /**
       *  markdown power
       * @see https://theme-plume.vuejs.press/config/plugin/markdown-power/
       */
      markdownPower: {
        pdf: true,
        bilibili: true,
        youtube: true,
        plot: true,
        fileTree: true,
        icons: true,
      },

      /**
       * 评论 comments
       * @see https://theme-plume.vuejs.press/guide/features/comments/
       */
      // comment: {
      //   provider: '', // "Artalk" | "Giscus" | "Twikoo" | "Waline"
      //   comment: true,
      //   repo: '',
      //   repoId: '',
      //   categoryId: '',
      //   mapping: 'pathname',
      //   reactionsEnabled: true,
      //   inputPosition: 'top',
      // },

      markdownMath: {
        type: "katex",
      },
      // 为网站添加数学公式渲染的支持，默认使用了katex，应该也可选mathjax

      markdownImage: {
        figure: true,
        lazyload: true,
        mark: true,
        size: true,
      },
      /** 为网站添加图片渲染的增强功能
       * 插件网站为 @see https://theme-plume.vuejs.press/config/plugins/markdown-image/
       * 具体请看 @see https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-image.html
       */

      readingTime: {
        wordPerMinute: 280,
      },
      // 更改文章阅读时间
    },
  }),
});
