import { Metadata } from "next";
import { getBlogPostBySlug } from "../../../lib/blogData";

interface BlogLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>; // <-- Promise যোগ করুন
}

// Generate metadata for each blog post (SEO optimization)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // <-- Promise যোগ করুন
}): Promise<Metadata> {
  const { slug } = await params; // <-- await করুন
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Murad Hossain",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | Murad Hossain`,
    description: post.metaDescription,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author }],

    // Open Graph for social media sharing
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      siteName: "Murad Hossain - Web Developer",
      locale: "en_US",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [post.image],
      creator: "@your_twitter_handle",
    },

    // Additional SEO
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: `/blog/${post.slug}`,
    },

    // Article specific metadata
    other: {
      "article:author": post.author,
      "article:published_time": post.date,
      "article:section": post.category,
      "article:tag": post.tags.join(", "),
    },
  };
}

// Generate static params for all blog posts (for static generation)
export async function generateStaticParams() {
  const { blogData } = await import("../../../lib/blogData");

  return blogData.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogLayout({
  children,
  params,
}: BlogLayoutProps) {
  // <-- async করুন
  const { slug } = await params; // <-- await করুন

  return (
    <>
      {/* JSON-LD structured data for better SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: getBlogPostBySlug(slug)?.title, // <-- slug ব্যবহার করুন
            description: getBlogPostBySlug(slug)?.metaDescription,
            image: getBlogPostBySlug(slug)?.image,
            author: {
              "@type": "Person",
              name: getBlogPostBySlug(slug)?.author,
            },
            publisher: {
              "@type": "Organization",
              name: "Murad Hossain",
              logo: {
                "@type": "ImageObject",
                url: "/logo.png",
              },
            },
            datePublished: getBlogPostBySlug(slug)?.date,
            dateModified: getBlogPostBySlug(slug)?.date,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://yourwebsite.com/blog/${slug}`,
            },
          }),
        }}
      />
      {children}
    </>
  );
}
