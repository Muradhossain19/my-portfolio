"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface BlogLayoutProps {
  children: React.ReactNode;
}

// Database blog post interface
interface DatabaseBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  read_time: string;
  likes: number;
  tags: string[];
  featured: boolean;
  meta_description: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

// API Response interface
interface BlogAPIResponse {
  success: boolean;
  posts: DatabaseBlogPost[];
  message?: string;
}

// Client-side SEO and metadata management
function ClientSideMetadata({ post }: { post: DatabaseBlogPost | null }) {
  useEffect(() => {
    if (!post) {
      // Default metadata for not found
      document.title = "Post Not Found | Murad Hossain";
      updateMetaTag(
        "description",
        "The requested blog post could not be found."
      );
      return;
    }

    // Update document title
    document.title = `${post.title} | Murad Hossain`;

    // Update basic meta tags
    updateMetaTag("description", post.meta_description);
    updateMetaTag(
      "keywords",
      Array.isArray(post.tags) ? post.tags.join(", ") : ""
    );
    updateMetaTag("author", post.author);

    // Update Open Graph tags
    updateMetaProperty("og:title", post.title);
    updateMetaProperty("og:description", post.meta_description);
    updateMetaProperty("og:image", post.image);
    updateMetaProperty("og:type", "article");
    updateMetaProperty("og:site_name", "Murad Hossain - Web Developer");
    updateMetaProperty("og:locale", "en_US");
    updateMetaProperty("og:url", `${window.location.origin}/blog/${post.slug}`);

    // Article specific Open Graph
    updateMetaProperty("article:author", post.author);
    updateMetaProperty("article:published_time", post.date);
    updateMetaProperty("article:section", post.category);
    updateMetaProperty(
      "article:tag",
      Array.isArray(post.tags) ? post.tags.join(", ") : ""
    );

    // Twitter Card
    updateMetaName("twitter:card", "summary_large_image");
    updateMetaName("twitter:title", post.title);
    updateMetaName("twitter:description", post.meta_description);
    updateMetaName("twitter:image", post.image);
    updateMetaName("twitter:creator", "@your_twitter_handle");

    // Robots meta
    updateMetaName(
      "robots",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );
    updateMetaName(
      "googlebot",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // Canonical URL
    updateCanonicalUrl(`${window.location.origin}/blog/${post.slug}`);

    // JSON-LD structured data
    updateJsonLd(post);
  }, [post]);

  // Helper functions for updating meta tags
  const updateMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  };

  const updateMetaProperty = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  };

  const updateMetaName = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  };

  const updateCanonicalUrl = (url: string) => {
    let link = document.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute("href", url);
    } else {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", url);
      document.head.appendChild(link);
    }
  };

  const updateJsonLd = (post: DatabaseBlogPost) => {
    // Remove existing JSON-LD
    const existingJsonLd = document.querySelector(
      'script[type="application/ld+json"][data-blog-post]'
    );
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    // Create new JSON-LD
    const jsonLdScript = document.createElement("script");
    jsonLdScript.type = "application/ld+json";
    jsonLdScript.setAttribute("data-blog-post", "true");
    jsonLdScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.meta_description,
      image: {
        "@type": "ImageObject",
        url: post.image,
        width: 1200,
        height: 630,
      },
      author: {
        "@type": "Person",
        name: post.author,
      },
      publisher: {
        "@type": "Organization",
        name: "Murad Hossain",
        logo: {
          "@type": "ImageObject",
          url: `${window.location.origin}/logo.png`,
        },
      },
      datePublished: post.date,
      dateModified: post.updated_at || post.date,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${window.location.origin}/blog/${post.slug}`,
      },
      keywords: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      articleSection: post.category,
      wordCount: post.content ? post.content.split(" ").length : 0,
      readingTimeMinutes: post.read_time,
    });
    document.head.appendChild(jsonLdScript);
  };

  return null;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<DatabaseBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Client-side data fetching
  useEffect(() => {
    if (!slug) return;

    const fetchBlogPost = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/admin/blog`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BlogAPIResponse = await response.json();

        if (!data.success || !data.posts) {
          throw new Error("Failed to fetch blog posts");
        }

        // Find the post by slug and check if it's published
        const foundPost = data.posts.find(
          (post: DatabaseBlogPost) => post.slug === slug && post.published
        );

        if (!foundPost) {
          throw new Error("Blog post not found");
        }

        setPost(foundPost);
      } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  // Loading state effect for document title
  useEffect(() => {
    if (loading) {
      document.title = "Loading... | Murad Hossain";
    }
  }, [loading]);

  return (
    <>
      {/* Client-side metadata management */}
      <ClientSideMetadata post={post} />

      {/* Default meta tags for initial page load */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Set initial meta tags before React hydration
            document.title = 'Blog Post | Murad Hossain';
            
            // Basic meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              const meta = document.createElement('meta');
              meta.name = 'description';
              meta.content = 'A blog post by Murad Hossain';
              document.head.appendChild(meta);
            }
            
            // Basic Open Graph
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (!ogTitle) {
              const meta = document.createElement('meta');
              meta.property = 'og:title';
              meta.content = 'Blog Post | Murad Hossain';
              document.head.appendChild(meta);
            }
          `,
        }}
      />

      {children}
    </>
  );
}
