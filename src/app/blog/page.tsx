"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUser,
  FaHeart,
  FaSearch,
  FaArrowRight,
  FaTag,
} from "react-icons/fa";
import PageHeader from "../../components/PageHeader/PageHeader";
import { blogData } from "../../lib/blogData";

// Categories for filtering
const categories = [
  "All",
  "Web Development",
  "WordPress",
  "E-commerce",
  "JavaScript",
  "CSS",
  "Performance",
];

const BlogPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogData);
  const [searchTerm, setSearchTerm] = useState("");
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Breadcrumbs data
  const breadcrumbs = [{ label: "Blog", href: "/blog" }];

  // Initialize likes from blog data
  useEffect(() => {
    const initialLikes: { [key: number]: number } = {};
    blogData.forEach((post) => {
      initialLikes[post.id] = post.likes;
    });
    setLikes(initialLikes);
  }, []);

  // Filter posts based on category and search
  useEffect(() => {
    let posts = blogData;

    // Filter by category
    if (activeFilter !== "All") {
      posts = posts.filter((post) => post.category === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredPosts(posts);
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get current likes from localStorage or state
  const getCurrentLikes = (postId: number) => {
    const saved = localStorage.getItem(`blog-likes-${postId}`);
    return saved ? parseInt(saved) : likes[postId] || 0;
  };

  return (
    <div className="bg-[#ECF0F3] min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="My Blog"
        subtitle="Insights, tutorials, and thoughts on web development, design, and technology"
        breadcrumbs={breadcrumbs}
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-2xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41]" />
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    activeFilter === category
                      ? "text-white bg-[#FF004F] shadow-lg transform scale-105"
                      : "text-[#3c3e41] bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] active:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-8">
            <p className="text-[#3c3e41] font-light">
              Showing {currentPosts.length} of {filteredPosts.length} articles
              {searchTerm && (
                <span className="font-medium">
                  {" "}
                  for &quot;{searchTerm}&quot;
                </span>
              )}
            </p>
          </div>

          {/* Blog Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            <AnimatePresence>
              {currentPosts.map((post) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="group bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden hover:shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] transition-all duration-300"
                >
                  <Link href={`/blog/${post.slug}`}>
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
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs text-[#3c3e41] bg-[#ECF0F3] px-2 py-1 rounded shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] flex items-center gap-1"
                          >
                            <FaTag className="w-2 h-2" />
                            {tag}
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
                            className="flex items-center gap-1 text-xs text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300 cursor-pointer"
                          >
                            <FaHeart className="w-3 h-3" />
                            <span>{getCurrentLikes(post.id)}</span>
                          </button>
                          <FaArrowRight className="w-3 h-3 text-[#FF004F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#ECF0F3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff]">
                <FaSearch className="w-8 h-8 text-[#3c3e41]" />
              </div>
              <h3 className="text-xl font-bold text-[#1f2125] mb-2">
                No articles found
              </h3>
              <p className="text-[#3c3e41] mb-6">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("All");
                }}
                className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#3c3e41] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#FF004F] transition-colors duration-300"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                      currentPage === pageNumber
                        ? "bg-[#FF004F] text-white shadow-lg"
                        : "bg-[#ECF0F3] text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F]"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#3c3e41] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#FF004F] transition-colors duration-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
