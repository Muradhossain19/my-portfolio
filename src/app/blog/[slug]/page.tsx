"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaCalendarAlt,
  FaUser,
  FaThumbsUp,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaArrowLeft,
  FaArrowRight,
  FaTag,
  FaEye,
  FaFire,
} from "react-icons/fa";
import PageHeader from "../../../components/PageHeader/PageHeader";
import {
  getBlogPostBySlug,
  getRelatedPosts,
  blogData,
  type BlogPost,
} from "../../../lib/blogData";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>; // <-- Promise যোগ করুন
}

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

    const foundPost = getBlogPostBySlug(slug);
    if (!foundPost) {
      notFound();
    }
    setPost(foundPost);

    // Load likes from localStorage - ADD typeof check
    if (typeof window !== "undefined") {
      // <-- Add this check
      const savedLikes = localStorage.getItem(`blog-likes-${foundPost.id}`);
      const currentLikes = savedLikes ? parseInt(savedLikes) : foundPost.likes;
      setLikes(currentLikes);

      // Check if user already liked this post
      const userLiked = localStorage.getItem(`user-liked-${foundPost.id}`);
      setIsLiked(userLiked === "true");
    } else {
      // Server-side fallback
      setLikes(foundPost.likes);
      setIsLiked(false);
    }

    setRelatedPosts(getRelatedPosts(foundPost.id, foundPost.category));

    // Get recent posts (latest 5, excluding current post)
    const recent = blogData.filter((p) => p.id !== foundPost.id).slice(0, 5);
    setRecentPosts(recent);

    // Get popular posts (by likes, excluding current post)
    const popular = blogData
      .filter((p) => p.id !== foundPost.id)
      .sort((a, b) => {
        const aLikes = parseInt(
          localStorage.getItem(`blog-likes-${a.id}`) || a.likes.toString()
        );
        const bLikes = parseInt(
          localStorage.getItem(`blog-likes-${b.id}`) || b.likes.toString()
        );
        return bLikes - aLikes;
      })
      .slice(0, 4);
    setPopularPosts(popular);

    // Find next and previous posts
    const currentIndex = blogData.findIndex((p) => p.id === foundPost.id);
    if (currentIndex > 0) {
      setPrevPost(blogData[currentIndex - 1]);
    }
    if (currentIndex < blogData.length - 1) {
      setNextPost(blogData[currentIndex + 1]);
    }
  }, [slug]);

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
      const res = await fetch("/api/blog-likes");
      const data: Array<{ blog_id: number; likes: number }> = await res.json();
      const found = data.find(
        (d: { blog_id: number; likes: number }) => d.blog_id === post.id
      );
      setLikes(found ? found.likes : post.likes);
    }
    fetchLikes();
  }, [slug, post]);

  const handleLike = async () => {
    if (!post || isLiked) return;
    await fetch("/api/blog-likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blog_id: post.id }),
    });
    // Refetch likes
    const res = await fetch("/api/blog-likes");
    const data: Array<{ blog_id: number; likes: number }> = await res.json();
    const found = data.find(
      (d: { blog_id: number; likes: number }) => d.blog_id === post.id
    ); // <-- FIXED
    setLikes(found ? found.likes : post.likes);
    setIsLiked(true);
  };

  const handleShare = (platform: string) => {
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

  // Get current likes from localStorage for display - ADD typeof check
  const getCurrentLikes = (postId: number) => {
    if (typeof window !== "undefined") {
      // <-- Add this check
      const saved = localStorage.getItem(`blog-likes-${postId}`);
      return saved
        ? parseInt(saved)
        : blogData.find((p) => p.id === postId)?.likes || 0;
    }
    return blogData.find((p) => p.id === postId)?.likes || 0; // Server-side fallback
  };

  if (!slug || !post) {
    return (
      <div className="bg-[#ECF0F3] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF004F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3c3e41]">Loading...</p>
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
                style={{
                  fontFamily: "var(--font-poppins)",
                }}
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
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-10 h-10 bg-[#ECF0F3] rounded-full flex items-center justify-center text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#0077b5] transition-colors duration-300"
                  >
                    <FaLinkedinIn />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="flex items-center gap-3 p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                  >
                    <FaArrowLeft className="text-[#FF004F]" />
                    <div>
                      <p className="text-sm text-[#3c3e41]">Previous</p>
                      <p className="font-semibold text-[#1f2125] line-clamp-1">
                        {prevPost.title}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/blog"
                    className="flex items-center gap-3 p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                  >
                    <FaArrowLeft className="text-[#FF004F]" />
                    <div>
                      <p className="text-sm text-[#3c3e41]">Back to</p>
                      <p className="font-semibold text-[#1f2125]">All Posts</p>
                    </div>
                  </Link>
                )}

                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="flex items-center justify-end gap-3 p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                  >
                    <div className="text-right">
                      <p className="text-sm text-[#3c3e41]">Next</p>
                      <p className="font-semibold text-[#1f2125] line-clamp-1">
                        {nextPost.title}
                      </p>
                    </div>
                    <FaArrowRight className="text-[#FF004F]" />
                  </Link>
                ) : (
                  <Link
                    href="/blog"
                    className="flex items-center justify-end gap-3 p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                  >
                    <div className="text-right">
                      <p className="text-sm text-[#3c3e41]">More</p>
                      <p className="font-semibold text-[#1f2125]">Articles</p>
                    </div>
                    <FaArrowRight className="text-[#FF004F]" />
                  </Link>
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
                  {recentPosts.map((recentPost, index) => (
                    <motion.div
                      key={recentPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link
                        href={`/blog/${recentPost.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-4 p-3 rounded-xl hover:bg-[#d1d9e6]/30 transition-all duration-300">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={recentPost.image}
                              alt={recentPost.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#1f2125] group-hover:text-[#FF004F] transition-colors duration-300 line-clamp-2 text-sm leading-snug mb-2">
                              {recentPost.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-[#3c3e41]">
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt className="w-3 h-3" />
                                {recentPost.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaEye className="w-3 h-3" />
                                {recentPost.readTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* View All Posts Link */}
                <div className="mt-6 pt-4 border-t border-[#d1d9e6]">
                  <Link
                    href="/blog"
                    className="flex items-center justify-center gap-2 text-[#FF004F] hover:text-[#e6003d] transition-colors duration-300 font-medium text-sm"
                  >
                    <span>View All Posts</span>
                    <FaArrowRight className="w-3 h-3" />
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
                  {popularPosts.map((popularPost, index) => (
                    <motion.div
                      key={popularPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link
                        href={`/blog/${popularPost.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-4 p-3 rounded-xl hover:bg-[#d1d9e6]/30 transition-all duration-300">
                          <div className="relative">
                            <div className="w-8 h-8 bg-[#FF004F] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#1f2125] group-hover:text-[#FF004F] transition-colors duration-300 line-clamp-2 text-sm leading-snug mb-2">
                              {popularPost.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-[#3c3e41]">
                              <span className="flex items-center gap-1">
                                <FaThumbsUp className="w-3 h-3" />
                                {getCurrentLikes(popularPost.id)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
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
                        className="group block"
                      >
                        <div className="flex gap-4 p-4 rounded-xl hover:bg-[#d1d9e6]/20 transition-colors duration-300">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#1f2125] group-hover:text-[#FF004F] transition-colors duration-300 line-clamp-2 text-sm">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-[#3c3e41] mt-1">
                              {relatedPost.date}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Card */}
              <div className="p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#FF004F]">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#1f2125] mb-2">
                    {post.author}
                  </h4>
                  <p className="text-sm text-[#3c3e41] mb-4">
                    Web Developer & Content Creator
                  </p>
                  <div className="flex justify-center gap-3">
                    <a
                      href="#"
                      className="w-8 h-8 bg-[#ECF0F3] rounded-full flex items-center justify-center text-[#3c3e41] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:text-[#FF004F] transition-colors duration-300"
                    >
                      <FaTwitter className="text-sm" />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-[#ECF0F3] rounded-full flex items-center justify-center text-[#3c3e41] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:text-[#FF004F] transition-colors duration-300"
                    >
                      <FaLinkedinIn className="text-sm" />
                    </a>
                  </div>
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
