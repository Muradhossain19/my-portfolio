"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaThumbsUp,
} from "react-icons/fa";
import styles from "./BlogSection.module.css";

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
}

// Animation Variants
const headingContainer: Variants = {
  visible: { transition: { staggerChildren: 0.05 } },
  hidden: {},
};

const headingCharacter: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 12, stiffness: 200 },
  },
};

const BlogSection = () => {
  const headingText = "Latest Blog Posts";
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
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
        tags: dbPost.tags,
        featured: dbPost.featured,
      };
    },
    []
  );

  // Fetch latest blog posts from database
  const fetchLatestPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/blog");

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.posts && data.posts.length > 0) {
          // Transform database posts to component format and filter only published posts
          const transformedPosts = data.posts
            .filter((post: DatabaseBlogPost) => post.published)
            .map((post: DatabaseBlogPost) => transformDatabasePost(post))
            .slice(0, 3); // Get latest 3 posts

          setLatestPosts(transformedPosts);
          console.log(
            "Latest blog posts loaded from database:",
            transformedPosts.length
          );
        } else {
          setLatestPosts([]);
          setError("No published blog posts found");
        }
      } else {
        setLatestPosts([]);
        setError("Failed to fetch blog posts");
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setLatestPosts([]);
      setError("Error loading blog posts");
    } finally {
      setIsLoading(false);
    }
  }, [transformDatabasePost]);

  // Fetch blog posts on component mount
  useEffect(() => {
    fetchLatestPosts();
  }, [fetchLatestPosts]);

  // Fetch likes from backend
  useEffect(() => {
    if (latestPosts.length === 0) return;

    const fetchLikes = async () => {
      try {
        const res = await fetch("/api/blog-likes");
        if (res.ok) {
          const data: Array<{ blog_id: number; likes_count: number }> =
            await res.json();
          const likesObj: { [key: number]: number } = {};
          latestPosts.forEach((post) => {
            const found = data.find((d) => d.blog_id === post.id);
            likesObj[post.id] = found ? found.likes_count : post.likes;
          });
          setLikes(likesObj);
        } else {
          // Use initial likes if API fails
          const initialLikes: { [key: number]: number } = {};
          latestPosts.forEach((post) => {
            initialLikes[post.id] = post.likes;
          });
          setLikes(initialLikes);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
        // Use initial likes if API fails
        const initialLikes: { [key: number]: number } = {};
        latestPosts.forEach((post) => {
          initialLikes[post.id] = post.likes;
        });
        setLikes(initialLikes);
      }
    };

    fetchLikes();
  }, [latestPosts]);

  // Loading skeleton component
  const BlogCardSkeleton = () => (
    <div className="bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
          <div className="h-6 bg-gray-300 rounded-full w-20"></div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-[#d1d9e6]">
          <div className="flex items-center gap-4">
            <div className="h-3 bg-gray-300 rounded w-12"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded w-8"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="blog" className={styles.blogSection}>
      <div className={styles.container}>
        {/* Heading */}
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-center text-[#1f2125] mb-4"
          variants={headingContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {headingText.split("").map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              variants={headingCharacter}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg text-center text-[#3c3e41] mb-16 max-w-2xl mx-auto font-light md:font-normal"
          initial={{ opacity: 0, y: 20 }}
          style={{ fontWeight: 300 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Stay updated with the latest trends, tips, and insights from the world
          of web development and design.
        </motion.p>

        {/* Blog Grid */}
        <div className={styles.postsGrid}>
          {isLoading ? (
            // Show loading skeletons
            [...Array(3)].map((_, index) => <BlogCardSkeleton key={index} />)
          ) : error || latestPosts.length === 0 ? (
            // Error or no posts available
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-[#ECF0F3] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff]">
                <FaArrowRight className="w-6 h-6 text-[#3c3e41]" />
              </div>
              <h3 className="text-lg font-bold text-[#1f2125] mb-2">
                {error || "No Blog Posts Available"}
              </h3>
              <p className="text-[#3c3e41] mb-6">
                {error
                  ? "There was an error loading blog posts. Please try again later."
                  : "Check back later for new blog posts!"}
              </p>
              {error && (
                <button
                  onClick={fetchLatestPosts}
                  className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            // Show actual blog posts
            latestPosts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <motion.article
                  className={`${styles.postCard} relative group cursor-pointer`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-[#FF004F] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}

                  {/* Blog Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-[#FF004F] uppercase tracking-wider bg-[#FF004F]/10 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <div className="flex items-center text-xs text-[#3c3e41]">
                        <FaCalendarAlt className="w-3 h-3 mr-1" />
                        {post.date}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#1f2125] leading-snug mb-3 group-hover:text-[#FF004F] transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-[#3c3e41] leading-relaxed mb-4 font-light line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs text-[#3c3e41] bg-[#ECF0F3] px-2 py-1 rounded shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#d1d9e6]">
                      <div className="flex items-center gap-4 text-xs text-[#3c3e41]">
                        <div className="flex items-center gap-1">
                          <FaUser className="w-3 h-3" />
                          {post.author}
                        </div>
                        <span>{post.readTime}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          className="flex items-center gap-1 text-xs text-[#3c3e41] opacity-50"
                          disabled
                        >
                          <FaThumbsUp className="w-3 h-3" />
                          <span>{likes[post.id] ?? post.likes}</span>
                        </button>
                        <FaArrowRight className="w-3 h-3 text-[#FF004F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))
          )}
        </div>

        {/* View All Posts Button - Only show if posts exist */}
        {!isLoading && !error && latestPosts.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/blog">
              <button className="bg-[#ECF0F3] text-[#FF004F] py-3 px-8 rounded-2xl font-semibold shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 cursor-pointer flex items-center gap-2 mx-auto">
                View All Posts
                <FaArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
