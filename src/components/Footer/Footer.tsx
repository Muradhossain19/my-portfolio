"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaHeart,
  FaCode,
  FaRocket,
  FaLightbulb,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Section scroll handler (header-এর মতো)
  const handleSectionScroll = (section: string) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${section}`;
    }
  };

  // Footer links data (section name)
  const quickLinks = [
    { label: "Home", section: "home" },
    { label: "About", section: "about" },
    { label: "Portfolio", section: "portfolio" },
    { label: "Testimonial", section: "testimonial" },
    { label: "Price", section: "pricing" },
    { label: "Blog", href: "/blog" }, // Blog page link only
    { label: "Contact", section: "contact" },
  ];

  const services = [
    { label: "Custom Web Development", href: "/services/web-development" },
    { label: "WordPress Solutions", href: "/services/wordpress" },
    { label: "E-commerce Solutions", href: "/services/ecommerce" },
  ];

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-[#1877f2]",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:text-[#1da1f2]",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:text-[#0077b5]",
    },
    {
      icon: FaGithub,
      href: "https://github.com",
      label: "GitHub",
      color: "hover:text-[#333]",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-[#e4405f]",
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com",
      label: "YouTube",
      color: "hover:text-[#ff0000]",
    },
  ];

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setSubscriptionStatus("error");
      return;
    }

    setIsSubscribing(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subscribe",
          email,
        }),
      });
      if (res.ok) {
        setSubscriptionStatus("success");
        setEmail("");
      } else {
        setSubscriptionStatus("error");
      }
    } catch {
      setSubscriptionStatus("error");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#1f2125] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF004F] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FF004F] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#FF004F] rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Mobile Optimized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info & Newsletter - Mobile Optimized */}
          <div className="md:col-span-2 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FF004F] rounded-xl flex items-center justify-center">
                  <FaCode className="text-white text-lg md:text-xl" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold">
                    Murad Hossain
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Web Developer
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed mb-6 md:mb-8 text-sm md:text-base max-w-md">
                Passionate web developer creating innovative digital solutions.
                Specializing in modern web technologies and delivering
                exceptional user experiences.
              </p>

              {/* Contact Info - Mobile Optimized */}
              <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                <div className="flex items-center gap-3 text-gray-300">
                  <FaMapMarkerAlt className="text-[#FF004F] w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope className="text-[#FF004F] w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">
                    hello@muradhossain.com
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaPhone className="text-[#FF004F] w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm">+880 1700 000000</span>
                </div>
              </div>

              {/* Newsletter Subscription - Mobile Optimized */}
              <div className="bg-[#2a2d33] rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <FaEnvelope className="text-[#FF004F] w-4 h-4 md:w-5 md:h-5" />
                  <h4 className="text-base md:text-lg font-semibold">
                    Stay Updated
                  </h4>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                  Subscribe to get the latest updates on web development tips,
                  project showcases, and tech insights.
                </p>

                <form
                  onSubmit={handleNewsletterSubmit}
                  className="space-y-3 md:space-y-4"
                >
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#1f2125] border border-gray-600 rounded-lg md:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FF004F] transition-colors duration-300 text-sm"
                    />
                  </div>

                  {/* Status Messages */}
                  {subscriptionStatus === "success" && (
                    <motion.p
                      className="text-green-400 text-xs md:text-sm flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <FaHeart className="w-3 h-3" />
                      Thank you for subscribing!
                    </motion.p>
                  )}

                  {subscriptionStatus === "error" && (
                    <motion.p
                      className="text-red-400 text-xs md:text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Please enter a valid email address.
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className={`w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                      isSubscribing
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-[#FF004F] hover:bg-[#e6003d] active:scale-95"
                    }`}
                  >
                    {isSubscribing ? (
                      <>
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="w-3 h-3 md:w-4 md:h-4" />
                        Subscribe Now
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Quick Links - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <FaRocket className="text-[#FF004F] w-4 h-4 md:w-5 md:h-5" />
              Quick Links
            </h4>
            {/* Quick Links section */}
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.href ? (
                    // Blog page link
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-[#FF004F] transition-colors duration-300 text-xs md:text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-[#FF004F] transition-colors duration-300"></span>
                      {link.label}
                    </Link>
                  ) : (
                    // Section scroll button
                    <button
                      type="button"
                      onClick={() => handleSectionScroll(link.section!)}
                      className="bg-transparent text-gray-300 hover:text-[#FF004F] transition-colors duration-300 text-xs md:text-sm flex items-center gap-2 group cursor-pointer p-0"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-[#FF004F] transition-colors duration-300"></span>
                      {link.label}
                    </button>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <FaLightbulb className="text-[#FF004F] w-4 h-4 md:w-5 md:h-5" />
              Services
            </h4>
            {/* Services section */}
            <ul className="space-y-2 md:space-y-3">
              {services.map((service, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-[#FF004F] transition-colors duration-300 text-xs md:text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-[#FF004F] transition-colors duration-300"></span>
                    {service.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Social Links & Copyright - Mobile Optimized */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            {/* Social Links */}
            <motion.div
              className="flex items-center gap-3 md:gap-4 order-2 md:order-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-gray-400 text-xs md:text-sm mr-1 md:mr-2">
                Follow me:
              </span>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 md:w-10 md:h-10 bg-[#2a2d33] rounded-lg flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:scale-110 hover:bg-[#3a3d43]`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <social.icon className="w-3 h-3 md:w-4 md:h-4" />
                </motion.a>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div
              className="text-center md:text-right order-1 md:order-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400 text-xs md:text-sm flex flex-col md:flex-row items-center justify-center md:justify-end gap-1">
                <span className="flex items-center gap-1">
                  © {currentYear} Murad Hossain. Made with{" "}
                  <FaHeart className="text-[#FF004F] w-3 h-3 animate-pulse" />{" "}
                  in Bangladesh
                </span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                All rights reserved | Privacy Policy | Terms of Service
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
