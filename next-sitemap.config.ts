import { services } from "./src/app/services/[slug]/ServiceData";

interface Service {
  slug: string;
  is_active?: boolean;
  // ...other fields if needed
}

interface ApiServiceResponse {
  success: boolean;
  services: Service[];
}

// Assign config to a variable
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
    let dbSlugs: string[] = [];
    try {
      const res = await fetch("https://www.muradhossain.com/api/services");
      const data: ApiServiceResponse = await res.json();
      if (data.success && Array.isArray(data.services)) {
        dbSlugs = data.services.filter((s) => s.is_active).map((s) => s.slug);
      }
    } catch {
      dbSlugs = [];
    }

    const staticSlugs = services.map((s: Service) => s.slug);
    const allSlugs = Array.from(new Set([...dbSlugs, ...staticSlugs]));

    return allSlugs.map((slug) => ({
      loc: `/services/${slug}`,
      changefreq: "weekly",
      priority: 0.8,
    }));
  },
};

// Export as default
export default sitemapConfig;
