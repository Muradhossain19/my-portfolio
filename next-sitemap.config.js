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
    let serviceSlugs = [];
    let blogSlugs = [];
    try {
      // Fetch services
      const res = await fetch("https://www.muradhossain.com/api/services");
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        serviceSlugs = data.services
          .filter((s) => s.is_active)
          .map((s) => s.slug);
      }
    } catch {
      serviceSlugs = [];
    }

    try {
      // Fetch blogs
      const res = await fetch("https://www.muradhossain.com/api/admin/blog");
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        blogSlugs = data.posts.filter((b) => b.published).map((b) => b.slug);
      }
    } catch {
      blogSlugs = [];
    }

    // Combine all dynamic paths
    return [
      ...serviceSlugs.map((slug) => ({
        loc: `/services/${slug}`,
        changefreq: "weekly",
        priority: 0.8,
      })),
      ...blogSlugs.map((slug) => ({
        loc: `/blog/${slug}`,
        changefreq: "weekly",
        priority: 0.7,
      })),
    ];
  },
};

module.exports = sitemapConfig;
