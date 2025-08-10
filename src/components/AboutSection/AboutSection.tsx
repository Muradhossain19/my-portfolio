"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { FaUser, FaLightbulb, FaHeart } from "react-icons/fa";

// About information data
const aboutInfo = [
  {
    icon: <FaUser className="w-8 h-8 text-[#FF004F]" />,
    title: "Who I Am",
    description:
      "I'm a passionate web developer with years of experience creating digital solutions that make a difference in people's lives.",
  },
  {
    icon: <FaLightbulb className="w-8 h-8 text-[#FF004F]" />,
    title: "My Vision",
    description:
      "To create innovative, user-friendly web experiences that bridge the gap between technology and human needs.",
  },
  {
    icon: <FaHeart className="w-8 h-8 text-[#FF004F]" />,
    title: "My Passion",
    description:
      "I love turning complex problems into simple, beautiful, and intuitive solutions through clean code and thoughtful design.",
  },
];

const skills = [
  { name: "HTML", percentage: 95 },
  { name: "JavaScript", percentage: 90 },
  { name: "React", percentage: 85 },
  { name: "Laravel/PHP", percentage: 85 },
  { name: "WordPress", percentage: 90 },
];

// Animation variants
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

const profileVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  },
};

const skillVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
  },
};

const AboutSection = () => {
  const headingText = "About Me";

  return (
    <section
      id="about"
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

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg text-center text-[#3c3e41] max-w-2xl mx-auto mb-16 font-light"
          variants={subtitleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          Get to know me better and discover what drives my passion for creating
          exceptional digital experiences.
        </motion.p>

        {/* Main About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Profile Section */}
          <motion.div
            className="space-y-6"
            variants={profileVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="p-8 rounded-2xl bg-[#ECF0F3] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
              <h3 className="text-xl font-bold text-[#1f2125] mb-4">
                My Journey
              </h3>
              <p className="text-base text-[#3c3e41] leading-relaxed mb-4 font-light">
                With 3+ years of dedicated experience in web development, I have
                successfully delivered high-quality, responsive websites.
              </p>
              <p className="text-base text-[#3c3e41] leading-relaxed font-light">
                I am deeply committed to continuous learning and leveraging the
                latest technologies to provide cutting-edge, SEO-friendly
                solutions that consistently drive measurable results and exceed
                all expectations.
              </p>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            className="space-y-6"
            variants={skillVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="p-8 rounded-2xl bg-[#ECF0F3] shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
              <h3 className="text-xl font-bold text-[#1f2125] mb-6">
                My Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className={
                      index === skills.length - 1 && skills.length % 2 !== 0
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-[#3c3e41]">
                        {skill.name}
                      </span>
                      <span className="text-sm font-medium text-[#3c3e41]">
                        {skill.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-[#d1d9e6] rounded-full h-2.5 shadow-[inset_2px_2px_5px_#b8c1d1,inset_-2px_-2px_5px_#ffffff]">
                      <motion.div
                        className="bg-[#FF004F] h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        transition={{
                          duration: 1.5,
                          ease: "easeInOut",
                          delay: 0.2 + index * 0.1,
                        }}
                        viewport={{
                          once: true,
                          amount: 0.2,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* About Info Cards (ডিজাইন আপডেট করা হয়েছে, অ্যানিমেশন আগের মতো) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aboutInfo.map((info, index) => (
            <motion.div
              key={index}
              className="group bg-[#ECF0F3] rounded-2xl p-8 flex flex-col h-full shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
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
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#ECF0F3] rounded-xl flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] transition-all duration-300 group-hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]">
                  {info.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1f2125] mb-3">
                {info.title}
              </h3>
              <p className="text-base text-[#3c3e41] leading-relaxed font-light">
                {info.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
