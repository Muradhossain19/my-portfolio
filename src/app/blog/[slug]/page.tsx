"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaThumbsUp,
  FaFacebookF,
  FaTwitter,
  FaTag,
  FaFire,
  FaChevronRight,
} from "react-icons/fa";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Interface for database blog post
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

// Interface for component blog post
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;
  tags: string[];
  featured: boolean;
  metaDescription: string;
}

// API Response interface
interface BlogAPIResponse {
  success: boolean;
  posts: DatabaseBlogPost[];
  message?: string;
}

// Updated Skeleton Components to match your design layout
const BlogPostSkeleton = () => (
  <div className="bg-[#ECF0F3] min-h-screen">
    {/* Reading Progress Bar Skeleton */}
    <div className="fixed top-0 left-0 w-full h-1 bg-[#d1d9e6] z-50">
      <div className="h-full bg-gray-300 w-0 animate-pulse" />
    </div>

    {/* Main Content */}
    <section className="pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Skeleton */}
          <div className="lg:col-span-8">
            {/* Breadcrumbs Skeleton */}
            <nav className="flex items-center space-x-2 text-sm mb-6">
              <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
            </nav>

            {/* Featured Image Skeleton */}
            <div className="relative h-64 md:h-96 bg-gray-300 rounded-2xl mb-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] animate-pulse">
              {/* Featured badge skeleton */}
              <div className="absolute top-4 left-4 bg-gray-400 w-16 h-6 rounded-full animate-pulse"></div>
            </div>

            {/* Article Meta Skeleton - Below image */}
            <div className="flex flex-wrap items-center gap-6 mb-8 p-6 bg-[#ECF0F3] rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
              </div>
              {/* Date */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
              </div>
              {/* Read time */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
              </div>
              {/* Category */}
              <div className="h-6 w-24 bg-gray-300 rounded-full animate-pulse"></div>
            </div>

            {/* Post Title Skeleton */}
            <div className="mb-6 space-y-3">
              <div className="h-8 md:h-10 lg:h-12 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-8 md:h-10 lg:h-12 bg-gray-300 rounded w-4/5 animate-pulse"></div>
              <div className="h-8 md:h-10 lg:h-12 bg-gray-300 rounded w-3/5 animate-pulse"></div>
            </div>

            {/* Post Excerpt Skeleton */}
            <div className="mb-8 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
            </div>

            {/* Article Content Skeleton */}
            <div className="mb-12 space-y-6">
              {/* Paragraph blocks */}
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-3">
                  {/* H2 heading occasionally */}
                  {index % 3 === 0 && (
                    <div className="h-6 bg-gray-300 rounded w-2/3 mt-8 mb-4 animate-pulse"></div>
                  )}
                  {/* Paragraph lines */}
                  <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-[#ECF0F3] px-4 py-2 rounded-full shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                >
                  <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Social Actions Skeleton */}
            <div className="flex items-center justify-between p-6 bg-[#ECF0F3] rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] mb-12">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded-lg animate-pulse">
                  <div className="w-4 h-4 bg-gray-400 rounded animate-pulse"></div>
                  <div className="w-6 h-4 bg-gray-400 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Navigation Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Previous post */}
              <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-xl animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              {/* Next post */}
              <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2 text-right">
                    <div className="h-4 w-24 bg-gray-300 rounded ml-auto animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-300 rounded ml-auto animate-pulse"></div>
                  </div>
                  <div className="w-16 h-16 bg-gray-300 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-8">
            {/* Author Card Skeleton */}
            <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 w-28 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-300 rounded mx-auto animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded mx-auto animate-pulse"></div>
                </div>
                <div className="h-4 w-24 bg-gray-300 rounded mx-auto animate-pulse"></div>
              </div>
            </div>
            {/* Recent Posts Skeleton */}
            <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 w-28 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl"
                  >
                    <div className="w-16 h-16 bg-gray-300 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#d1d9e6]">
                <div className="h-4 w-28 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Popular Posts Skeleton */}
            <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl"
                  >
                    <div className="w-16 h-16 bg-gray-300 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-3 w-12 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Posts Skeleton */}
            <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
              <div className="h-6 w-32 bg-gray-300 rounded mb-6 animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="p-4 rounded-xl">
                    <div className="h-4 w-full bg-gray-300 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-300 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-4/5 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// Breadcrumb Component
const Breadcrumb = ({
  breadcrumbs,
}: {
  breadcrumbs: Array<{ label: string; href: string }>;
}) => (
  <nav className="flex items-center space-x-2 text-sm mb-6 bg-[#FF004F]/10 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
    {breadcrumbs.map((crumb, index) => (
      <React.Fragment key={index}>
        {index > 0 && (
          <FaChevronRight className="w-3 h-3 text-[#3c3e41] opacity-50" />
        )}
        {index === breadcrumbs.length - 1 ? (
          <span className="text-[#3c3e41] font-medium">{crumb.label}</span>
        ) : (
          <Link
            href={crumb.href}
            className="text-[#FF004F] hover:text-[#e6003d] transition-colors duration-300"
          >
            {crumb.label}
          </Link>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [slug, setSlug] = useState<string>("");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to transform database post to component format
  const transformDatabasePost = useCallback(
    (dbPost: DatabaseBlogPost): BlogPost => {
      return {
        id: dbPost.id,
        title: dbPost.title,
        slug: dbPost.slug,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        image: dbPost.image,
        category: dbPost.category,
        author: dbPost.author,
        date: dbPost.date,
        readTime: dbPost.read_time,
        likes: dbPost.likes,
        tags: Array.isArray(dbPost.tags) ? dbPost.tags : [],
        featured: dbPost.featured,
        metaDescription: dbPost.meta_description,
      };
    },
    []
  );

  // Fetch all blog posts from database only - NO STATIC FALLBACK
  const fetchAllPosts = useCallback(async (): Promise<BlogPost[]> => {
    try {
      const response = await fetch("/api/admin/blog");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogAPIResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch blog posts");
      }

      if (!data.posts || data.posts.length === 0) {
        return [];
      }

      // Transform database posts to component format and filter only published posts
      const transformedPosts = data.posts
        .filter((post: DatabaseBlogPost) => post.published)
        .map((post: DatabaseBlogPost) => transformDatabasePost(post));

      return transformedPosts;
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
  }, [transformDatabasePost]);

  // Find blog post by slug
  const findPostBySlug = useCallback(
    (posts: BlogPost[], slug: string): BlogPost | null => {
      return posts.find((post) => post.slug === slug) || null;
    },
    []
  );

  // Get related posts
  const getRelatedPostsFromList = useCallback(
    (
      posts: BlogPost[],
      currentPostId: number,
      category: string,
      limit: number = 3
    ): BlogPost[] => {
      return posts
        .filter(
          (post) => post.id !== currentPostId && post.category === category
        )
        .slice(0, limit);
    },
    []
  );

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    resolveParams();
  }, [params]);

  // Main data loading effect - Database only, NO static fallback
  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all posts from database
        const posts = await fetchAllPosts();

        if (posts.length === 0) {
          setError("No blog posts found");
          return;
        }

        setAllPosts(posts);

        // Find current post
        const foundPost = findPostBySlug(posts, slug);
        if (!foundPost) {
          setError("Blog post not found");
          notFound();
          return;
        }

        setPost(foundPost);

        // Set related posts
        const related = getRelatedPostsFromList(
          posts,
          foundPost.id,
          foundPost.category
        );
        setRelatedPosts(related);

        // Get recent posts (latest 5, excluding current post)
        const recent = posts
          .filter((p) => p.id !== foundPost.id)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5);
        setRecentPosts(recent);

        // Get popular posts (by likes, excluding current post)
        const popular = posts
          .filter((p) => p.id !== foundPost.id)
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 4);
        setPopularPosts(popular);

        // Find next and previous posts
        const currentIndex = posts.findIndex((p) => p.id === foundPost.id);
        if (currentIndex > 0) {
          setPrevPost(posts[currentIndex - 1]);
        }
        if (currentIndex < posts.length - 1) {
          setNextPost(posts[currentIndex + 1]);
        }

        // Load likes
        setLikes(foundPost.likes);

        // Check if user already liked this post
        if (typeof window !== "undefined") {
          const userLiked = localStorage.getItem(`user-liked-${foundPost.id}`);
          setIsLiked(userLiked === "true");
        }
      } catch (error) {
        console.error("Error loading blog data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load blog post"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [slug, fetchAllPosts, findPostBySlug, getRelatedPostsFromList]);

  // Fetch likes from backend
  useEffect(() => {
    if (!post) return;

    const fetchLikes = async () => {
      try {
        const res = await fetch("/api/blog-likes");
        if (res.ok) {
          const data: Array<{ blog_id: number; likes_count: number }> =
            await res.json();
          const found = data.find((d) => d.blog_id === post.id);
          setLikes(found ? found.likes_count : post.likes);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [post]);

  // Simplified and Professional Reading Progress Tracker

  const handleLike = async () => {
    if (!post || isLiked) return;

    try {
      await fetch("/api/blog-likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blog_id: post.id }),
      });

      // Refetch likes
      const res = await fetch("/api/blog-likes");
      if (res.ok) {
        const data: Array<{ blog_id: number; likes_count: number }> =
          await res.json();
        const found = data.find((d) => d.blog_id === post.id);
        setLikes(found ? found.likes_count : post.likes);
      }

      setIsLiked(true);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`user-liked-${post.id}`, "true");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = (platform: string) => {
    if (typeof window === "undefined") return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || "");

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  // Get current likes for sidebar posts
  const getCurrentLikes = (postId: number) => {
    return allPosts.find((p) => p.id === postId)?.likes || 0;
  };

  // Loading state
  if (isLoading) {
    return <BlogPostSkeleton />;
  }

  // Error state
  if (error || !post) {
    return (
      <div className="bg-[#ECF0F3] min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1f2125] mb-4">
              {error === "Blog post not found"
                ? "Post Not Found"
                : "Error Loading Post"}
            </h1>
            <p className="text-[#3c3e41] mb-6">
              {error || "The requested blog post could not be found."}
            </p>
            <Link
              href="/blog"
              className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <div className="bg-[#ECF0F3] min-h-screen">
      {/* Main Content */}
      <section className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Article */}
            <motion.article
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumbs */}
              <Breadcrumb breadcrumbs={breadcrumbs} />

              {/* Featured Image */}
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                {post.featured && (
                  <div className="absolute top-4 left-4 bg-[#FF004F] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>

              {/* Article Meta - Moved below image */}
              <motion.div
                className="flex flex-wrap items-center gap-6 mb-8 p-6 bg-[#ECF0F3] rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 text-[#3c3e41]">
                  <FaUser className="w-4 h-4" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2 text-[#3c3e41]">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[#3c3e41]">
                  <FaClock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <span className="bg-[#FF004F]/10 text-[#FF004F] px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </motion.div>

              {/* Post Title - Responsive font sizes */}
              <motion.h1
                className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1f2125] leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {post.title}
              </motion.h1>

              {/* Post Excerpt - Same font size as content */}
              <motion.p
                className="text-base text-[#3c3e41] leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {post.excerpt}
              </motion.p>

              {/* Article Content - Added proper ID and wrapper */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div
                  id="blog-content"
                  className="blog-content prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{
                    color: "#3c3e41",
                    lineHeight: "1.8",
                  }}
                />
              </motion.div>

              {/* Tags */}
              <motion.div
                className="flex flex-wrap gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 bg-[#ECF0F3] text-[#3c3e41] px-4 py-2 rounded-full text-sm shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                  >
                    <FaTag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* Social Actions */}
              <motion.div
                className="flex items-center justify-between p-6 bg-[#ECF0F3] rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    disabled={isLiked}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isLiked
                        ? "bg-[#FF004F] text-white cursor-not-allowed"
                        : "bg-[#ECF0F3] text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] cursor-pointer"
                    }`}
                  >
                    <FaThumbsUp className="w-4 h-4" />
                    <span>{likes}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#3c3e41] text-sm mr-2">Share:</span>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-10 h-10 bg-[#ECF0F3] rounded-full flex items-center justify-center text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#1877f2] transition-colors duration-300"
                  >
                    <FaFacebookF />
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-10 h-10 bg-[#ECF0F3] rounded-full flex items-center justify-center text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#1da1f2] transition-colors duration-300"
                  >
                    <FaTwitter />
                  </button>
                </div>
              </motion.div>

              {/* Navigation */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden">
                        <Image
                          src={prevPost.image}
                          alt={prevPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#FF004F] font-medium mb-1">
                          ← Previous Post
                        </p>
                        <h4 className="text-[#1f2125] font-semibold group-hover:text-[#FF004F] transition-colors duration-300 line-clamp-2">
                          {prevPost.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1 text-right">
                        <p className="text-sm text-[#FF004F] font-medium mb-1">
                          Next Post →
                        </p>
                        <h4 className="text-[#1f2125] font-semibold group-hover:text-[#FF004F] transition-colors duration-300 line-clamp-2">
                          {nextPost.title}
                        </h4>
                      </div>
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden">
                        <Image
                          src={nextPost.image}
                          alt={nextPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}
              </motion.div>
            </motion.article>

            {/* Sidebar */}
            <motion.aside
              className="lg:col-span-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Author Card - Sticky at top */}
              <div className="sticky top-24 space-y-8">
                <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#FF004F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {post.author.charAt(0)}
                    </div>
                    <h3 className="text-lg font-bold text-[#1f2125] mb-2">
                      {post.author}
                    </h3>
                    <p className="text-sm text-[#3c3e41] mb-4">
                      Full-stack developer passionate about creating amazing web
                      experiences with modern technologies.
                    </p>
                    <Link
                      href="/?section=contact"
                      className="text-sm text-[#FF004F] hover:underline font-medium"
                    >
                      Contact Me →
                    </Link>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="space-y-8">
                  {/* Recent Posts */}
                  <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                    <div className="flex items-center gap-2 mb-6">
                      <FaClock className="text-[#FF004F] w-5 h-5" />
                      <h3 className="text-lg font-bold text-[#1f2125]">
                        Recent Posts
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {recentPosts.map((recentPost) => (
                        <Link
                          key={recentPost.id}
                          href={`/blog/${recentPost.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#ECF0F3] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all duration-300 group"
                        >
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                            <Image
                              src={recentPost.image}
                              alt={recentPost.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-[#1f2125] group-hover:text-[#FF004F] transition-colors duration-300 line-clamp-2 mb-1">
                              {recentPost.title}
                            </h4>
                            <p className="text-xs text-[#3c3e41]">
                              {recentPost.date}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#d1d9e6]">
                      <Link
                        href="/blog"
                        className="text-sm text-[#FF004F] hover:underline font-medium"
                      >
                        View All Posts →
                      </Link>
                    </div>
                  </div>

                  {/* Popular Posts */}
                  <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                    <div className="flex items-center gap-2 mb-6">
                      <FaFire className="text-[#FF004F] w-5 h-5" />
                      <h3 className="text-lg font-bold text-[#1f2125]">
                        Popular Posts
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {popularPosts.map((popularPost) => (
                        <Link
                          key={popularPost.id}
                          href={`/blog/${popularPost.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#ECF0F3] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all duration-300 group"
                        >
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                            <Image
                              src={popularPost.image}
                              alt={popularPost.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-[#1f2125] group-hover:text-[#FF004F] transition-colors duration-300 line-clamp-2 mb-1">
                              {popularPost.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-[#3c3e41]">
                              <FaThumbsUp className="w-3 h-3" />
                              <span>
                                {getCurrentLikes(popularPost.id)} likes
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Related Posts */}
                  {relatedPosts.length > 0 && (
                    <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                      <h3 className="text-lg font-bold text-[#1f2125] mb-6">
                        Related Posts
                      </h3>
                      <div className="space-y-4">
                        {relatedPosts.map((relatedPost) => (
                          <Link
                            key={relatedPost.id}
                            href={`/blog/${relatedPost.slug}`}
                            className="block p-4 rounded-xl hover:bg-[#ECF0F3] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all duration-300 group"
                          >
                            <h4 className="text-sm font-semibold text-[#1f2125] group-hover:text-[#FF004F] transition-colors duration-300 line-clamp-2 mb-2">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-[#3c3e41] line-clamp-2">
                              {relatedPost.excerpt}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Custom Styles for Blog Content - Updated */}
      <style jsx global>{`
        .blog-content {
          font-size: 16px;
          color: #3c3e41;
          line-height: 1.6;
        }

        .blog-content h1 {
          font-size: 2.25rem !important;
          font-weight: 700 !important;
          margin: 1.5rem 0 1rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.2 !important;
          display: block !important;
          font-family: var(--font-montserrat);
        }

        .blog-content h2 {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          margin: 1.25rem 0 0.75rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.3 !important;
          display: block !important;
          border-bottom: 2px solid #ff004f;
          padding-bottom: 0.5rem;
          font-family: var(--font-montserrat);
        }

        .blog-content h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.4 !important;
          display: block !important;
          font-family: var(--font-montserrat);
        }

        .blog-content h4 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 0.75rem 0 0.5rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.4 !important;
          display: block !important;
          font-family: var(--font-montserrat);
        }

        .blog-content h5,
        .blog-content h6 {
          font-family: var(--font-montserrat);
          font-weight: 700;
          color: #1f2125;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .blog-content p {
          margin: 0.75rem 0 !important;
          color: #3c3e41 !important;
          line-height: 1.6 !important;
          display: block !important;
          font-size: 1rem;
        }

        .blog-content ul {
          margin: 1rem 0 !important;
          padding-left: 2rem !important;
          color: #3c3e41 !important;
          list-style-type: disc !important;
          display: block !important;
        }

        .blog-content ol {
          margin: 1rem 0 !important;
          padding-left: 2rem !important;
          color: #3c3e41 !important;
          list-style-type: decimal !important;
          display: block !important;
        }

        .blog-content li {
          margin: 0.25rem 0 !important;
          line-height: 1.6 !important;
          display: list-item !important;
        }

        /* Custom bullet for ul */
        .blog-content ul li::marker {
          color: #ff004f;
          font-size: 1.2em;
        }

        /* Custom number color for ol */
        .blog-content ol li::marker {
          color: #ff004f;
          font-weight: bold;
        }

        .blog-content blockquote {
          border-left: 4px solid #ff004f !important;
          padding: 0.75rem 1rem !important;
          margin: 1rem 0 !important;
          background: #f8f9fa !important;
          color: #3c3e41 !important;
          font-style: italic !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
          display: block !important;
        }

        .blog-content pre {
          background: #f8f9fa !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
          margin: 1rem 0 !important;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
          color: #2d3748 !important;
          border: 1px solid #e2e8f0 !important;
          display: block !important;
          white-space: pre !important;
        }

        .blog-content code {
          background: #f4f4f4;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: "Courier New", monospace;
          font-size: 0.95em;
          color: #ff004f;
        }

        .blog-content pre code {
          background: transparent;
          padding: 0;
          color: #2d3748;
        }

        .blog-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          margin: 1rem 0 !important;
          display: block !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }

        .blog-content a {
          color: #ff004f !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
          transition: color 0.3s ease;
        }

        .blog-content a:hover {
          color: #e6003d !important;
        }

        .blog-content strong {
          font-weight: 700 !important;
          color: #1f2125 !important;
        }

        .blog-content em {
          font-style: italic !important;
          color: #3c3e41 !important;
        }

        .blog-content u {
          text-decoration: underline !important;
        }

        .blog-content s {
          text-decoration: line-through !important;
          color: #6b7280 !important;
        }

        /* Custom spacer styling */
        .blog-content .custom-spacer {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1 !important;
          font-size: 1px !important;
          min-height: 5px !important;
          user-select: none !important;
          pointer-events: none !important;
        }

        .blog-content .spacing-block {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1 !important;
          font-size: 1px !important;
          min-height: 8px !important;
          user-select: none !important;
          pointer-events: none !important;
        }

        /* Colored div styling */
        .blog-content .colored-div {
          display: block !important;
          width: 100% !important;
          min-height: 40px !important;
          border-radius: 16px !important;
          margin: 16px 0 !important;
          padding: 24px !important;
          outline: none !important;
          box-sizing: border-box !important;
        }

        .blog-content .colored-div:empty:before {
          content: "Type your content here...";
          color: rgba(60, 62, 65, 0.6);
          font-style: italic;
          pointer-events: none;
        }

        /* Table styles */
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          background: #ffffff;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .blog-content th,
        .blog-content td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e5e5e5;
        }

        .blog-content th {
          background: #ff004f;
          color: #ffffff;
          font-weight: 600;
        }

        .blog-content tr:last-child td {
          border-bottom: none;
        }

        /* Custom scrollbar for sidebar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #ecf0f3;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #ff004f;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #e6003d;
        }

        @media (max-width: 640px) {
          .blog-content h1 {
            font-size: 1.9rem !important;
            margin: 1.2rem 0 0.8rem 0 !important;
          }
          .blog-content h2 {
            font-size: 1.4rem !important;
            margin: 1rem 0 0.6rem 0 !important;
            padding-bottom: 0.3rem !important;
          }
          .blog-content h3 {
            font-size: 1.25rem !important;
            margin: 0.8rem 0 0.4rem 0 !important;
          }
          .blog-content h4 {
            font-size: 1rem !important;
            margin: 0.6rem 0 0.3rem 0 !important;
          }
          .blog-content p,
          .blog-content li {
            font-size: 0.98rem !important;
          }
        }
      `}</style>
    </div>
  );
}
