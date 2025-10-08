"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import {
  FaUser,
  FaStar,
  FaCalendarAlt,
  FaEye,
  FaTrash,
  FaSearch,
  FaFileExport,
  FaTimes,
  FaExclamationTriangle,
  FaBuilding,
  FaQuoteLeft,
  FaStarHalfAlt,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

// Interfaces
interface Review {
  id: number;
  reviewer_name: string;
  reviewer_title?: string;
  company?: string;
  review_text: string;
  rating: number;
  project?: string;
  image?: string;
  date?: string;
  created_at?: string;
}

const ReviewsManagement = () => {
  // States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    fiveStarReviews: 0,
    recentReviews: 0,
  });

  // Calculate stats function with useCallback
  const calculateStats = useCallback((reviewsData: Review[]) => {
    const totalReviews = reviewsData.length;
    const averageRating =
      totalReviews > 0
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;
    const fiveStarReviews = reviewsData.filter(
      (review) => review.rating === 5
    ).length;

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = reviewsData.filter((review) => {
      const reviewDate = new Date(review.created_at || review.date || "");
      return reviewDate > thirtyDaysAgo;
    }).length;

    setStats({
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      fiveStarReviews,
      recentReviews,
    });
  }, []);

  // Fetch reviews function with useCallback
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  // useEffect with proper dependency
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Filter reviews based on search
  const getFilteredReviews = () => {
    if (!searchTerm) return reviews;

    return reviews.filter(
      (review) =>
        review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.review_text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle actions
  const handleView = (review: Review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const handleDelete = (id: number) => {
    setReviewToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reviewToDelete,
          token: process.env.NEXT_PUBLIC_ADMIN_TOKEN || "your-admin-token",
        }),
      });

      if (response.ok) {
        fetchReviews(); // Refresh data
        setShowDeleteModal(false);
        setReviewToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const exportData = () => {
    const data = getFilteredReviews();
    const csv = convertToCSV(data);
    downloadCSV(csv, "reviews_export.csv");
  };

  const convertToCSV = (data: Review[]) => {
    if (data.length === 0) return "";

    const headers = [
      "ID",
      "Reviewer Name",
      "Company",
      "Project",
      "Rating",
      "Review",
      "Date",
    ].join(",");
    const rows = data.map((review) =>
      [
        review.id,
        `"${review.reviewer_name}"`,
        `"${review.company || ""}"`,
        `"${review.project || ""}"`,
        review.rating,
        `"${review.review_text.replace(/"/g, '""')}"`,
        review.created_at || review.date || "",
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const stars = [];
    const sizeClass =
      size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FaStar key={i} className={`${sizeClass} text-yellow-400`} />
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <FaStarHalfAlt key={i} className={`${sizeClass} text-yellow-400`} />
        );
      } else {
        stars.push(<FaStar key={i} className={`${sizeClass} text-gray-300`} />);
      }
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECF0F3] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FF004F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#ECF0F3] p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1f2125] mb-2">
              Reviews Management
            </h1>
            <p className="text-[#3c3e41]">
              Manage all your client reviews and testimonials
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-[#ECF0F3] text-[#FF004F] px-6 py-3 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3c3e41] text-sm mb-1">Total Reviews</p>
                <p className="text-2xl font-bold text-[#1f2125]">
                  {stats.totalReviews}
                </p>
              </div>
              <FaQuoteLeft className="w-8 h-8 text-[#FF004F]" />
            </div>
          </div>

          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3c3e41] text-sm mb-1">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stats.averageRating}
                  </p>
                  {renderStars(stats.averageRating, "sm")}
                </div>
              </div>
              <FaStar className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3c3e41] text-sm mb-1">5-Star Reviews</p>
                <p className="text-2xl font-bold text-[#1f2125]">
                  {stats.fiveStarReviews}
                </p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3c3e41] text-sm mb-1">Recent Reviews</p>
                <p className="text-2xl font-bold text-[#1f2125]">
                  {stats.recentReviews}
                </p>
                <p className="text-xs text-[#3c3e41]">Last 30 days</p>
              </div>
              <FaCalendarAlt className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Search and Export */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by reviewer name, company, or project..."
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

      {/* Table */}
      <motion.div
        variants={itemVariants}
        className="bg-[#ECF0F3] rounded-2xl shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#ECF0F3] border-b border-[#d1d9e6]">
              <tr>
                <th className="text-left p-6 text-[#1f2125] font-semibold">
                  Reviewer
                </th>
                <th className="text-left p-6 text-[#1f2125] font-semibold">
                  Rating
                </th>
                <th className="text-left p-6 text-[#1f2125] font-semibold">
                  Review
                </th>
                <th className="text-left p-6 text-[#1f2125] font-semibold">
                  Project
                </th>
                <th className="text-left p-6 text-[#1f2125] font-semibold">
                  Date
                </th>
                <th className="text-left p-6 text-[#1f2125] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredReviews().map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-[#d1d9e6] hover:bg-[#d1d9e6]/30 transition-colors duration-200"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ECF0F3] rounded-full flex items-center justify-center shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] overflow-hidden">
                        {review.image ? (
                          <Image
                            src={review.image}
                            alt={review.reviewer_name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <FaUser className="w-4 h-4 text-[#FF004F]" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1f2125]">
                          {review.reviewer_name}
                        </p>
                        {review.company && (
                          <p className="text-sm text-[#3c3e41] flex items-center gap-1">
                            <FaBuilding className="w-3 h-3" />
                            {review.company}
                          </p>
                        )}
                        {review.reviewer_title && (
                          <p className="text-xs text-[#3c3e41]">
                            {review.reviewer_title}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating, "sm")}
                      <span className="text-sm font-semibold text-[#1f2125]">
                        {review.rating}/5
                      </span>
                    </div>
                  </td>

                  <td className="p-6">
                    <p className="text-[#1f2125] line-clamp-2 max-w-xs">
                      {review.review_text}
                    </p>
                  </td>

                  <td className="p-6">
                    <span className="text-sm text-[#3c3e41]">
                      {review.project || "N/A"}
                    </span>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-2 text-[#3c3e41]">
                      <FaCalendarAlt className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(review.created_at || review.date)}
                      </span>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(review)}
                        className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center text-[#FF004F] transition-all duration-300"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(review.id)}
                        className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center text-red-500 transition-all duration-300"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {getFilteredReviews().length === 0 && (
            <div className="text-center py-12">
              <FaQuoteLeft className="w-16 h-16 text-[#d1d9e6] mx-auto mb-4" />
              <p className="text-[#3c3e41] text-lg mb-2">No reviews found</p>
              <p className="text-[#3c3e41]">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No reviews have been submitted yet"}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Detail Modal */}
      {showDetailModal && selectedReview && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => setShowDetailModal(false)}
        >
          <motion.div
            className="bg-[#ECF0F3] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            variants={modalContentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6]">
              <h3 className="text-xl font-bold text-[#1f2125]">
                Review Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#FF004F]"
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Reviewer Info */}
                <div className="flex items-center gap-4 p-4 bg-[#ECF0F3] rounded-xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                  <div className="w-16 h-16 bg-[#ECF0F3] rounded-full flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] overflow-hidden">
                    {selectedReview.image ? (
                      <Image
                        src={selectedReview.image}
                        alt={selectedReview.reviewer_name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FaUser className="w-8 h-8 text-[#FF004F]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#1f2125]">
                      {selectedReview.reviewer_name}
                    </h4>
                    {selectedReview.reviewer_title && (
                      <p className="text-[#3c3e41]">
                        {selectedReview.reviewer_title}
                      </p>
                    )}
                    {selectedReview.company && (
                      <p className="text-sm text-[#3c3e41] flex items-center gap-1">
                        <FaBuilding className="w-3 h-3" />
                        {selectedReview.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating and Project */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                    <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                      Rating
                    </label>
                    <div className="flex items-center gap-3">
                      {renderStars(selectedReview.rating, "lg")}
                      <span className="text-xl font-bold text-[#1f2125]">
                        {selectedReview.rating}/5
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                    <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                      Project
                    </label>
                    <p className="text-[#3c3e41]">
                      {selectedReview.project || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                  <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                    Date
                  </label>
                  <p className="text-[#3c3e41]">
                    {formatDate(
                      selectedReview.created_at || selectedReview.date
                    )}
                  </p>
                </div>

                {/* Review Text */}
                <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                  <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                    Review
                  </label>
                  <div className="text-[#3c3e41] leading-relaxed relative">
                    <FaQuoteLeft className="w-6 h-6 text-[#FF004F]/20 absolute -top-2 -left-2" />
                    <p className="pl-4">{selectedReview.review_text}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed action bar */}
            <div className="p-6 border-t border-[#d1d9e6] flex flex-col gap-3 md:flex-row">
              <button
                onClick={() => handleDelete(selectedReview.id)}
                className="flex-1 bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                Delete Review
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 bg-[#ECF0F3] text-[#3c3e41] px-6 py-3 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
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
                Are you sure you want to delete this review? This action cannot
                be undone.
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
    </motion.div>
  );
};

export default ReviewsManagement;
