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
} from "react-icons/fa";
import PageHeader from "../../../components/PageHeader/PageHeader";
import {
  getBlogPostBySlug,
  getRelatedPosts,
  blogData,
} from "../../../lib/blogData";

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

// Interface for component blog post (keeping original structure)
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

// Skeleton Components
const BlogPostSkeleton = () => (
  <div className="bg-[#ECF0F3] min-h-screen">
    {/* Header Skeleton */}
    <div className="bg-[#ECF0F3] py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-6 animate-pulse"></div>
        <div className="flex justify-center gap-2">
          <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Skeleton */}
          <div className="lg:col-span-8">
            {/* Featured Image Skeleton */}
            <div className="h-64 md:h-96 bg-gray-300 rounded-2xl mb-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] animate-pulse"></div>

            {/* Article Meta Skeleton */}
            <div className="flex flex-wrap items-center gap-6 mb-8 p-6 bg-[#ECF0F3] rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-24 bg-gray-300 rounded-full animate-pulse"></div>
            </div>

            {/* Article Content Skeleton */}
            <div className="mb-12 space-y-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                  {index % 3 === 0 && (
                    <div className="h-8 bg-gray-300 rounded w-1/2 mt-6 mb-4 animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-20 bg-gray-300 rounded-full shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] animate-pulse"
                ></div>
              ))}
            </div>

            {/* Social Actions Skeleton */}
            <div className="flex items-center justify-between p-6 bg-[#ECF0F3] rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] mb-12">
              <div className="flex items-center gap-4">
                <div className="h-10 w-16 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Navigation Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-xl animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2 text-right">
                    <div className="h-4 w-20 bg-gray-300 rounded ml-auto animate-pulse"></div>
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
            {/* Recent Posts Skeleton */}
            <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
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
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Popular Posts Skeleton */}
            <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 w-28 bg-gray-300 rounded animate-pulse"></div>
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

            {/* Author Card Skeleton */}
            <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-300 rounded mx-auto animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded mx-auto animate-pulse"></div>
                </div>
                <div className="h-4 w-20 bg-gray-300 rounded mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [slug, setSlug] = useState<string>("");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

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
        tags: dbPost.tags,
        featured: dbPost.featured,
        metaDescription: dbPost.meta_description,
      };
    },
    []
  );

  // Fetch all blog posts
  const fetchAllPosts = useCallback(async (): Promise<BlogPost[]> => {
    try {
      const response = await fetch("/api/admin/blog");

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.posts && data.posts.length > 0) {
          // Transform database posts to component format and filter only published posts
          const transformedPosts = data.posts
            .filter((post: DatabaseBlogPost) => post.published)
            .map((post: DatabaseBlogPost) => transformDatabasePost(post));

          return transformedPosts;
        }
      }

      // Fallback to static data
      return blogData;
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return blogData;
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

  // params resolve করার জন্য useEffect
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setIsLoading(true);

      try {
        // Fetch all posts first
        const posts = await fetchAllPosts();
        setAllPosts(posts);

        // Find current post
        const foundPost = findPostBySlug(posts, slug);
        if (!foundPost) {
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
        const recent = posts.filter((p) => p.id !== foundPost.id).slice(0, 5);
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

        // Load likes from localStorage
        if (typeof window !== "undefined") {
          const savedLikes = localStorage.getItem(`blog-likes-${foundPost.id}`);
          const currentLikes = savedLikes
            ? parseInt(savedLikes)
            : foundPost.likes;
          setLikes(currentLikes);

          // Check if user already liked this post
          const userLiked = localStorage.getItem(`user-liked-${foundPost.id}`);
          setIsLiked(userLiked === "true");
        } else {
          setLikes(foundPost.likes);
          setIsLiked(false);
        }
      } catch (error) {
        console.error("Error loading blog data:", error);
        // Fallback to static data
        const staticPost = getBlogPostBySlug(slug);
        if (!staticPost) {
          notFound();
          return;
        }
        setPost(staticPost);
        setRelatedPosts(getRelatedPosts(staticPost.id, staticPost.category));
        setRecentPosts(
          blogData.filter((p) => p.id !== staticPost.id).slice(0, 5)
        );
        setPopularPosts(
          blogData
            .filter((p) => p.id !== staticPost.id)
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 4)
        );
        setLikes(staticPost.likes);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [slug, fetchAllPosts, findPostBySlug, getRelatedPostsFromList]);

  // Reading progress tracker
  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.getElementById("blog-content");
      if (!article) return;

      const scrollTop = window.scrollY;
      const docHeight = article.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const scrollPercentRounded = Math.round(scrollPercent * 100);

      setReadingProgress(Math.min(100, Math.max(0, scrollPercentRounded)));
    };

    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  // Fetch likes from backend
  useEffect(() => {
    if (!slug || !post) return;
    async function fetchLikes() {
      if (!post) return;
      try {
        const res = await fetch("/api/blog-likes");
        const data: Array<{ blog_id: number; likes_count: number }> =
          await res.json();
        const found = data.find((d) => d.blog_id === post.id);
        setLikes(found ? found.likes_count : post.likes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    }
    fetchLikes();
  }, [slug, post]);

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
      const data: Array<{ blog_id: number; likes_count: number }> =
        await res.json();
      const found = data.find((d) => d.blog_id === post.id);
      setLikes(found ? found.likes_count : post.likes);
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

  // Get current likes from localStorage for display
  const getCurrentLikes = (postId: number) => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`blog-likes-${postId}`);
      return saved
        ? parseInt(saved)
        : allPosts.find((p) => p.id === postId)?.likes || 0;
    }
    return allPosts.find((p) => p.id === postId)?.likes || 0;
  };

  // Loading state with skeleton
  if (isLoading) {
    return <BlogPostSkeleton />;
  }

  if (!slug || !post) {
    return <BlogPostSkeleton />;
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <div className="bg-[#ECF0F3] min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#d1d9e6] z-50">
        <div
          className="h-full bg-[#FF004F] transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbs={breadcrumbs}
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Article */}
            <motion.article
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
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

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-8 p-6 bg-[#ECF0F3] rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
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
              </div>

              {/* Article Content */}
              <div
                id="blog-content"
                className="prose prose-lg max-w-none mb-12"
              >
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{
                    color: "#3c3e41",
                    lineHeight: "1.8",
                  }}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 bg-[#ECF0F3] text-[#3c3e41] px-4 py-2 rounded-full text-sm shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                  >
                    <FaTag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Social Actions */}
              <div className="flex items-center justify-between p-6 bg-[#ECF0F3] rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] mb-12">
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
              </div>

              {/* Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </motion.article>

            {/* Sidebar */}
            <motion.aside
              className="lg:col-span-4 space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
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
                          <span>{getCurrentLikes(popularPost.id)} likes</span>
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

              {/* Author Card */}
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
                    href="/contact"
                    className="text-sm text-[#FF004F] hover:underline font-medium"
                  >
                    Contact Me →
                  </Link>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Custom Styles for Blog Content */}
      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          font-family: var(--font-montserrat);
          font-weight: 700;
          color: #1f2125;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .blog-content h2 {
          font-size: 1.5rem;
          border-bottom: 2px solid #ff004f;
          padding-bottom: 0.5rem;
        }

        .blog-content h3 {
          font-size: 1.25rem;
        }

        .blog-content p {
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .blog-content ul,
        .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .blog-content li {
          margin-bottom: 0.5rem;
        }

        .blog-content strong {
          color: #1f2125;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
