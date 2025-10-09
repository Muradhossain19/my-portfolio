"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUser,
  FaThumbsUp,
  FaSearch,
  FaArrowRight,
  FaTag,
  FaExclamationTriangle,
  FaChevronDown,
  FaFilter,
  FaCheck, // <-- Add this import
} from "react-icons/fa";
import PageHeader from "../../components/PageHeader/PageHeader";

// Categories for filtering
const categories = ["All", "WordPress", "Web Development", "E-commerce"];

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
  featured?: boolean;
}

// Professional Skeleton Components
const BlogCardSkeleton = () => (
  <div className="bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden animate-pulse">
    {/* Image Skeleton */}
    <div className="h-48 bg-gray-300 rounded-t-2xl"></div>

    {/* Content Skeleton */}
    <div className="p-6">
      {/* Category & Date Skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>

      {/* Title Skeleton */}
      <div className="space-y-3 mb-3">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>

      {/* Excerpt Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>

      {/* Tags Skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </div>

      {/* Meta Info Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-[#d1d9e6]">
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-300 rounded w-12"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-8"></div>
      </div>
    </div>
  </div>
);

const SearchSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-6 mb-12">
    {/* Search Bar Skeleton */}
    <div className="flex-1">
      <div className="h-14 bg-gray-300 rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] animate-pulse"></div>
    </div>

    {/* Category Filter Skeleton */}
    <div className="w-48">
      <div className="h-14 bg-gray-300 rounded-2xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] animate-pulse"></div>
    </div>
  </div>
);

// Custom Dropdown Component
const CategoryDropdown = ({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: string;
  setActiveFilter: (category: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category: string) => {
    setActiveFilter(category);
    setIsOpen(false);
  };

  return (
    <div className="relative w-48">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[#ECF0F3] rounded-2xl border-none outline-none shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#1f2125] font-medium transition-all duration-300 hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]"
      >
        <div className="flex items-center gap-3">
          <FaFilter className="text-[#FF004F] w-4 h-4" />
          <span>{activeFilter}</span>
        </div>
        <FaChevronDown
          className={`w-4 h-4 text-[#3c3e41] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute top-full left-0 w-full mt-2 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden z-20 border border-[#d1d9e6]/30">
            <div className="py-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelect(category)}
                  className={`w-full text-left px-6 py-3 transition-all duration-200 flex items-center justify-between ${
                    activeFilter === category
                      ? "bg-[#FF004F] text-white shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.1)]"
                      : "text-[#3c3e41] hover:bg-[#d1d9e6] hover:text-[#FF004F] hover:shadow-[inset_2px_2px_4px_#c1c9d6,inset_-2px_-2px_4px_#ffffff]"
                  }`}
                >
                  {/* Category Text */}
                  <span className="font-medium">{category}</span>

                  {/* Check Icon for Active Category */}
                  {activeFilter === category && (
                    <FaCheck className="w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const BlogPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 6;

  // Breadcrumbs data
  const breadcrumbs = [{ label: "Blog", href: "/blog" }];

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

  // Fetch blog posts from database
  const fetchBlogPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/blog");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch blog posts");
      }

      if (!data.posts || data.posts.length === 0) {
        setBlogPosts([]);
        setError("No blog posts found");
        return;
      }

      // Transform database posts to component format and filter only published posts
      const transformedPosts = data.posts
        .filter((post: DatabaseBlogPost) => post.published)
        .map((post: DatabaseBlogPost) => transformDatabasePost(post));

      if (transformedPosts.length === 0) {
        setBlogPosts([]);
        setError("No published blog posts available");
        return;
      }

      setBlogPosts(transformedPosts);
      console.log("Blog posts loaded from database:", transformedPosts.length);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load blog posts"
      );
      setBlogPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [transformDatabasePost]);

  // Fetch blog posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  // Fetch likes from backend
  useEffect(() => {
    if (blogPosts.length === 0) return;

    const fetchLikes = async () => {
      try {
        const res = await fetch("/api/blog-likes");
        if (res.ok) {
          const data: Array<{ blog_id: number; likes_count: number }> =
            await res.json();
          const likesObj: { [key: number]: number } = {};
          blogPosts.forEach((post) => {
            const found = data.find((d) => d.blog_id === post.id);
            likesObj[post.id] = found ? found.likes_count : post.likes;
          });
          setLikes(likesObj);
        } else {
          // Use initial likes if API fails
          const initialLikes: { [key: number]: number } = {};
          blogPosts.forEach((post) => {
            initialLikes[post.id] = post.likes;
          });
          setLikes(initialLikes);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
        // Use initial likes if API fails
        const initialLikes: { [key: number]: number } = {};
        blogPosts.forEach((post) => {
          initialLikes[post.id] = post.likes;
        });
        setLikes(initialLikes);
      }
    };

    fetchLikes();
  }, [blogPosts]);

  // Filter posts based on category and search
  useEffect(() => {
    let posts = blogPosts;

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
  }, [activeFilter, searchTerm, blogPosts]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Loading state with professional skeleton
  if (isLoading) {
    return (
      <div className="bg-[#ECF0F3] min-h-screen">
        <PageHeader
          title="My Blog"
          subtitle="Insights, tutorials, and thoughts on web development, design, and technology"
          breadcrumbs={breadcrumbs}
        />
        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Search and Filter Skeleton */}
            <SearchSkeleton />

            {/* Results Info Skeleton */}
            <div className="mb-8">
              <div className="h-5 w-48 bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Blog Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(6)].map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <div className="h-10 w-20 bg-gray-300 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] animate-pulse"></div>
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-10 bg-gray-300 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] animate-pulse"
                ></div>
              ))}
              <div className="h-10 w-16 bg-gray-300 rounded-lg shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] animate-pulse"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#ECF0F3] min-h-screen">
        <PageHeader
          title="My Blog"
          subtitle="Insights, tutorials, and thoughts on web development, design, and technology"
          breadcrumbs={breadcrumbs}
        />
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#ECF0F3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff]">
                <FaExclamationTriangle className="w-8 h-8 text-[#FF004F]" />
              </div>
              <h3 className="text-xl font-bold text-[#1f2125] mb-2">
                Unable to Load Blog Posts
              </h3>
              <p className="text-[#3c3e41] mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={fetchBlogPosts}
                className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // No posts state
  if (blogPosts.length === 0) {
    return (
      <div className="bg-[#ECF0F3] min-h-screen">
        <PageHeader
          title="My Blog"
          subtitle="Insights, tutorials, and thoughts on web development, design, and technology"
          breadcrumbs={breadcrumbs}
        />
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#ECF0F3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff]">
                <FaSearch className="w-8 h-8 text-[#3c3e41]" />
              </div>
              <h3 className="text-xl font-bold text-[#1f2125] mb-2">
                No Blog Posts Available
              </h3>
              <p className="text-[#3c3e41] mb-6">
                There are no published blog posts at the moment. Please check
                back later.
              </p>
              <Link
                href="/"
                className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300"
              >
                Back to Home
              </Link>
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

            {/* Category Filter Dropdown */}
            <CategoryDropdown
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
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
              {activeFilter !== "All" && (
                <span className="font-medium text-[#FF004F]">
                  {" "}
                  in {activeFilter}
                </span>
              )}
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentPosts.map((post) => (
              <article
                key={post.id}
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
                        <div className="flex items-center gap-1 text-xs text-[#3c3e41]">
                          <FaThumbsUp className="w-3 h-3" />
                          <span>{likes[post.id] ?? post.likes}</span>
                        </div>
                        <FaArrowRight className="w-3 h-3 text-[#FF004F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* No Search Results */}
          {filteredPosts.length === 0 && !isLoading && !error && (
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
