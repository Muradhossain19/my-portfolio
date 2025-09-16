"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaExternalLinkAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  // FaDollarSign,
  FaUser,
  FaCog,
} from "react-icons/fa";
import portfolioData from "./PortfolioData";

// Categories for filtering
const categories = ["All", "Web Development", "WordPress", "E-commerce"];

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

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

const PortfolioSection = () => {
  const headingText = "My Portfolio";
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredItems, setFilteredItems] = useState(portfolioData);
  const [loves, setLoves] = useState<{ [key: number]: number }>({});
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredItems(portfolioData);
    } else {
      const newItems = portfolioData.filter(
        (item) => item.category === activeFilter
      );
      setFilteredItems(newItems);
    }
    setCurrentPage(1); // Reset to first page on filter change
  }, [activeFilter]);

  // Fetch loves from backend on mount
  useEffect(() => {
    async function fetchLoves() {
      try {
        const res = await fetch("/api/portfolio-loves");
        const data: Array<{ portfolio_id: number; loves_count: number }> =
          await res.json();
        const lovesObj: { [key: number]: number } = {};
        portfolioData.forEach((item) => {
          const found = data.find(
            (d: { portfolio_id: number; loves_count: number }) =>
              d.portfolio_id === item.id
          );
          lovesObj[item.id] = found ? found.loves_count : item.likes;
        });
        setLoves(lovesObj);
      } catch {
        // fallback to initial likes if API fails
        const initialLoves: { [key: number]: number } = {};
        portfolioData.forEach((item) => {
          initialLoves[item.id] = item.likes;
        });
        setLoves(initialLoves);
      }
    }
    fetchLoves();
  }, []);

  // Update love count in backend and refetch
  const handleLove = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch("/api/portfolio-loves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio_id: id }),
      });
      // Refetch loves after update
      const res = await fetch("/api/portfolio-loves");
      const data: Array<{ portfolio_id: number; loves_count: number }> =
        await res.json();
      const lovesObj: { [key: number]: number } = {};
      portfolioData.forEach((item) => {
        const found = data.find(
          (d: { portfolio_id: number; loves_count: number }) =>
            d.portfolio_id === item.id
        );
        lovesObj[item.id] = found ? found.loves_count : item.likes;
      });
      setLoves(lovesObj);
    } catch {
      // fallback: increment locally
      setLoves((prev) => ({
        ...prev,
        [id]: prev[id] + 1,
      }));
    }
  };

  interface PortfolioItem {
    id: number;
    images: string[];
    category: string;
    title: string;
    description: string;
    longDescription: string;
    client: string;
    date: string;
    services: string;
    budget: string;
    likes: number;
    link: string;
    features: string[];
  }

  const openModal = (project: PortfolioItem) => {
    // First save scroll position
    if (typeof window !== "undefined") {
      const scrollY = window.scrollY;
      setScrollPosition(scrollY);

      // Small delay to ensure state is updated
      setTimeout(() => {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${scrollY}px`;
      }, 0);
    }

    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = useCallback(() => {
    if (typeof window !== "undefined") {
      // Get the saved scroll position
      const scrollY = scrollPosition;

      // Reset body styles first
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";

      // Restore scroll position instantly without smooth animation
      window.scrollTo({ top: scrollY, behavior: "instant" });
    }

    setSelectedProject(null);
  }, [scrollPosition]);

  const scrollToContactAndClose = () => {
    closeModal();
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100); // modal close animation wait
  };

  // Image navigation functions যোগ করুন
  const prevImage = () => {
    setCurrentImageIndex((prev) => Math.max(0, prev - 1));
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        Math.min(selectedProject.images.length - 1, prev + 1)
      );
    }
  };

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
      }
    };
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (selectedProject) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (selectedProject && typeof window !== "undefined") {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
      }
    };
  }, [selectedProject, closeModal]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section
      id="portfolio"
      className="bg-[#ECF0F3] py-10 md:py-16 overflow-x-hidden"
    >
      <div className="container mx-auto px-4">
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

        {/* Filter Tabs */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeFilter === category
                  ? "text-white bg-[#FF004F] shadow-lg"
                  : "text-[#3c3e41] bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] active:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {currentItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="group bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden cursor-pointer"
                onClick={() => openModal(item)}
              >
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    width={600}
                    height={1000}
                    loading="lazy"
                    className="w-full h-auto object-cover absolute top-0 left-0 transition-transform duration-[4000ms] ease-in-out group-hover:-translate-y-[calc(100%-16rem)]"
                  />
                  <Link
                    href={item.link}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                  >
                    <FaExternalLinkAlt />
                  </Link>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-[#FF004F] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => handleLove(item.id, e)}
                      className="flex items-center gap-1.5 text-sm text-[#3c3e41] cursor-pointer focus:outline-none"
                      aria-label="Love"
                      type="button"
                    >
                      <FaHeart className="transition-colors duration-200 hover:text-[#FF004F]" />
                      <span>{loves[item.id]}</span>
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-[#1f2125] leading-snug group-hover:text-[#FF004F] transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeModal}
            >
              <motion.div
                className="bg-[#ECF0F3] rounded-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden"
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6]">
                  <span className="text-xs font-medium text-[#FF004F] uppercase tracking-wider">
                    {selectedProject.category}
                  </span>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#FF004F] hover:text-[#e6003d] transition-colors duration-300"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[calc(80vh-100px)] overflow-y-auto">
                  {/* Left: Image Slider */}
                  <div className="relative bg-[#ECF0F3] p-6">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                      <Image
                        src={selectedProject.images[currentImageIndex]}
                        alt={selectedProject.title}
                        width={600}
                        height={1000}
                        className="w-full h-auto object-cover absolute top-0 left-0 transition-transform duration-[4000ms] ease-in-out group-hover:-translate-y-[60%]"
                      />

                      {/* Image Navigation */}
                      {selectedProject.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            disabled={currentImageIndex === 0}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={nextImage}
                            disabled={
                              currentImageIndex ===
                              selectedProject.images.length - 1
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          >
                            <FaChevronRight />
                          </button>
                        </>
                      )}

                      {/* Image Indicators */}
                      {selectedProject.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {selectedProject.images.map(
                            (_: string, index: number) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                  index === currentImageIndex
                                    ? "bg-[#FF004F]"
                                    : "bg-[#FF004F]/50"
                                }`}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Project Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1f2125] mb-2">
                        {selectedProject.title}
                      </h2>
                      <p className="text-[#3c3e41] leading-relaxed text-sm">
                        {selectedProject.longDescription}
                      </p>
                    </div>

                    {/* Project Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <div className="flex items-center gap-2 text-[#FF004F] mb-1">
                          <FaUser className="w-3 h-3" />
                          <span className="text-xs font-medium">Client</span>
                        </div>
                        <p className="text-[#1f2125] font-semibold text-sm">
                          {selectedProject.client}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <div className="flex items-center gap-2 text-[#FF004F] mb-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span className="text-xs font-medium">Date</span>
                        </div>
                        <p className="text-[#1f2125] font-semibold text-sm">
                          {selectedProject.date}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <div className="flex items-center gap-2 text-[#FF004F] mb-1">
                          <FaCog className="w-3 h-3" />
                          <span className="text-xs font-medium">Services</span>
                        </div>
                        <p className="text-[#1f2125] font-semibold text-sm">
                          {selectedProject.services}
                        </p>
                      </div>

                      {/* <div className="p-3 rounded-xl bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <div className="flex items-center gap-2 text-[#FF004F] mb-1">
                          <FaDollarSign className="w-3 h-3" />
                          <span className="text-xs font-medium">Budget</span>
                        </div>
                        <p className="text-[#1f2125] font-semibold text-sm">
                          {selectedProject.budget}
                        </p>
                      </div> */}
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-lg font-bold text-[#1f2125] mb-2">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedProject.features.map(
                          (feature: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-2 rounded-lg bg-[#ECF0F3] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]"
                            >
                              <div className="w-2 h-2 rounded-full bg-[#FF004F]"></div>
                              <span className="text-[#3c3e41] text-sm">
                                {feature}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Modal Action Buttons */}
                    <div className="flex gap-4 pt-2">
                      <button
                        className="flex-1 bg-[#FF004F] text-white py-2.5 px-6 rounded-lg font-semibold text-center hover:bg-[#e6003d] transition-colors duration-300 text-sm shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]"
                        onClick={scrollToContactAndClose}
                        aria-label="Hire Me"
                      >
                        HIRE ME
                      </button>
                      <button
                        onClick={(e) => handleLove(selectedProject.id, e)}
                        className="px-4 py-2.5 rounded-lg bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center gap-2 text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300"
                        aria-label="Love"
                      >
                        <FaHeart />
                        <span>{loves[selectedProject.id]}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PortfolioSection;
