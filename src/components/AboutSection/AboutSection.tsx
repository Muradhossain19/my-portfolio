import React from "react";
import { motion, Variants } from "framer-motion";
import {
  FaUser,
  FaLightbulb,
  FaHeart,
  FaGraduationCap,
  FaCode,
  FaRocket,
} from "react-icons/fa";

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

const AboutSection: React.FC = () => {
  const headingText = "About Me";

  // About information data
  const aboutInfo = [
    {
      icon: FaUser,
      title: "Who I Am",
      description:
        "I'm a passionate web developer with years of experience creating digital solutions that make a difference in people's lives.",
    },
    {
      icon: FaLightbulb,
      title: "My Vision",
      description:
        "To create innovative, user-friendly web experiences that bridge the gap between technology and human needs.",
    },
    {
      icon: FaHeart,
      title: "My Passion",
      description:
        "I love turning complex problems into simple, beautiful, and intuitive solutions through clean code and thoughtful design.",
    },
  ];

  const skills = [
    {
      icon: FaCode,
      name: "Frontend Development",
      level: "Expert",
    },
    {
      icon: FaRocket,
      name: "Backend Development",
      level: "Advanced",
    },
    {
      icon: FaGraduationCap,
      name: "UI/UX Design",
      level: "Intermediate",
    },
  ];

  return (
    <section id="about" className="bg-[#ECF0F3] py-20 md:py-28">
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
          style={{ fontFamily: "var(--font-poppins)" }}
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
              <p
                className="text-base text-[#3c3e41] leading-relaxed mb-4 font-light"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                With over 5 years of experience in web development, I&#39;ve had
                the privilege of working with diverse clients and projects that
                have shaped my expertise and perspective.
              </p>
              <p
                className="text-base text-[#3c3e41] leading-relaxed font-light"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                I believe in continuous learning and staying updated with the
                latest technologies to deliver cutting-edge solutions that
                exceed expectations.
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
              <div className="space-y-4">
                {skills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]"
                      whileHover={{
                        boxShadow:
                          "inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff",
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-[#FF004F]" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-[#1f2125]">
                          {skill.name}
                        </h4>
                        <p className="text-sm text-[#3c3e41]">{skill.level}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* About Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aboutInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <motion.div
                key={index}
                className="group relative p-8 rounded-2xl bg-[#ECF0F3] text-center shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] flex flex-col overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{
                  boxShadow:
                    "inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff",
                  y: -8,
                }}
                whileTap={{
                  boxShadow:
                    "inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <motion.div
                  className="flex-grow"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex justify-center mb-6">
                    <IconComponent className="w-10 h-10 text-[#FF004F]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1f2125] mb-3">
                    {info.title}
                  </h3>
                  <p
                    className="text-base text-[#3c3e41] leading-relaxed font-light"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    {info.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
