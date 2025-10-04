const sitemapConfig = {
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
  async additionalPaths() {
    let dbSlugs = [];
    try {
      const res = await fetch("https://www.muradhossain.com/api/services");
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        dbSlugs = data.services.filter((s) => s.is_active).map((s) => s.slug);
      }
    } catch {
      dbSlugs = [];
    }

    return dbSlugs.map((slug) => ({
      loc: `/services/${slug}`,
      changefreq: "weekly",
      priority: 0.8,
    }));
  },
};

module.exports = sitemapConfig;
