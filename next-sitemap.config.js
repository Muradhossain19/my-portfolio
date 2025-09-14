module.exports = {
  siteUrl: "https://www.muradhossain.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/dashboard", "/dashboard/*", "/login", "/admin", "/admin/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/dashboard/*",
          "/login",
          "/admin",
          "/admin/",
          "/admin/*",
        ],
        allow: "/",
      },
    ],
    host: "https://www.muradhossain.com",
    sitemap: "https://www.muradhossain.com/sitemap.xml",
  },
};
