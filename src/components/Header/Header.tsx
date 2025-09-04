// File: components/Header.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Navigation items for section scroll
const navItems = [
  { name: "Home", section: "home" },
  { name: "Services", section: "services" },
  { name: "About", section: "about" },
  { name: "Portfolio", section: "portfolio" },
  { name: "Testimonial", section: "testimonial" },
  // { name: "Price", section: "pricing" },
  { name: "Blog", section: "blog", isPage: true },
  { name: "Contact", section: "contact" },
];

const serviceLinks = [
  {
    title: "Web Development",
    href: "/services/web-development",
  },
  {
    title: "WordPress Solutions",
    href: "/services/wordpress",
  },
  {
    title: "E-commerce Solutions",
    href: "/services/ecommerce",
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const servicesTimeout = useRef<NodeJS.Timeout | null>(null);

  // Section scroll handler
  const handleSectionScroll = useCallback(
    (section: string) => {
      setIsMenuOpen(false);

      if (section === "blog") {
        router.push("/blog");
        return;
      }

      if (pathname !== "/") {
        router.push(`/?section=${section}`);
      } else {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [pathname, router]
  );

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Desktop: handle hover for services dropdown
  const handleServicesEnter = () => {
    if (servicesTimeout.current) clearTimeout(servicesTimeout.current);
    setIsServicesOpen(true);
  };
  const handleServicesLeave = () => {
    servicesTimeout.current = setTimeout(() => setIsServicesOpen(false), 120);
  };

  // Mobile: toggle services dropdown
  const handleMobileServicesToggle = () => {
    setIsMobileServicesOpen((prev) => !prev);
  };

  return (
    <>
      <header
        className={`bg-[#ECF0F3] fixed top-0 left-0 right-0 z-50 h-[80px] transition-all duration-300 ${
          isScrolled || isMenuOpen ? "shadow-md" : ""
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
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.name === "Services" ? (
                <li
                  key={item.name}
                  className="relative group"
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleServicesLeave}
                >
                  <Link
                    href="/services"
                    className="relative font-normal text-[#1f2125] transition-colors duration-300 hover:text-[#FF004F] after:content-[''] after:absolute after:left-1/2 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-[#FF004F] after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-full bg-transparent cursor-pointer flex items-center gap-1"
                    aria-haspopup="menu"
                    aria-expanded={isServicesOpen}
                    onClick={() => setIsServicesOpen(false)}
                  >
                    {item.name}
                    <svg
                      className="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                  {/* Dropdown */}
                  <div
                    className={`absolute left-0 top-full mt-2 min-w-[240px] bg-[#ECF0F3] shadow-lg border border-[#d1d9e6] transition-all duration-200 ${
                      isServicesOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2 pointer-events-none"
                    }`}
                    style={{ zIndex: 100 }}
                  >
                    <ul>
                      {serviceLinks.map((service, idx) => (
                        <React.Fragment key={service.href}>
                          <li>
                            <Link
                              href={service.href}
                              className="block px-6 py-3 text-[#1f2125] hover:bg-[#FF004F]/10 hover:text-[#FF004F] transition-colors duration-200"
                              onClick={() => setIsServicesOpen(false)}
                            >
                              {service.title}
                            </Link>
                          </li>
                          {/* Full-width dotted border except last item */}
                          {idx < serviceLinks.length - 1 && (
                            <div className="border-b border-dotted border-[#d1d9e6] w-full mx-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => handleSectionScroll(item.section)}
                    className="relative font-normal text-[#1f2125] transition-colors duration-300 hover:text-[#FF004F] after:content-[''] after:absolute after:left-1/2 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-[#FF004F] after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-full bg-transparent cursor-pointer"
                  >
                    {item.name}
                  </button>
                </li>
              )
            )}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-14 h-14 rounded-full bg-[#ECF0F3] flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
              aria-label="Open menu"
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

      <div className="pt-[80px]" />

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-[90]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-[#ECF0F3] z-[100] shadow-2xl p-8 flex flex-col overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
            >
              <div className="flex justify-between items-start mb-5">
                <Image
                  src="/images/Logo/murad-logo.png"
                  alt="Murad Hossain Logo"
                  width={120}
                  height={50}
                />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-12 h-12 rounded-full bg-[#ECF0F3] flex items-center justify-center flex-shrink-0 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
                  aria-label="Close menu"
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

              <ul className="flex flex-col space-y-4">
                {navItems.map((item) =>
                  item.name === "Services" ? (
                    <li key={item.name} className="relative">
                      <div className="flex items-center">
                        <Link
                          href="/services"
                          className="flex-1 text-sm font-normal text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-200 bg-transparent text-left w-full py-2 "
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsMobileServicesOpen(false);
                          }}
                        >
                          {item.name.toUpperCase()}
                        </Link>
                        <button
                          type="button"
                          onClick={handleMobileServicesToggle}
                          className="p-2 ml-2 flex items-center"
                          aria-haspopup="menu"
                          aria-expanded={isMobileServicesOpen}
                          tabIndex={0}
                          style={{
                            border: "1px solid #d1d9e6", // Full border
                            borderRadius: "6px",
                            background: "transparent",
                          }}
                        >
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isMobileServicesOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M6 9l6 6 6-6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isMobileServicesOpen
                            ? "max-h-60 opacity-100 visible"
                            : "max-h-0 opacity-0 invisible"
                        }`}
                      >
                        <ul className="flex flex-col bg-[#ECF0F3] mt-2">
                          {serviceLinks.map((service, idx) => (
                            <React.Fragment key={service.href}>
                              <li>
                                <Link
                                  href={service.href}
                                  className="block px-5 text-sm py-3 text-[#3c3e41] hover:bg-[#FF004F]/10 hover:text-[#FF004F] transition-colors duration-200"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsMobileServicesOpen(false);
                                  }}
                                >
                                  {service.title}
                                </Link>
                              </li>
                              {/* Dotted border except last item */}
                              {idx < serviceLinks.length - 1 && (
                                <div className="border-b border-dotted border-[#d1d9e6] w-full mx-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ) : (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => {
                          handleSectionScroll(item.section);
                          setIsMenuOpen(false);
                        }}
                        className="text-sm font-normal text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-200 bg-transparent text-left w-full py-2"
                      >
                        {item.name.toUpperCase()}
                      </button>
                    </li>
                  )
                )}
              </ul>

              <div className="mt-auto pt-8">
                <h4 className="text-sm font-medium uppercase tracking-widest text-[#3c3e41] mb-4">
                  Find With Me
                </h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] transition-all duration-300"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] transition-all duration-300"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] transition-all duration-300"
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
