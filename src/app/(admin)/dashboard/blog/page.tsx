"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFileExport,
  FaTimes,
  FaExclamationTriangle,
  FaSave,
  FaCalendarAlt,
  FaUser,
  FaHeart,
  FaGlobe,
  FaEyeSlash,
  FaStar,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const modalContentVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Interfaces
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
  read_time: string;
  likes: number;
  tags: string[];
  featured: boolean;
  meta_description: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

const categories = [
  "All",
  "Technology",
  "Development",
  "Backend",
  "Design",
  "JavaScript",
];

const BlogManagement = () => {
  // States
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    author: "Tizfai",
    date: "",
    read_time: "5 min read",
    likes: 0,
    tags: "",
    featured: false,
    meta_description: "",
    published: true,
  });

  const [stats, setStats] = useState({
    totalPosts: 0,
    published: 0,
    drafts: 0,
    featured: 0,
  });

  // Calculate stats function
  const calculateStats = useCallback((posts: BlogPost[]) => {
    const totalPosts = posts.length;
    const published = posts.filter((post) => post.published).length;
    const drafts = posts.filter((post) => !post.published).length;
    const featured = posts.filter((post) => post.featured).length;

    setStats({
      totalPosts,
      published,
      drafts,
      featured,
    });
  }, []);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  // Fetch blog posts
  const fetchBlogPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/blog");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBlogPosts(data.posts);
          calculateStats(data.posts);
        }
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  // Filter blog posts
  const getFilteredPosts = () => {
    let filtered = blogPosts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return filtered;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        date:
          formData.date ||
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      };

      const url = showEditModal
        ? `/api/admin/blog/${selectedPost?.id}`
        : "/api/admin/blog";

      const method = showEditModal ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchBlogPosts();
        resetForm();
        setShowAddModal(false);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
      author: "Tizfai",
      date: "",
      read_time: "5 min read",
      likes: 0,
      tags: "",
      featured: false,
      meta_description: "",
      published: true,
    });
    setSelectedPost(null);
  };

  // Handle edit
  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      category: post.category,
      author: post.author,
      date: post.date,
      read_time: post.read_time,
      likes: post.likes,
      tags: post.tags.join(", "),
      featured: post.featured,
      meta_description: post.meta_description,
      published: post.published,
    });
    setSelectedPost(post);
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`/api/admin/blog/${postToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBlogPosts();
        setShowDeleteModal(false);
        setPostToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  // Handle view
  const handleView = (post: BlogPost) => {
    setSelectedPost(post);
    setShowDetailModal(true);
  };

  // Export data
  const exportData = () => {
    const data = getFilteredPosts();
    const csv = convertToCSV(data);
    downloadCSV(csv, "blog_posts_export.csv");
  };

  const convertToCSV = (data: BlogPost[]) => {
    if (data.length === 0) return "";

    const headers = [
      "ID",
      "Title",
      "Category",
      "Author",
      "Date",
      "Likes",
      "Published",
      "Featured",
    ].join(",");

    const rows = data.map((post) =>
      [
        post.id,
        `"${post.title}"`,
        `"${post.category}"`,
        `"${post.author}"`,
        `"${post.date}"`,
        post.likes,
        post.published,
        post.featured,
      ].join(",")
    );

    return [headers, ...rows].join("\n");
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECF0F3] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FF004F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECF0F3] overflow-x-hidden">
      <motion.div
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1f2125] mb-2">
                Blog Management
              </h1>
              <p className="text-[#3c3e41]">
                Create and manage your blog posts and articles
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 flex items-center gap-2 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]"
              >
                <FaPlus className="w-4 h-4" />
                Add New Post
              </button>
              <Link
                href="/dashboard"
                className="bg-[#ECF0F3] text-[#FF004F] px-6 py-3 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              variants={itemVariants}
              className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#3c3e41] text-sm mb-1">Total Posts</p>
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stats.totalPosts}
                  </p>
                </div>
                <FaGlobe className="w-8 h-8 text-[#FF004F]" />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#3c3e41] text-sm mb-1">Published</p>
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stats.published}
                  </p>
                </div>
                <FaEye className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#3c3e41] text-sm mb-1">Drafts</p>
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stats.drafts}
                  </p>
                </div>
                <FaEyeSlash className="w-8 h-8 text-orange-500" />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#3c3e41] text-sm mb-1">Featured</p>
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stats.featured}
                  </p>
                </div>
                <FaStar className="w-8 h-8 text-yellow-500" />
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#FF004F] text-white shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]"
                      : "bg-[#ECF0F3] text-[#3c3e41] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:text-[#FF004F]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search and Export */}
            <div className="flex flex-1 gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41]"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
              </div>

              <button
                onClick={exportData}
                className="bg-[#ECF0F3] text-[#FF004F] px-6 py-3 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 flex items-center gap-2"
              >
                <FaFileExport className="w-4 h-4" />
                Export
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
        >
          {getFilteredPosts().map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className="bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image || "/images/placeholder.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  quality={75}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {post.featured && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      Featured
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      post.published
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleView(post)}
                    className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-[#FF004F] hover:bg-white transition-colors duration-200"
                    title="View Details"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(post)}
                    className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-blue-500 hover:bg-white transition-colors duration-200"
                    title="Edit"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-white transition-colors duration-200"
                    title="Delete"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-[#FF004F] text-white px-2 py-1 rounded-lg text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#1f2125] mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-[#3c3e41] mb-3 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-[#3c3e41]">
                  <span className="flex items-center gap-1">
                    <FaUser className="w-3 h-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHeart className="w-3 h-3" />
                    {post.likes}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#3c3e41] mt-2">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span>{post.read_time}</span>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-[#d1d9e6] text-[#3c3e41] px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-[#3c3e41] text-xs">
                        +{post.tags.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {getFilteredPosts().length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-12">
            <FaGlobe className="w-16 h-16 text-[#d1d9e6] mx-auto mb-4" />
            <p className="text-[#3c3e41] text-lg mb-2">No blog posts found</p>
            <p className="text-[#3c3e41]">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "Create your first blog post to get started"}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence mode="wait">
        {(showAddModal || showEditModal) && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              resetForm();
            }}
          >
            <motion.div
              className="bg-[#ECF0F3] rounded-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6]">
                <h3 className="text-xl font-bold text-[#1f2125]">
                  {showEditModal ? "Edit Blog Post" : "Add New Blog Post"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#FF004F] hover:text-[#e6003d] transition-colors duration-200"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#1f2125] mb-4">
                        Basic Information
                      </h4>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value });
                            if (!showEditModal) {
                              setFormData((prev) => ({
                                ...prev,
                                slug: generateSlug(e.target.value),
                              }));
                            }
                          }}
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Slug *
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({ ...formData, slug: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Excerpt *
                        </label>
                        <textarea
                          value={formData.excerpt}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              excerpt: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] resize-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Featured Image URL *
                        </label>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                            Category *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125]"
                            required
                          >
                            <option value="">Select Category</option>
                            <option value="Technology">Technology</option>
                            <option value="Development">Development</option>
                            <option value="Backend">Backend</option>
                            <option value="Design">Design</option>
                            <option value="JavaScript">JavaScript</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                            Read Time
                          </label>
                          <input
                            type="text"
                            value={formData.read_time}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                read_time: e.target.value,
                              })
                            }
                            placeholder="5 min read"
                            className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) =>
                            setFormData({ ...formData, tags: e.target.value })
                          }
                          placeholder="react, javascript, web development"
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Meta Description
                        </label>
                        <textarea
                          value={formData.meta_description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              meta_description: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] resize-none"
                          placeholder="SEO description for this post"
                        />
                      </div>

                      {/* Checkboxes */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                featured: e.target.checked,
                              })
                            }
                            className="w-5 h-5 rounded border-2 border-[#d1d9e6] text-[#FF004F] focus:ring-[#FF004F]"
                          />
                          <span className="text-sm font-medium text-[#1f2125]">
                            Featured Post
                          </span>
                        </label>

                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.published}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                published: e.target.checked,
                              })
                            }
                            className="w-5 h-5 rounded border-2 border-[#d1d9e6] text-[#FF004F] focus:ring-[#FF004F]"
                          />
                          <span className="text-sm font-medium text-[#1f2125]">
                            Publish immediately
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Right Column - Content Editor */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#1f2125] mb-4">
                        Content *
                      </h4>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(value) =>
                          setFormData({ ...formData, content: value })
                        }
                        placeholder="Write your blog post content here..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#d1d9e6]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                        resetForm();
                      }}
                      className="px-6 py-3 bg-[#ECF0F3] text-[#3c3e41] rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
                        isSubmitting
                          ? "bg-[#3c3e41] cursor-not-allowed"
                          : "bg-[#FF004F] hover:bg-[#e6003d] shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {showEditModal ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <FaSave className="w-4 h-4" />
                          {showEditModal ? "Update Post" : "Create Post"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="bg-[#ECF0F3] rounded-2xl p-6 max-w-md w-full"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1f2125]">
                    Delete Blog Post
                  </h3>
                  <p className="text-[#3c3e41] text-sm">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-[#ECF0F3] text-[#3c3e41] rounded-lg font-semibold shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedPost && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              className="bg-[#ECF0F3] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6]">
                <div className="flex items-center gap-3">
                  {selectedPost.featured && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      Featured
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      selectedPost.published
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {selectedPost.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs font-medium text-[#FF004F] uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#FF004F] hover:text-[#e6003d] transition-colors duration-300"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h2 className="text-2xl font-bold text-[#1f2125] mb-2">
                      {selectedPost.title}
                    </h2>
                    <p className="text-[#3c3e41] mb-4">
                      {selectedPost.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-[#3c3e41] mb-4">
                      <span className="flex items-center gap-1">
                        <FaUser className="w-3 h-3" />
                        {selectedPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        {selectedPost.date}
                      </span>
                      <span>{selectedPost.read_time}</span>
                      <span className="flex items-center gap-1">
                        <FaHeart className="w-3 h-3" />
                        {selectedPost.likes}
                      </span>
                    </div>

                    {selectedPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedPost.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-[#d1d9e6] text-[#3c3e41] px-2 py-1 rounded text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Featured Image */}
                  {selectedPost.image && (
                    <div className="relative h-64 rounded-xl overflow-hidden">
                      <Image
                        src={selectedPost.image}
                        alt={selectedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2125] mb-4">
                      Content
                    </h3>
                    <div
                      className="prose max-w-none text-[#3c3e41]"
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                    />
                  </div>

                  {/* Meta Information */}
                  {selectedPost.meta_description && (
                    <div>
                      <h3 className="text-lg font-bold text-[#1f2125] mb-2">
                        Meta Description
                      </h3>
                      <p className="text-[#3c3e41] bg-[#f8f9fa] p-3 rounded-lg">
                        {selectedPost.meta_description}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-[#d1d9e6]">
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleEdit(selectedPost);
                      }}
                      className="flex-1 bg-[#FF004F] text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-[#e6003d] transition-colors duration-300 text-sm flex items-center justify-center gap-2"
                    >
                      <FaEdit className="w-4 h-4" />
                      Edit Post
                    </button>
                    <Link
                      href={`/blog/${selectedPost.slug}`}
                      target="_blank"
                      className="px-6 py-2.5 rounded-lg bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300 flex items-center gap-2"
                    >
                      <FaEye className="w-4 h-4" />
                      View Live
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManagement;
