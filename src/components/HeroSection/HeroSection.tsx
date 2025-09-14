// File: src/components/HeroSection.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// যে টেক্সটগুলো দেখানো হবে
const typingTexts = ["Web Developer.", "WordPress Designer."];

const HeroSection = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % typingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767); // Tailwind sm breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const textContainer = {
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const textCharacter = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  return (
    // ৩. ট্যাবলেট ডিভাইসের জন্য প্যাডিং যোগ করা হলো
    <section
      id="home"
      className="bg-[#ECF0F3] min-h-[calc(100vh-80px)] flex items-center py-16 sm:py-20 md:pt-28 md:pb-20 lg:py-0"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* টেক্সট কন্টেন্ট */}
          <div className="lg:col-span-7 space-y-4 md:space-y-6 text-center lg:text-left">
            <div className="mb-4">
              <motion.span
                className="uppercase tracking-[0.25em] font-normal text-sm text-[#3c3e41]"
                style={{ fontWeight: 400 }}
                variants={itemVariants}
              >
                Welcome to my world
              </motion.span>
            </div>

            {/* ১. শুধুমাত্র মোবাইলের জন্য ফন্ট সাইজ আরও কমানো হলো */}
            <motion.h1
              className="text-3xl sm:text-5xl lg:text-[60px] font-bold text-[#1f2125] leading-tight mb-2"
              variants={itemVariants}
            >
              Hi, I’m <span className="text-[#FF004F]">Murad H.</span>
            </motion.h1>

            <motion.div
              className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 pb-4"
              variants={itemVariants}
            >
              <span className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#FF004F]">
                a
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={textIndex}
                  variants={textContainer}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                  className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1f2125] flex"
                  aria-live="polite"
                >
                  {typingTexts[textIndex].split("").map((char, index) => (
                    <motion.span
                      key={`${char}-${index}`}
                      variants={textCharacter}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.p
              className="text-base sm:text-lg text-[#3c3e41] max-w-xl mx-auto lg:mx-0"
              style={{ fontWeight: 400 }}
              variants={itemVariants}
            >
              I build modern, responsive web applications with a strong focus on
              user experience. Let&#39;s create a fast, beautiful, and
              SEO-friendly website to help your business grow online.
            </motion.p>

            <motion.div className="pt-4" variants={itemVariants}>
              <div className="sm:hidden flex justify-between items-end">
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-widest text-[#3c3e41] mb-3">
                    Find With Me
                  </h2>
                  <div className="flex space-x-3">
                    <a
                      href="https://www.facebook.com/murad.hossain.685"
                      aria-label="Facebook profile"
                      className="w-11 h-11 rounded-md bg-[#ECF0F3] flex items-center justify-center text-lg text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="https://x.com/MuradHo93458407"
                      aria-label="Twitter profile"
                      className="w-11 h-11 rounded-md bg-[#ECF0F3] flex items-center justify-center text-lg text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/wordpress-developer-murad/"
                      aria-label="LinkedIn profile"
                      className="w-11 h-11 rounded-md bg-[#ECF0F3] flex items-center justify-center text-lg text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                    >
                      <FaLinkedinIn />
                    </a>
                  </div>
                </div>
                {/* Hire Me বাটনটিকে একটি div এর মধ্যে রাখা হলো */}
                <div>
                  <button
                    className="w-28 h-11 text-sm font-semibold text-white bg-[#FF004F] rounded-md shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                    onClick={scrollToContact}
                  >
                    HIRE ME
                  </button>
                </div>
              </div>

              {/* ট্যাবলেট এবং ডেস্কটপের জন্য (sm ব্রেকপয়েন্টের উপরে) - এই অংশটি সম্পূর্ণ অপরিবর্তিত */}
              <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <div>
                  <h4 className="text-sm font-medium uppercase tracking-widest text-[#3c3e41] mb-3 text-center sm:text-left">
                    Find With Me
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/murad.hossain.685"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 cursor-pointer"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="https://x.com/MuradHo93458407"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 cursor-pointer"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/wordpress-developer-murad/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 cursor-pointer"
                    >
                      <FaLinkedinIn />
                    </a>
                  </div>
                </div>
                <div className="sm:ml-8 mt-4 sm:mt-0 self-end">
                  <button
                    className="w-32 h-12 text-base font-semibold text-[#FF004F] bg-[#ECF0F3] rounded-md shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 cursor-pointer"
                    onClick={scrollToContact}
                    type="button"
                  >
                    HIRE ME
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ডান কলাম: ছবি */}
          <motion.div
            className="lg:col-span-5 flex justify-center items-center row-start-1 lg:row-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] bg-[#ECF0F3] rounded-full shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff]">
              <Image
                src={
                  isMobile
                    ? "/images/mobile-hero.webp"
                    : "/images/hero-image.webp"
                }
                alt="Murad Hossain - Web Developer"
                fill
                sizes="(max-width: 600px) 90vw, (max-width: 1200px) 400px, 400px"
                style={{ objectFit: "cover" }}
                className="rounded-full p-3"
                priority
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
