export const SITE = {
  website: "https://built-primal.vercel.app/", // replace this with your deployed domain
  author: "Ryan Cole",
  profile: "https://builtprimal.com/",
  desc: "Built Primal - Authority blog and store for mindful training, rope flow, and primal movement.",
  title: "Built Primal",
  ogImage: "built-primal-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/New_York", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
