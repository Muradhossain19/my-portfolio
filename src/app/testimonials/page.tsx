"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaStar,
  FaQuoteLeft,
  FaCalendarAlt,
  FaClipboardList,
  FaArrowLeft,
  FaArrowRight,
  FaFilter,
  FaTimes,
  FaChevronDown, // Add this import
} from "react-icons/fa";
import CountUp from "react-countup";
import PageHeader from "../../components/PageHeader/PageHeader";

type Review = {
  id: number;
  name: string;
  position: string;
  company: string;
  project: string;
  image: string;
  date: string;
  rating: number;
  testimonial: string;
};

const TestimonialsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const reviewsPerPage = 30;

  // Breadcrumbs data
  const breadcrumbs = [{ label: "Testimonials", href: "/testimonials" }];

  // Fetch reviews from API
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();

        // Map API data to Review format
        type ApiReview = {
          id: number;
          reviewer_name: string;
          reviewer_title: string;
          company?: string;
          project?: string;
          image?: string;
          date?: string;
          rating: number;
          review_text: string;
        };

        const mapped = data.map((item: ApiReview) => ({
          id: item.id,
          name: item.reviewer_name,
          position: item.reviewer_title,
          company: item.company || "",
          project: item.project || "",
          image: item.image || "/images/default-avater.svg",
          date: item.date || "Unknown Date",
          rating: item.rating,
          testimonial: item.review_text,
        }));

        // Helper function to parse different date formats
        const parseDate = (dateString: string): Date => {
          // Handle "September 2025" format
          if (/^[A-Za-z]+ \d{4}$/.test(dateString)) {
            return new Date(dateString + " 01"); // Add day 01 for parsing
          }

          // Handle "July 2025" etc.
          const monthYear = dateString.match(/^([A-Za-z]+) (\d{4})$/);
          if (monthYear) {
            const month = monthYear[1];
            const year = monthYear[2];
            return new Date(`${month} 1, ${year}`);
          }

          // Try standard date parsing
          const parsed = new Date(dateString);
          return isNaN(parsed.getTime()) ? new Date(0) : parsed;
        };

        // Sort by date (latest first) - parse date strings properly
        const sortedMapped = mapped.sort((a: Review, b: Review) => {
          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);

          return dateB.getTime() - dateA.getTime();
        });

        setReviews(sortedMapped);
        setFilteredReviews(sortedMapped);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // Filter reviews based on criteria
  useEffect(() => {
    let filtered = reviews;

    // Filter by rating
    if (selectedRating) {
      filtered = filtered.filter((review) => review.rating === selectedRating);
    }

    // Filter by service/project
    if (selectedService) {
      filtered = filtered.filter((review) =>
        review.project.toLowerCase().includes(selectedService.toLowerCase())
      );
    }

    // Filter by search term (name, company, or testimonial)
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.testimonial.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReviews(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [selectedRating, selectedService, searchTerm, reviews]);

  // Get unique services for filter dropdown
  const uniqueServices = Array.from(
    new Set(reviews.map((review) => review.project).filter(Boolean))
  );

  // Clear all filters
  const clearFilters = () => {
    setSelectedRating(null);
    setSelectedService("");
    setSearchTerm("");
  };

  // Check if any filters are active
  const hasActiveFilters = selectedRating || selectedService || searchTerm;

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-[#FF004F]" : "text-gray-300"
        }`}
      />
    ));
  };

  // Add Skeleton Component
  const TestimonialSkeleton = () => (
    <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] animate-pulse">
      {/* Quote Icon Skeleton */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gray-300 rounded-full"></div>

      {/* Client Image & Info Skeleton */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>

      {/* Rating Skeleton */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
        ))}
      </div>

      {/* Testimonial Text Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>

      {/* Project & Date Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-[#d1d9e6]">
        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-[#ECF0F3] min-h-screen">
        <PageHeader
          title="Client Testimonials"
          subtitle="What our clients say about their experience working with us"
          breadcrumbs={breadcrumbs}
        />
        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Stats Section Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] animate-pulse"
                >
                  <div className="h-8 bg-gray-300 rounded mb-2 mx-auto w-16"></div>
                  <div className="h-4 bg-gray-300 rounded mx-auto w-24"></div>
                </div>
              ))}
            </div>

            {/* Search and Filter Skeleton */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <div className="h-12 bg-gray-300 rounded-xl animate-pulse"></div>
                </div>
                <div className="h-12 w-32 bg-gray-300 rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Results Info Skeleton */}
            <div className="mb-8">
              <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
            </div>

            {/* Reviews Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="relative">
                  <TestimonialSkeleton />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#ECF0F3] min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Client Testimonials"
        subtitle="What our clients say about their experience working with us"
        breadcrumbs={breadcrumbs}
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <motion.div
              className="text-center p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-[#FF004F] mb-2">
                <CountUp end={reviews.length} duration={1.5} />+
              </div>
              <div className="text-[#3c3e41] font-medium">Happy Clients</div>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-[#FF004F] mb-2">
                <CountUp end={reviews.length} duration={1.5} />+
              </div>
              <div className="text-[#3c3e41] font-medium">
                Projects Completed
              </div>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-[#FF004F] mb-2 flex flex-row items-center justify-center gap-2">
                <CountUp
                  end={
                    reviews.length > 0
                      ? Number(
                          (
                            reviews.reduce((sum, r) => sum + r.rating, 0) /
                            reviews.length
                          ).toFixed(1)
                        )
                      : 0
                  }
                  decimals={1}
                  duration={1.5}
                />
                <FaStar />
              </div>
              <div className="text-[#3c3e41] font-medium">Average Rating</div>
            </motion.div>

            <motion.div
              className="text-center p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-[#FF004F] mb-2">
                <CountUp end={3} duration={1.5} />+
              </div>
              <div className="text-[#3c3e41] font-medium">Years Experience</div>
            </motion.div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, company, or review..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] transition-all duration-300"
                  />
                </div>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  hasActiveFilters
                    ? "bg-[#FF004F] text-white shadow-lg"
                    : "bg-[#ECF0F3] text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F]"
                }`}
              >
                <FaFilter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-white text-[#FF004F] text-xs px-2 py-1 rounded-full font-bold">
                    {
                      [selectedRating, selectedService, searchTerm].filter(
                        Boolean
                      ).length
                    }
                  </span>
                )}
              </button>
            </div>

            {/* Filter Options */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showFilters
                  ? "max-h-96 opacity-100 mb-6"
                  : "max-h-0 opacity-0 mb-0"
              }`}
            >
              <div className="bg-[#ECF0F3] rounded-xl p-6 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Rating Filter */}
                  <div>
                    <label className="block text-[#1f2125] font-semibold mb-3">
                      Filter by Rating
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() =>
                            setSelectedRating(
                              selectedRating === rating ? null : rating
                            )
                          }
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                            selectedRating === rating
                              ? "bg-[#FF004F] text-white shadow-lg"
                              : "bg-[#ECF0F3] text-[#3c3e41] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:text-[#FF004F]"
                          }`}
                        >
                          <FaStar className="w-3 h-3" />
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Filter */}
                  <div>
                    <label className="block text-[#1f2125] font-semibold mb-3">
                      Filter by Service
                    </label>
                    <div className="relative">
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-4 py-3 pr-10 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] text-[#1f2125] appearance-none cursor-pointer"
                      >
                        <option value="">All Services</option>
                        {uniqueServices.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4 pointer-events-none" />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-3 bg-[#ECF0F3] text-[#FF004F] rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:bg-[#FF004F] hover:text-white transition-all duration-300 font-medium"
                      >
                        <FaTimes className="w-4 h-4" />
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-8">
            <p className="text-[#3c3e41] font-light">
              Showing {currentReviews.length} of {filteredReviews.length}{" "}
              testimonials
              {hasActiveFilters && ` (filtered from ${reviews.length} total)`}
            </p>
          </div>

          {/* Reviews Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            <AnimatePresence>
              {currentReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] transition-all duration-300 relative group"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-[#FF004F] rounded-full flex items-center justify-center">
                    <FaQuoteLeft className="text-white w-3 h-3" />
                  </div>

                  {/* Client Image & Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] p-1 bg-[#FF004F]">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <Image
                            src={review.image}
                            alt={review.name}
                            width={60}
                            height={60}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#1f2125] mb-1">
                        {review.name}
                      </h3>
                      <p className="text-sm text-[#FF004F] font-medium mb-1">
                        {review.position}
                      </p>
                      <p className="text-xs text-[#3c3e41]">{review.company}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {renderStars(review.rating)}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-sm text-[#1f2125] leading-relaxed mb-4 font-light line-clamp-4">
                    &ldquo;{review.testimonial}&rdquo;
                  </blockquote>

                  {/* Project & Date */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#d1d9e6]">
                    <div className="flex items-center gap-2">
                      <FaClipboardList className="w-3 h-3 text-[#3c3e41]" />
                      <span className="text-xs text-[#3c3e41] font-medium">
                        {review.project}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-3 h-3 text-[#3c3e41]" />
                      <span className="text-xs text-[#3c3e41]">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#ECF0F3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff]">
                <FaQuoteLeft className="w-8 h-8 text-[#3c3e41]" />
              </div>
              <h3 className="text-xl font-bold text-[#1f2125] mb-2">
                {hasActiveFilters
                  ? "No matching testimonials found"
                  : "No testimonials found"}
              </h3>
              <p className="text-[#3c3e41] mb-6">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : "Be the first to share your experience with us!"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#FF004F] text-white rounded-xl hover:bg-[#e6003d] transition-colors duration-300 font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#3c3e41] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#FF004F] transition-colors duration-300"
              >
                <FaArrowLeft className="w-3 h-3" />
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#3c3e41] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#FF004F] transition-colors duration-300"
              >
                Next
                <FaArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;
