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
  FaDollarSign,
  FaUser,
  FaCog,
} from "react-icons/fa";

// Portfolio Data with multiple images
const portfolioData = [
  {
    id: 1,
    images: ["/images/portfolio/akhand-ekonomi.png"],
    category: "Web Development",
    title: "Akhand Ekonomi - Your Financial Partner",
    description:
      "A professional and user-friendly website developed to offer comprehensive accounting and financial consulting services.",
    longDescription:
      "Developed a clean, professional, and responsive website for Akhand Ekonomi, a financial services firm. The platform is designed to build client trust and clearly present their core services, including accounting, financial statements, and tax consulting. The primary goal was to create an intuitive and informative online presence that allows potential clients to easily understand their offerings and get in touch.",
    client: "Akhand",
    date: "20 July 2025",
    services: "Web Development",
    budget: "$****",
    likes: 1,
    link: "https://akhandekonomi.se",
    features: [
      "Clear service presentation (Accounting, Consulting )",
      "Easy-to-use contact and inquiry forms",
      "Fully mobile-responsive design for all devices",
      "SEO-optimized structure for better visibility",
    ],
  },
  {
    id: 2,
    images: ["/images/portfolio/schemafai.png"],
    category: "Web Development",
    title: "Schemafai - A Scheduling Platform",
    description:
      "Developed a dynamic and intuitive staff scheduling platform to simplify workforce management and streamline operations.",
    longDescription:
      "A complete corporate website solution featuring modern design principles, seamless user experience, and robust backend functionality.",
    client: "Tizfai Technologies AB",
    date: "2 May 2025",
    services: "Web Development",
    budget: "$****",
    likes: 1,
    link: "https://schemafai.se",
    features: [
      "Responsive design",
      "SEO optimized",
      "Fast loading speed",
      "Developed a secure user authentication system for staff",
    ],
  },

  {
    id: 3,
    images: ["/images/portfolio/MavinAds.png"],
    category: "WordPress",
    title: "MavinAds - Leading Digital Marketing Agency",
    description:
      "Developed a professional and high-performance WordPress website to showcase their digital marketing services and attract new clients.",
    longDescription:
      "For MavinAds, a leading digital marketing agency, I built a fully customized WordPress website from the ground up. The project focused on creating a clean, corporate design that highlights their expertise in SEO, social media, and content marketing. Key objectives included ensuring fast load times, a seamless user experience, and implementing clear calls-to-action to boost lead generation.",
    client: "Murad Hossain",
    date: "10 July 2024",
    services: "WordPress Solutions",
    budget: "$****",
    likes: 1,
    link: "mavinads.com",
    features: [
      "Custom design to reflect the agency's brand identity",
      "Service pages optimized for search engines (SEO )",
      "Integrated contact forms and clear calls-to-action",
      "Fully responsive and mobile-friendly layout",
    ],
  },
  {
    id: 4,
    images: ["/images/portfolio/Route-Runner-Brokerage-Update.png"],
    category: "WordPress",
    title: "Route Runner Brokerage - Your Logistics Partner",
    description:
      "A professional WordPress website designed for a logistics brokerage, focusing on service clarity and lead generation.",
    longDescription:
      "For Route Runner Brokerage, I developed a robust and professional WordPress website to establish their online presence in the logistics industry. The site was built to clearly communicate their core services, such as freight brokerage and carrier management. Key features include a streamlined quote request system, detailed service pages, and a design that builds trust and credibility with both shippers and carriers.",
    client: "Route Runner Brokerage LLC",
    date: "25 June 2025",
    services: "WordPress Development",
    budget: "$****",
    likes: 1,
    link: "https://routerunnersbrokerage.com/",
    features: [
      "Integrated freight quote request form",
      "Dedicated pages for shipper and carrier services",
      "Clean, professional design to build industry trust",
      "Fully responsive layout for access on any device",
    ],
  },
  {
    id: 5,
    images: ["/images/portfolio/colorley-ecommerce.png"],
    category: "E-commerce",
    title: "Colorley - E-commerce Store",
    description:
      "A vibrant and user-friendly e-commerce store built on WooCommerce, designed to provide a seamless online shopping experience.",
    longDescription:
      "I developed the Colorley e-commerce store, a complete online shopping platform using WordPress and WooCommerce. The project involved creating a visually appealing design to showcase products effectively, integrating secure payment gateways, and setting up an intuitive product management system. The primary focus was on optimizing the user journey from browsing to checkout, ensuring a smooth and enjoyable experience for customers.",
    client: "Colorley Ltd",
    date: "5 February 2025",
    services: "E-commerce Solutions",
    budget: "$****+",
    likes: 1,
    link: "#",
    features: [
      "Full-featured product catalog with filtering options",
      "Secure payment gateway integration (e.g., Stripe, PayPal)",
      "Streamlined and user-friendly checkout process",
      "Mobile-responsive design for shopping on any device",
    ],
  },
  {
    id: 6,
    images: ["/images/portfolio/nosy-be-landing-page.png"],
    category: "WordPress",
    title: "Nosy Be - Real Estate Landing Page",
    description:
      "A high-converting WordPress landing page designed to capture leads for a premier real estate service or property.",
    longDescription:
      "This project involved creating a sophisticated and persuasive landing page for 'Nosy Be,' a real estate service. The primary goal was to showcase a property or service with stunning visuals and compelling details to attract potential buyers or investors. The page was strategically designed with clear calls-to-action, an inquiry form, and key property highlights to maximize lead generation. It is fully responsive and optimized for fast loading to provide a premium user experience.",
    client: "Nosy Be Real Estate",
    date: "18 December 2024",
    services: "WordPress Solutions",
    budget: "$****",
    likes: 1,
    link: "#",
    features: [
      "Showcased high-resolution property photo gallery",
      "Prominent lead capture and contact forms",
      "Detailed property features and amenities section",
      "Clean, modern design optimized for conversions",
    ],
  },
  {
    id: 7,
    images: ["/images/portfolio/Analysify.png"],
    category: "WordPress",
    title: "Analysify - Personal Portfolio Website",
    description:
      "A sleek and modern personal portfolio website designed to showcase projects, skills, and professional experience effectively.",
    longDescription:
      "I developed 'Analysify,' a custom personal portfolio website, to create a strong online presence for a creative professional. The project focused on a clean, minimalist design that puts the portfolio pieces front and center. It features dedicated sections for an 'About Me' bio, a dynamic project gallery, and a clear contact form. The site is built to be fully responsive, ensuring a perfect viewing experience on any device, from desktops to smartphones.",
    client: "Murad Hossain",
    date: "12 July 2024",
    services: "WordPress Solutions",
    budget: "$****",
    likes: 1,
    link: "Analysify.com",
    features: [
      "Dynamic and filterable project gallery",
      "Clean, minimalist user interface (UI) design",
      "Integrated 'About Me' and 'Skills' sections",
      "Responsive layout for seamless mobile and desktop viewing",
    ],
  },
  {
    id: 8,
    images: ["/images/portfolio/aurabysr-ecommerce.jpg"],
    category: "E-commerce",
    title: "Aurabysr - E-commerce Website",
    description:
      "A modern and responsive e-commerce website built on WordPress, designed to showcase products and drive sales.",
    longDescription:
      "I developed 'Aurabysr,' a custom e-commerce website, to create a strong online presence for a retail brand. The project focused on a clean, minimalist design that puts the products front and center. It features dedicated sections for product categories, a dynamic product gallery, and a clear contact form. The site is built to be fully responsive, ensuring a perfect viewing experience on any device, from desktops to smartphones.",
    client: "Aurabysr",
    date: "10 May 2024",
    services: "E-commerce Solutions",
    budget: "$****",
    likes: 1,
    link: "#",
    features: [
      "Dynamic and filterable product gallery",
      "Clean, minimalist user interface (UI) design",
      "Integrated product categories and filters",
      "Responsive layout for seamless mobile and desktop viewing",
    ],
  },
  {
    id: 9,
    images: ["/images/portfolio/lakeside-roofing.png"],
    category: "WordPress",
    title: "Lakeside Roofing - Roofing Services Website",
    description:
      "A modern and responsive roofing services website built on WordPress, designed to showcase services and drive leads.",
    longDescription:
      "I developed 'Lakeside Roofing,' a custom roofing services website, to create a strong online presence for a local contractor. The project focused on a clean, minimalist design that puts the services front and center. It features dedicated sections for service categories, a dynamic service gallery, and a clear contact form. The site is built to be fully responsive, ensuring a perfect viewing experience on any device, from desktops to smartphones.",
    client: "Lakeside Roofing",
    date: "5 March 2024",
    services: "WordPress Solutions",
    budget: "$****",
    likes: 1,
    link: "lakeside-roofing.com",
    features: [
      "Prominent 'Request a Free Quote' call-to-action",
      "Detailed service pages (e.g., Roof Repair, Installation)",
      "Project gallery to showcase completed roofing work",
      "Customer testimonials section to build trust and credibility",
    ],
  },
  {
    id: 10,
    images: ["/images/portfolio/Serpixi.png"],
    category: "WordPress",
    title: "Serpixi - Digital Marketing Agency",
    description:
      "A modern and responsive digital marketing agency website built on WordPress, designed to showcase services and drive leads.",
    longDescription:
      "I developed 'Serpixi,' a custom digital marketing agency website, to create a strong online presence for a marketing firm. The project focused on a clean, minimalist design that puts the services front and center. It features dedicated sections for service categories, a dynamic service gallery, and a clear contact form. The site is built to be fully responsive, ensuring a perfect viewing experience on any device, from desktops to smartphones.",
    client: "Serpixi Marketing Co. Ltd",
    date: "21 October 2024",
    services: "WordPress Solutions",
    budget: "$****",
    likes: 1,
    link: "#",
    features: [
      "Clear presentation of core services (SEO, PPC, SMM)",
      "Case studies section to demonstrate proven results",
      "Integrated blog for content marketing and industry insights",
      "Strategic calls-to-action for consultation requests",
    ],
  },
  {
    id: 11,
    images: ["/images/portfolio/tizfai.png"],
    category: "WordPress",
    title: "Tizfai - Your IT Solutions Partner",
    description:
      "A professional and secure WordPress website for an IT solutions provider, designed to showcase services and build client trust.",
    longDescription:
      "I developed the website for 'Tizfai,' an IT solutions partner, to establish a credible and professional online presence. The project focused on clearly structuring their complex services, such as managed IT, cybersecurity, and cloud solutions. The site is designed to be highly informative and trustworthy, featuring detailed service pages, client testimonials, and a streamlined process for requesting a consultation or support.",
    client: "Tizfai Technologies AB",
    date: "28 January 2024",
    services: "WordPress Solutions",
    budget: "$****",
    likes: 1,
    link: "#",
    features: [
      "Detailed breakdown of IT services (e.g., Cybersecurity, Cloud Solutions)",
      "Integrated support ticket or consultation request form",
      "Client testimonials section to build credibility",
      "Secure, professional design reflecting industry standards",
    ],
  },
  {
    id: 12,
    images: ["/images/portfolio/medfai.png"],
    category: "WordPress",
    title: "Medfai - Healthcare App Landing Page",
    description:
      "A clean and trustworthy landing page for the Medfai app, designed to drive downloads and clearly explain its features.",
    longDescription:
      "I created a dedicated landing page for 'Medfai,' a healthcare IT app, using WordPress. The primary objective was to build trust and encourage user downloads. The design is clean, professional, and focuses on the app's core benefits, such as appointment scheduling and secure patient data management. The page includes clear calls-to-action, app store download buttons, and a section explaining how the app works, ensuring a seamless user journey from discovery to download.",
    client: "Tizfai Technologies AB",
    date: "14 December 2023",
    services: "WordPress Solutions",
    budget: "$****",
    likes: 1,
    link: "#",
    features: [
      "Prominent App Store and Google Play download buttons",
      "Clear explanation of the app's key features and benefits",
      "A 'How It Works' section with visual guides",
      "Trust-building elements like security badges and testimonials",
    ],
  },
  {
    id: 13,
    images: ["/images/portfolio/techguidecenter.png"],
    category: "WordPress",
    title: "TechGuideCenter - Your Tech Resource Hub",
    description:
      "A content-rich affiliate blog website built on WordPress, designed for optimal user engagement and maximizing affiliate revenue.",
    longDescription:
      "I developed 'TechGuideCenter,' a comprehensive tech affiliate blog, to serve as a go-to resource for tech enthusiasts. The project focused on creating a user-friendly layout that prioritizes content readability and navigation. Key aspects included implementing a robust category and tag system for easy content discovery, optimizing page speed for better user experience and SEO, and strategically placing affiliate links and calls-to-action to drive conversions.",
    client: "Murad Hossain",
    date: "4 November 2023",
    services: "WordPress Solutions",
    budget: "$****",
    likes: 1,
    link: "#",
    features: [
      "Advanced blog layout with categories and search functionality",
      "SEO-optimized structure for high search engine ranking",
      "Strategically integrated affiliate links and ad spaces",
      "Fast-loading and mobile-responsive design for readers",
    ],
  },
];

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
        const data: Array<{ portfolio_id: number; loves: number }> =
          await res.json();
        // data: [{ portfolio_id: 1, loves: 5 }, ...]
        const lovesObj: { [key: number]: number } = {};
        portfolioData.forEach((item) => {
          const found = data.find((d) => d.portfolio_id === item.id);
          lovesObj[item.id] = found ? found.loves : item.likes;
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
      const data = await res.json();
      const lovesObj: { [key: number]: number } = {};
      portfolioData.forEach((item) => {
        const found = data.find((d: any) => d.portfolio_id === item.id);
        lovesObj[item.id] = found ? found.loves : item.likes;
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

                      <div className="p-3 rounded-xl bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <div className="flex items-center gap-2 text-[#FF004F] mb-1">
                          <FaDollarSign className="w-3 h-3" />
                          <span className="text-xs font-medium">Budget</span>
                        </div>
                        <p className="text-[#1f2125] font-semibold text-sm">
                          {selectedProject.budget}
                        </p>
                      </div>
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

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                      <button className="flex-1 bg-[#FF004F] text-white py-2.5 px-6 rounded-lg font-semibold text-center hover:bg-[#e6003d] transition-colors duration-300 text-sm">
                        HIRE ME
                      </button>
                      <button
                        onClick={(e) => handleLove(selectedProject.id, e)}
                        className="px-4 py-2.5 rounded-lg bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center gap-2 text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300"
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
