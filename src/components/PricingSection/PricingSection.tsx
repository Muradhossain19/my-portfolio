"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { FaCheck, FaStar, FaClock, FaRedo } from "react-icons/fa";

const pricingPlans = [
  {
    name: "Static",
    title: "Make Your Single Page",
    subtitle: "Elementor / WPBakery",
    price: "$30.00",
    description:
      "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary",
    features: [
      "1 Page with Elementor",
      "Design Customization",
      "Responsive Design",
      "Content Upload",
      "Design Customization",
      "2 Plugins/Extensions",
    ],
    featuresRight: [
      "Multipage Elementor",
      "Design Figma",
      "MAintaine Design",
      "Content Upload",
      "Design With XD",
      "8 Plugins/Extensions",
    ],
    delivery: "2 Days Delivery",
    revision: "Unlimited Revision",
    recommended: false,
  },
  {
    name: "Standard",
    title: "Design Make this Page",
    subtitle: "Elementor / WPBakery",
    price: "$50.00",
    description:
      "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary",
    features: [
      "5 Page with Elementor",
      "Design Customization",
      "Responsive Design",
      "Content Upload",
      "Design Customization",
      "5 Plugins/Extensions",
    ],
    featuresRight: [
      "Multipage Elementor",
      "Design Figma",
      "MAintaine Design",
      "Content Upload",
      "Design With XD",
      "50 Plugins/Extensions",
    ],
    delivery: "2 Days Delivery",
    revision: "Unlimited Revision",
    recommended: true,
  },
  {
    name: "Premium",
    title: "Customize Your Single Page",
    subtitle: "Elementor / WPBakery",
    price: "$90.00",
    description:
      "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary",
    features: [
      "10 Page with Elementor",
      "Design Customization",
      "Responsive Design",
      "Content Upload",
      "Design Customization",
      "20 Plugins/Extensions",
    ],
    featuresRight: [
      "Multipage Elementor",
      "Design Figma",
      "MAintaine Design",
      "Content Upload",
      "Design With XD",
      "100 Plugins/Extensions",
    ],
    delivery: "2 Days Delivery",
    revision: "Unlimited Revision",
    recommended: false,
  },
];

// Wave animation variants for left side text
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

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState(1); // Standard is default (index 1)
  const headingText = "My Pricing";

  return (
    <section id="pricing" className="bg-[#ECF0F3] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Heading with Wave Animation */}
          <motion.div
            className="lg:sticky lg:top-20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[#FF004F] text-sm font-semibold mb-4 tracking-wider uppercase">
              PRICING
            </div>
            {/* Wave Animation for Main Heading */}
            <motion.h2
              className="text-2xl md:text-4xl font-bold text-[#1f2125] leading-tight"
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
          </motion.div>

          {/* Right Side - Pricing Card */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Tab Navigation */}
            <div className="relative mb-8">
              {/* Improved Recommended Badge */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-[#FF004F] to-[#e6003d] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-300">
                  <FaStar className="text-yellow-300 w-4 h-4" />
                  Recommended
                </div>
              </div>

              <div className="bg-[#ECF0F3] p-2 rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] flex">
                {pricingPlans.map((plan, index) => (
                  <button
                    key={plan.name}
                    onClick={() => setActiveTab(index)}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                      activeTab === index
                        ? "bg-[#ECF0F3] text-[#FF004F] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]"
                        : "text-[#3c3e41] hover:text-[#FF004F]"
                    }`}
                  >
                    {plan.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Plan Card */}
            <motion.div
              key={activeTab}
              className="bg-[#ECF0F3] rounded-3xl p-8 shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1f2125] mb-2">
                    {pricingPlans[activeTab].title}
                  </h3>
                  <p className="text-[#3c3e41] font-light">
                    {pricingPlans[activeTab].subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-bold text-[#FF004F]">
                    {pricingPlans[activeTab].price}
                  </div>
                </div>
              </div>

              <p className="text-[#3c3e41] mb-8 leading-relaxed font-light text-base">
                {pricingPlans[activeTab].description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 md:grid-cols-2 sm:grid-cols-1">
                {pricingPlans[activeTab].features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 break-words">
                    <FaCheck className="text-[#FF004F] w-4 h-4 flex-shrink-0" />
                    <span className="text-[#3c3e41] text-sm font-light break-words">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 md:grid-cols-2 sm:grid-cols-1">
                {pricingPlans[activeTab].featuresRight.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 break-words">
                    <FaCheck className="text-[#FF004F] w-4 h-4 flex-shrink-0" />
                    <span className="text-[#3c3e41] text-sm font-light break-words">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Button */}
              <button className="w-full bg-[#ECF0F3] text-[#FF004F] py-4 rounded-2xl font-semibold shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] hover:shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] transition-all duration-300 mb-6 cursor-pointer">
                ORDER NOW →
              </button>

              {/* Footer Info */}
              <div className="flex items-center justify-center gap-6 text-sm text-[#3c3e41]">
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  {pricingPlans[activeTab].delivery}
                </div>
                <div className="flex items-center gap-2">
                  <FaRedo className="w-4 h-4" />
                  {pricingPlans[activeTab].revision}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
