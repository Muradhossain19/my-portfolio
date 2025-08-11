"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import ReviewModal from "../ReviewModal/ReviewModal";

type Review = {
  id?: number;
  name: string;
  position: string;
  company: string;
  project: string;
  image: string;
  date: string;
  rating: number;
  testimonial: string;
};

// Testimonial Data
const testimonialsData: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "CEO at TechFlow",
    company: "TechFlow Solutions",
    image: "/images/hero-image.webp",
    rating: 5,
    testimonial:
      "Working with this team was an absolute pleasure. They delivered beyond our expectations and the attention to detail was remarkable. The project was completed on time and within budget.",
    project: "E-commerce Platform",
    date: "March 2024",
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Product Manager",
    company: "Digital Innovations",
    image: "/images/hero-image.webp",
    rating: 5,
    testimonial:
      "Exceptional work quality and professional approach. The team understood our requirements perfectly and delivered a solution that exceeded our expectations. Highly recommended!",
    project: "Mobile App Development",
    date: "February 2024",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "Marketing Director",
    company: "Creative Agency",
    image: "/images/hero-image.webp",
    rating: 5,
    testimonial:
      "Outstanding creativity and technical expertise. The final product was exactly what we envisioned and more. The communication throughout the project was excellent.",
    project: "Brand Website Redesign",
    date: "January 2024",
  },
  {
    id: 4,
    name: "David Thompson",
    position: "Founder",
    company: "StartupHub",
    image: "/images/hero-image.webp",
    rating: 5,
    testimonial:
      "Professional, reliable, and incredibly talented. They transformed our vision into reality with impressive attention to detail and innovative solutions.",
    project: "SaaS Platform",
    date: "December 2023",
  },
  {
    id: 5,
    name: "Lisa Wang",
    position: "CTO",
    company: "DataCorp",
    image: "/images/hero-image.webp",
    rating: 5,
    testimonial:
      "Brilliant execution and seamless collaboration. The team's expertise in both design and development made our project a huge success. Will definitely work with them again.",
    project: "Analytics Dashboard",
    date: "November 2023",
  },
];

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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Simple CountUp component
const CountUp = ({
  end,
  duration = 2,
  suffix = "",
  shouldStart = false,
}: {
  end: number;
  duration?: number;
  suffix?: string;
  shouldStart?: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (shouldStart) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min(
          (currentTime - startTime) / (duration * 1000),
          1
        );

        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    } else {
      setCount(0);
    }
  }, [shouldStart, end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const TestimonialSection = () => {
  const headingText = "Client Testimonials";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [startCounting, setStartCounting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [testimonials, setTestimonials] = useState<Review[]>(testimonialsData);
  const [resetKey, setResetKey] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  // Fetch reviews from API
  useEffect(() => {
    async function fetchReviews() {
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

      const mapped = data.length
        ? data.map((item: ApiReview) => ({
            id: item.id,
            name: item.reviewer_name,
            position: item.reviewer_title,
            company: item.company || "",
            project: item.project || "",
            image: item.image || "/images/hero-image.webp",
            date: item.date || "",
            rating: item.rating,
            testimonial: item.review_text,
          }))
        : testimonialsData;
      setTestimonials(mapped);
    }
    fetchReviews();
  }, []);

  // Intersection Observer for counting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startCounting) {
            console.log("Stats section is visible, starting count...");
            setStartCounting(true);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const statsNode = statsRef.current;
    if (statsNode) {
      observer.observe(statsNode);
    }

    return () => {
      if (statsNode) {
        observer.unobserve(statsNode);
      }
    };
  }, [startCounting]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

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

  // Helper: convert image file to base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Add review and post to API
  const handleAddReview = async (
    review: Omit<Review, "id" | "image"> & { image: File | null }
  ) => {
    let imageUrl = "/images/hero-image.webp";
    if (review.image) {
      imageUrl = await fileToBase64(review.image);
    }
    const newReview: Review = {
      ...review,
      image: imageUrl,
      id: testimonials.length + 1,
    };
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });
    setTestimonials((prev) => [...prev, newReview]);
    setStartCounting(false);
  };

  const handleOpenReviewModal = () => {
    setResetKey((prev) => prev + 1); // Change key to force reset
    setShowReviewModal(true);
  };

  // For stats calculation:
  const happyClients: number = testimonials.length;
  const projectsCompleted: number = testimonials.length;
  const averageRating: number =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 0;

  return (
    <section
      id="testimonial"
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

        <motion.p
          className="text-center text-[#3c3e41] mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Hear what our clients say about their experience working with us
        </motion.p>

        {/* Main Testimonial Card */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-[#ECF0F3] rounded-3xl p-8 md:p-12 shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 w-12 h-12 bg-[#FF004F] rounded-full flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                <FaQuoteLeft className="text-white w-5 h-5" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Client Image */}
                <div className="flex justify-center lg:justify-start">
                  <div className="relative ml-8 lg:ml-12">
                    <div className="w-32 h-32 rounded-full overflow-hidden shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] p-2 bg-[#ECF0F3]">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Rating Badge */}
                    <div className="absolute -bottom-2 -right-2 lg:right-0 bg-[#ECF0F3] rounded-full p-3 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                      <div className="flex gap-1">
                        {renderStars(testimonials[currentIndex].rating)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="lg:col-span-2 text-center lg:text-left">
                  <blockquote className="text-lg md:text-xl text-[#1f2125] leading-relaxed mb-6 font-light md:font-medium">
                    &ldquo;{testimonials[currentIndex].testimonial}&rdquo;
                  </blockquote>

                  <div className="space-y-2">
                    <h4 className="text-xl text-[#1f2125] font-light md:font-bold">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-[#FF004F] font-light md:font-semibold">
                      {testimonials[currentIndex].position}
                    </p>
                    <p className="text-[#3c3e41] font-light md:font-normal">
                      {testimonials[currentIndex].company}
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                      <span className="text-sm text-[#3c3e41] bg-[#ECF0F3] px-3 py-1 rounded-full shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] font-light md:font-normal">
                        {testimonials[currentIndex].project}
                      </span>
                      <span className="text-sm text-[#3c3e41] font-light md:font-normal">
                        {testimonials[currentIndex].date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#ECF0F3] rounded-full shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300 active:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-5px_10px_#ffffff]"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#ECF0F3] rounded-full shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300 active:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-5px_10px_#ffffff]"
              >
                <FaChevronRight />
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#FF004F] shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff]"
                  : "bg-[#d1d9e6] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleOpenReviewModal}
            className="bg-[#FF004F] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] text-center cursor-pointer"
          >
            Write a Review
          </button>
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { number: happyClients, label: "Happy Clients", suffix: "+" },
            {
              number: projectsCompleted,
              label: "Projects Completed",
              suffix: "+",
            },
            {
              number: parseFloat(averageRating.toFixed(1)), // <-- Fix here
              label: "Average Rating",
              suffix: "★",
            },
            { number: 3, label: "Years Experience", suffix: "+" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-[#FF004F] mb-2">
                <CountUp
                  end={stat.number}
                  suffix={stat.suffix}
                  duration={2}
                  shouldStart={startCounting}
                />
              </div>
              <div className="text-[#3c3e41] font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <ReviewModal
          key={resetKey}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleAddReview}
        />
      </div>
    </section>
  );
};

export default TestimonialSection;
