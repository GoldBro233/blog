import { defineThemeConfig } from "vuepress-theme-plume";
import { navbar } from "./navbar";

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: "https://img.goldbro.top/FluentEmojiRingedPlanet.webp",

  appearance: true,

  footer: {
    copyright: "Copyright © 2024-present Goldbro233",
  },

  profile: {
    avatar: "https://img.goldbro.top/goldbro_ico.jpg",
    name: "Goldbro's Planet",
    description: "一个充满幻想的星球🪐",
    // circle: true,
    // location: '',
    // organization: '',
  },
  navbar,
  social: [
    { icon: "github", link: "https://github.com/GoldBro233" },
    {
      icon: {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z"/></svg>',
      },
      link: "mailto:admin@goldbro.top",
    },
  ],
});
