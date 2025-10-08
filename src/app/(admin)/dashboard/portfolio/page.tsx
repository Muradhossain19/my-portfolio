"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFileExport,
  FaTimes,
  FaExclamationTriangle,
  FaGlobe,
  FaHeart,
  FaCalendarAlt,
  FaUser,
  FaDollarSign,
  FaTag,
  FaSave,
  FaLink,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Animation variants - Optimized for better performance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Reduced from 0.1
      duration: 0.3, // Reduced from 0.6
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 }, // Reduced from y: 20
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3, // Reduced from 0.5
      ease: "easeOut",
    },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }, // Added smooth transition
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const modalContentVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 }, // Reduced from 0.9
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" }, // Added smooth transition
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Interfaces
interface PortfolioItem {
  id: number;
  images: string[];
  category: string;
  title: string;
  description: string;
  long_description: string;
  client: string;
  date: string;
  services: string;
  budget: string;
  likes: number;
  link: string;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

const categories = ["All", "Web Development", "WordPress", "E-commerce"];

const PortfolioManagement = () => {
  // States
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    images: "",
    category: "",
    title: "",
    description: "",
    long_description: "",
    client: "",
    date: "",
    services: "",
    budget: "",
    likes: 1,
    link: "#",
    features: "",
  });

  const [stats, setStats] = useState({
    totalItems: 0,
    webDevelopment: 0,
    wordpress: 0,
    ecommerce: 0,
  });

  // Add smooth scrolling effect
  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = "smooth";

    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  // Calculate stats function
  const calculateStats = useCallback((items: PortfolioItem[]) => {
    const totalItems = items.length;
    const webDevelopment = items.filter(
      (item) => item.category === "Web Development"
    ).length;
    const wordpress = items.filter(
      (item) => item.category === "WordPress"
    ).length;
    const ecommerce = items.filter(
      (item) => item.category === "E-commerce"
    ).length;

    setStats({
      totalItems,
      webDevelopment,
      wordpress,
      ecommerce,
    });
  }, []);

  // Fetch portfolio items
  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/portfolio");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPortfolioItems(data.portfolio);
          calculateStats(data.portfolio);
        }
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // Filter portfolio items
  const getFilteredItems = () => {
    let filtered = portfolioItems;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
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
        images: formData.images.split(",").map((img) => img.trim()),
        features: formData.features.split(",").map((feature) => feature.trim()),
        likes: Number(formData.likes),
      };

      const url = showEditModal
        ? `/api/admin/portfolio/${selectedItem?.id}`
        : "/api/admin/portfolio";

      const method = showEditModal ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchPortfolio();
        resetForm();
        setShowAddModal(false);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error saving portfolio item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      images: "",
      category: "",
      title: "",
      description: "",
      long_description: "",
      client: "",
      date: "",
      services: "",
      budget: "",
      likes: 1,
      link: "#",
      features: "",
    });
    setSelectedItem(null);
  };

  // Handle edit
  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      images: item.images.join(", "),
      category: item.category,
      title: item.title,
      description: item.description,
      long_description: item.long_description,
      client: item.client,
      date: item.date,
      services: item.services,
      budget: item.budget,
      likes: item.likes,
      link: item.link,
      features: item.features.join(", "),
    });
    setSelectedItem(item);
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/admin/portfolio/${itemToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPortfolio();
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
    }
  };

  // Handle view
  const handleView = (item: PortfolioItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // Export data
  const exportData = () => {
    const data = getFilteredItems();
    const csv = convertToCSV(data);
    downloadCSV(csv, "portfolio_export.csv");
  };

  const convertToCSV = (data: PortfolioItem[]) => {
    if (data.length === 0) return "";

    const headers = [
      "ID",
      "Title",
      "Category",
      "Client",
      "Date",
      "Services",
      "Budget",
      "Likes",
      "Link",
    ].join(",");

    const rows = data.map((item) =>
      [
        item.id,
        `"${item.title}"`,
        `"${item.category}"`,
        `"${item.client}"`,
        `"${item.date}"`,
        `"${item.services}"`,
        `"${item.budget}"`,
        item.likes,
        `"${item.link}"`,
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
                Portfolio Management
              </h1>
              <p className="text-[#3c3e41]">
                Manage your portfolio projects and showcase your work
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 flex items-center gap-2 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]"
              >
                <FaPlus className="w-4 h-4" />
                Add New Project
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
                  <p className="text-[#3c3e41] text-sm mb-1">Total Projects</p>
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stats.totalItems}
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
                  <p className="text-[#3c3e41] text-sm mb-1">Web Development</p>
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stats.webDevelopment}
                  </p>
                </div>
                <FaGlobe className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#3c3e41] text-sm mb-1">WordPress</p>
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stats.wordpress}
                  </p>
                </div>
                <FaGlobe className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#3c3e41] text-sm mb-1">E-commerce</p>
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stats.ecommerce}
                  </p>
                </div>
                <FaGlobe className="w-8 h-8 text-purple-500" />
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
                  placeholder="Search projects..."
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

        {/* Portfolio Grid - Optimized for smooth scrolling */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20"
        >
          {getFilteredItems().map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className="bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden group will-change-transform"
              whileHover={{ y: -2, scale: 1.02 }}
              style={{
                transform: "translateZ(0)", // Force hardware acceleration
                backfaceVisibility: "hidden",
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.images[0] || "/images/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  quality={75}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleView(item)}
                    className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-[#FF004F] hover:bg-white transition-colors duration-200"
                    title="View Details"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-blue-500 hover:bg-white transition-colors duration-200"
                    title="Edit"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-white transition-colors duration-200"
                    title="Delete"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-[#FF004F] text-white px-2 py-1 rounded-lg text-xs font-medium">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#1f2125] mb-2 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[#3c3e41] mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-[#3c3e41]">
                  <span className="flex items-center gap-1">
                    <FaUser className="w-3 h-3" />
                    {item.client}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHeart className="w-3 h-3" />
                    {item.likes}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#3c3e41] mt-2">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    {item.date}
                  </span>
                  <span>{item.budget}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {getFilteredItems().length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-12">
            <FaGlobe className="w-16 h-16 text-[#d1d9e6] mx-auto mb-4" />
            <p className="text-[#3c3e41] text-lg mb-2">No projects found</p>
            <p className="text-[#3c3e41]">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "Add your first project to get started"}
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
              className="bg-[#ECF0F3] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6]">
                <h3 className="text-xl font-bold text-[#1f2125]">
                  {showEditModal ? "Edit Project" : "Add New Project"}
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

              <div className="flex-1 overflow-y-auto p-6 smooth-scroll">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#1f2125] mb-4">
                        Basic Information
                      </h4>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                          required
                        />
                      </div>

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
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="Web Development">
                            Web Development
                          </option>
                          <option value="WordPress">WordPress</option>
                          <option value="E-commerce">E-commerce</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Short Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] resize-none focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Long Description *
                        </label>
                        <textarea
                          value={formData.long_description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              long_description: e.target.value,
                            })
                          }
                          rows={5}
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] resize-none focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                          required
                        />
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-[#1f2125] mb-4">
                        Project Details
                      </h4>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Image URLs *
                        </label>
                        <textarea
                          value={formData.images}
                          onChange={(e) =>
                            setFormData({ ...formData, images: e.target.value })
                          }
                          placeholder="Enter image URLs separated by commas"
                          rows={3}
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] resize-none focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                          required
                        />
                        <p className="text-xs text-[#3c3e41] mt-1">
                          Separate multiple URLs with commas
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                            Client *
                          </label>
                          <input
                            type="text"
                            value={formData.client}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                client: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                            Date *
                          </label>
                          <input
                            type="text"
                            value={formData.date}
                            onChange={(e) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                            placeholder="e.g., 20 July 2025"
                            className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                            Services *
                          </label>
                          <input
                            type="text"
                            value={formData.services}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                services: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                            Budget
                          </label>
                          <input
                            type="text"
                            value={formData.budget}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                budget: e.target.value,
                              })
                            }
                            placeholder="e.g., $1000"
                            className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                            Initial Likes
                          </label>
                          <input
                            type="number"
                            value={formData.likes}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                likes: Number(e.target.value),
                              })
                            }
                            min="1"
                            className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                            Project Link
                          </label>
                          <input
                            type="text"
                            value={formData.link}
                            onChange={(e) =>
                              setFormData({ ...formData, link: e.target.value })
                            }
                            placeholder="#"
                            className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f2125] mb-2">
                          Key Features *
                        </label>
                        <textarea
                          value={formData.features}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              features: e.target.value,
                            })
                          }
                          placeholder="Enter features separated by commas"
                          rows={4}
                          className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] resize-none focus:shadow-[inset_8px_8px_15px_#d1d9e6,inset_-8px_-8px_15px_#ffffff] transition-shadow duration-200"
                          required
                        />
                        <p className="text-xs text-[#3c3e41] mt-1">
                          Separate multiple features with commas
                        </p>
                      </div>
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
                          : "bg-[#FF004F] hover:bg-[#e6003d] shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[3px_3px_10px_#d1d9e6,-3px_-3px_10px_#ffffff]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {showEditModal ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        <>
                          <FaSave className="w-4 h-4" />
                          {showEditModal ? "Update Project" : "Add Project"}
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

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              className="bg-[#ECF0F3] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6]">
                <h3 className="text-xl font-bold text-[#1f2125]">
                  Project Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#FF004F] hover:text-[#e6003d] transition-colors duration-200"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Images */}
                  <div>
                    <h4 className="text-lg font-semibold text-[#1f2125] mb-4">
                      Project Images
                    </h4>
                    <div className="space-y-4">
                      {selectedItem.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative h-48 rounded-xl overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`${selectedItem.title} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-[#1f2125] mb-2">
                        {selectedItem.title}
                      </h4>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-[#FF004F] text-white px-3 py-1 rounded-lg text-sm">
                          {selectedItem.category}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-[#3c3e41]">
                          <FaHeart className="w-3 h-3" />
                          {selectedItem.likes}
                        </span>
                      </div>
                      <p className="text-[#3c3e41] leading-relaxed">
                        {selectedItem.long_description}
                      </p>
                    </div>

                    {/* Project Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <div className="flex items-center gap-2 text-[#FF004F] mb-2">
                          <FaUser className="w-4 h-4" />
                          <span className="font-semibold">Client</span>
                        </div>
                        <p className="text-[#1f2125]">{selectedItem.client}</p>
                      </div>

                      <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <div className="flex items-center gap-2 text-[#FF004F] mb-2">
                          <FaCalendarAlt className="w-4 h-4" />
                          <span className="font-semibold">Date</span>
                        </div>
                        <p className="text-[#1f2125]">{selectedItem.date}</p>
                      </div>

                      <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <div className="flex items-center gap-2 text-[#FF004F] mb-2">
                          <FaTag className="w-4 h-4" />
                          <span className="font-semibold">Services</span>
                        </div>
                        <p className="text-[#1f2125]">
                          {selectedItem.services}
                        </p>
                      </div>

                      <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <div className="flex items-center gap-2 text-[#FF004F] mb-2">
                          <FaDollarSign className="w-4 h-4" />
                          <span className="font-semibold">Budget</span>
                        </div>
                        <p className="text-[#1f2125]">{selectedItem.budget}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h5 className="text-lg font-semibold text-[#1f2125] mb-3">
                        Key Features
                      </h5>
                      <div className="space-y-2">
                        {selectedItem.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-3 bg-[#ECF0F3] rounded-lg shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                          >
                            <div className="w-2 h-2 bg-[#FF004F] rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-[#1f2125]">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                      {selectedItem.link !== "#" && (
                        <a
                          href={selectedItem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#FF004F] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 text-center flex items-center justify-center gap-2"
                        >
                          <FaLink className="w-4 h-4" />
                          View Live Project
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setShowDetailModal(false);
                          handleEdit(selectedItem);
                        }}
                        className="flex-1 bg-[#ECF0F3] text-[#FF004F] py-3 px-6 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaEdit className="w-4 h-4" />
                        Edit Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
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
              className="bg-[#ECF0F3] rounded-2xl max-w-md w-full p-6"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1f2125] mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-[#3c3e41] mb-6">
                  Are you sure you want to delete this portfolio project? This
                  action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-[#ECF0F3] text-[#3c3e41] px-6 py-3 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioManagement;
