// File: src/components/ServiceSection.tsx

"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  FaCode,
  FaWordpress,
  FaShoppingCart,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";

// সার্ভিস তালিকা (আইকনের সাইজ আপডেট করা হয়েছে)
const services = [
  {
    icon: <FaCode className="w-8 h-8 text-[#FF004F]" />,
    title: "Web Development",
    description:
      "I build powerful, custom web applications using React/Next.js for the frontend and Laravel/PHP for a secure backend.",
    link: "/services/web-development",
  },
  {
    icon: <FaWordpress className="w-8 h-8 text-[#FF004F]" />,
    title: "WordPress Solutions",
    description:
      "I create and manage professional WordPress websites using advanced customization to build a fast, secure, and unique online presence for you.",
    link: "/services/wordpress",
  },
  {
    icon: <FaShoppingCart className="w-8 h-8 text-[#FF004F]" />,
    title: "E-commerce Solutions",
    description:
      "I build powerful and secure e-commerce stores using WooCommerce, designed to boost your sales and grow your business online.",
    link: "/services/ecommerce",
  },
];

// অ্যানিমেশন ভ্যারিয়েন্টগুলো (অপরিবর্তিত)
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

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.4,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ServiceSection = () => {
  const headingText = "My Awesome Services";

  return (
    <section
      id="services"
      className="bg-[#ECF0F3] py-10 md:py-16 overflow-x-hidden"
    >
      <div className="container mx-auto px-4">
        {/* হেডিং এবং সাবটাইটেল (অপরিবর্তিত) */}
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
          className="text-base sm:text-lg text-center text-[#3c3e41] max-w-2xl mx-auto mb-16"
          style={{ fontFamily: "var(--font-poppins)", fontWeight: 300 }}
          variants={subtitleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          From custom web development to SEO optimization, I offer complete
          services to build and grow your online presence.
        </motion.p>

        {/* সার্ভিস কার্ড (ডিজাইন আপডেট করা হয়েছে) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.link}
              className="group"
              style={{ textDecoration: "none" }}
            >
              <motion.div
                className="bg-[#ECF0F3] rounded-2xl p-8 flex flex-col h-full shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{
                  boxShadow:
                    "inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff",
                  y: -8,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex-grow">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-[#ECF0F3] rounded-xl flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] transition-all duration-300 group-hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1f2125] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-base text-[#3c3e41] leading-relaxed font-light mb-2">
                    {service.description}
                  </p>
                </div>
                <div className="mt-auto pt-3">
                  <span className="font-semibold text-[#FF004F] flex items-center justify-start gap-2">
                    View Details <FaArrowRight />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
