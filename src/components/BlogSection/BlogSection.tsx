"use client";

import React, { useState, useEffect, useMemo } from "react"; // useRef এবং useState থেকে অপ্রয়োজনীয় অংশ সরানো হয়েছে
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaThumbsUp,
} from "react-icons/fa"; // Remove FaHeart
import styles from "./BlogSection.module.css";

// Import blogData from lib
import { blogData } from "../../lib/blogData";

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
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});

  // useMemo ব্যবহার করে latestPosts স্থিতিশীল করা হয়েছে
  const latestPosts = useMemo(() => blogData.slice(0, 3), []);

  // localStorage থেকে ডেটা লোড করার জন্য useEffect
  useEffect(() => {
    const initialLikes: { [key: number]: number } = {};
    latestPosts.forEach((post) => {
      const savedLikes = localStorage.getItem(`blog-likes-${post.id}`);
      initialLikes[post.id] = savedLikes ? parseInt(savedLikes) : post.likes;
    });
    setLikes(initialLikes);
  }, [latestPosts]);

  // Fetch likes from backend
  useEffect(() => {
    async function fetchLikes() {
      const res = await fetch("/api/blog-likes");
      const data: Array<{ blog_id: number; likes: number }> = await res.json();
      const likesObj: { [key: number]: number } = {};
      blogData.forEach((post) => {
        const found = data.find(
          (d: { blog_id: number; likes: number }) => d.blog_id === post.id
        );
        likesObj[post.id] = found ? found.likes : post.likes;
      });
      setLikes(likesObj);
    }
    fetchLikes();
  }, []);

  // Like button handler
  const handleLike = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (likedPosts[id]) return; // Prevent multiple likes per session
    await fetch("/api/blog-likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blog_id: id }),
    });
    // Refetch likes
    const res = await fetch("/api/blog-likes");
    const data: Array<{ blog_id: number; likes: number }> = await res.json();
    const likesObj: { [key: number]: number } = {};
    blogData.forEach((post) => {
      const found = data.find(
        (d: { blog_id: number; likes: number }) => d.blog_id === post.id
      ); // <-- FIXED
      likesObj[post.id] = found ? found.likes : post.likes;
    });
    setLikes(likesObj);
    setLikedPosts((prev) => ({ ...prev, [id]: true }));
  };

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
          className="text-center text-[#3c3e41] mb-16 max-w-2xl mx-auto font-light md:font-normal"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Stay updated with the latest trends, tips, and insights from the world
          of web development and design.
        </motion.p>

        {/* Blog Grid - Framer Motion দিয়ে অ্যানিমেশন */}
        <div className={styles.postsGrid}>
          {latestPosts.map((post, index) => (
            <Link href={`/blog/${post.slug}`} key={post.id}>
              <motion.article
                className={`${styles.postCard} group cursor-pointer`}
                initial={{ opacity: 0, y: 40 }} // প্রাথমিক অবস্থা
                whileInView={{ opacity: 1, y: 0 }} // অ্যানিমেশনের শেষ অবস্থা
                viewport={{ once: true, amount: 0.2 }} // কখন অ্যানিমেশন শুরু হবে
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }} // অ্যানিমেশনের সময় ও ডিলে
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
                        onClick={(e) => handleLike(post.id, e)}
                        className={`flex items-center gap-1 text-xs text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300 cursor-pointer ${
                          likedPosts[post.id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={likedPosts[post.id]}
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
          ))}
        </div>

        {/* View All Posts Button */}
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
      </div>
    </section>
  );
};

export default BlogSection;
