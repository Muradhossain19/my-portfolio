"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { FaHome, FaChevronRight } from "react-icons/fa";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
}

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

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
}) => {
  return (
    <section className="bg-[#ECF0F3] py-20 md:py-28 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#FF004F] rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#FF004F] rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-[#FF004F] rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Page Title with Wave Animation */}
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-[#1f2125] mb-4"
            variants={headingContainer}
            initial="hidden"
            animate="visible"
          >
            {title.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                variants={headingCharacter}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className="text-lg text-[#3c3e41] max-w-2xl mx-auto mb-8 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Breadcrumbs */}
          <motion.nav
            className="items-center justify-center flex-wrap gap-2 bg-[#ECF0F3] rounded-full px-6 py-3 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] inline-flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300 text-sm font-medium"
            >
              <FaHome className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {breadcrumbs.map((item, index) =>
              item.label === "Home" ? null : (
                <React.Fragment key={index}>
                  <FaChevronRight className="w-3 h-3 text-[#3c3e41]" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-[#FF004F] text-sm font-semibold">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300 text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              )
            )}
          </motion.nav>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
