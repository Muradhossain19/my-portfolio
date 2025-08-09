// File: components/Header.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Navigation items for section scroll
const navItems = [
  { name: "Home", section: "home" },
  { name: "About", section: "about" },
  { name: "Services", section: "services" },
  { name: "Portfolio", section: "portfolio" },
  { name: "Testimonial", section: "testimonial" },
  { name: "Price", section: "pricing" },
  { name: "Blog", section: "blog", isPage: true },
  { name: "Contact", section: "contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Ensure component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Section scroll handler
  const handleSectionScroll = useCallback(
    (section: string) => {
      setIsMenuOpen(false);

      if (section === "blog") {
        router.push("/blog");
        return;
      }

      if (pathname !== "/") {
        // Go to home page, then trigger scroll event
        router.push("/");
        // Delay to ensure navigation, then dispatch event
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("scroll-to-section", { detail: section })
          );
        }, 500);
        return;
      }

      // If already on home, scroll directly
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
    [pathname, router]
  );

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 10);
  }, []);

  // Scroll event listener with cleanup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    if (isMounted) {
      window.addEventListener("scroll", debouncedHandleScroll, {
        passive: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [handleScroll, isMounted]);

  // Body scroll lock with consistent width
  useEffect(() => {
    if (!isMounted) return;

    if (isMenuOpen) {
      // Get current scroll position
      const scrollY = window.scrollY;

      // Add styles to prevent width changes
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, [isMenuOpen, isMounted]);

  // Handle resize events
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      // Close mobile menu on desktop
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [isMenuOpen, isMounted]);

  // Prevent flash on SSR
  if (!isMounted) {
    return (
      <header className="bg-[#ECF0F3] sticky top-0 z-50 border-b-[1px] border-gray-200 h-[80px]">
        <nav className="container mx-auto flex justify-between items-center h-full px-4">
          <Link href="/">
            <Image
              src="/images/Logo/murad-logo.png"
              alt="Murad Hossain Logo"
              height={70}
              width={150}
              quality={100}
              priority
              className="cursor-pointer"
            />
          </Link>
          <div className="md:hidden">
            <div className="w-14 h-14 rounded-full bg-[#ECF0F3] flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
              <svg
                className="w-6 h-6 text-[#FF004F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <header
        className={`bg-[#ECF0F3] fixed top-0 left-0 right-0 z-50 border-b-[1px] border-gray-200 h-[80px] transition-all duration-300 ${
          isScrolled
            ? "shadow-[0_4px_20px_rgba(209,217,230,0.3),0_1px_3px_rgba(209,217,230,0.2)]"
            : ""
        }`}
      >
        <nav className="container mx-auto flex justify-between items-center h-full px-4">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/Logo/murad-logo.png"
              alt="Murad Hossain Logo"
              height={70}
              width={150}
              quality={100}
              priority
              className="cursor-pointer"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.isPage ? (
                  <Link
                    href="/blog"
                    className="relative font-normal text-[#1f2125] transition-colors duration-300 hover:text-[#FF004F] after:content-[''] after:absolute after:left-1/2 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-[#FF004F] after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSectionScroll(item.section)}
                    className="relative font-normal text-[#1f2125] transition-colors duration-300 hover:text-[#FF004F] after:content-[''] after:absolute after:left-1/2 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-[#FF004F] after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-full bg-transparent cursor-pointer"
                  >
                    {item.name}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-14 h-14 rounded-full bg-[#ECF0F3] flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-shadow duration-200 touch-manipulation"
              aria-label="Open menu"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <svg
                className="w-6 h-6 text-[#FF004F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Body padding to compensate for fixed header */}
      <div className="pt-[80px]" />

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-[90] cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ touchAction: "none" }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-[#ECF0F3] z-[100] shadow-2xl p-8 overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: "easeOut",
            }}
            style={{ touchAction: "pan-y" }}
          >
            {/* Top Section */}
            <div className="flex justify-between items-start mb-5">
              <Image
                src="/images/Logo/murad-logo.png"
                alt="Murad Hossain Logo"
                width={120}
                height={50}
                className="flex-shrink-0"
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 rounded-full bg-[#ECF0F3] flex items-center justify-center flex-shrink-0 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-shadow duration-200 touch-manipulation"
                aria-label="Close menu"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <svg
                  className="w-6 h-6 text-[#FF004F]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-base text-[#3c3e41] leading-relaxed mb-3">
              I am a creative developer building modern web experiences.
            </p>

            <hr className="border-gray-300 my-4" />

            {/* Mobile Menu Items */}
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.isPage ? (
                    <Link
                      href="/blog"
                      className="text-sm font-normal text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-200 block py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name.toUpperCase()}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSectionScroll(item.section)}
                      className="text-sm font-normal text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-200 bg-transparent text-left w-full py-2 touch-manipulation"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {item.name.toUpperCase()}
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <h4 className="text-sm font-medium uppercase tracking-widest text-[#3c3e41] mb-4">
                Find With Me
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] transition-all duration-300 touch-manipulation"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] transition-all duration-300 touch-manipulation"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] transition-all duration-300 touch-manipulation"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
