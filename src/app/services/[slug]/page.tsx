"use client";

import { useParams } from "next/navigation";
import { services } from "./ServiceData";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import PageHeader from "@/components/PageHeader/PageHeader"; // Add this import
import {
  FaCheck,
  FaArrowRight,
  FaQuestionCircle,
  FaStar,
  FaClock,
  FaShieldAlt,
  FaLightbulb,
  FaRocket,
  FaHeart,
  FaUser,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useState } from "react";

// Animation variants - optimized for better performance
const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const optimizedViewport = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -100px 0px",
};

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === slug);
  const [activePricing, setActivePricing] = useState<
    "basic" | "standard" | "premium"
  >("standard");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  if (!service) {
    return (
      <>
        <PageHeader
          title="Service Not Found"
          subtitle="The requested service could not be found"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/" },
            { label: "Not Found", href: "#" },
          ]}
        />
        <div className="min-h-[40vh] bg-[#ECF0F3] flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 bg-[#ECF0F3] rounded-full flex items-center justify-center mb-6 shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff]">
            <FaQuestionCircle className="w-8 h-8 text-[#FF004F]" />
          </div>
          <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
            Service Not Found
          </h2>
          <p className="text-[#3c3e41] mb-8 max-w-md">
            Sorry, the requested service does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="bg-[#FF004F] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]"
          >
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  return (
    <>
      {/* PageHeader Component */}
      <PageHeader
        title={service.title}
        subtitle={service.subtitle}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/" },
          { label: service.title, href: `#` },
        ]}
      />

      <div className="bg-[#ECF0F3] min-h-screen overflow-x-hidden smooth-scroll">
        {/* Hero Section - Modified */}
        <section className="py-16 md:py-20">
          {/* Reduced padding since PageHeader takes space */}
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Left Content */}
              <motion.div variants={fadeInUp}>
                <div className="inline-block bg-[#FF004F]/10 text-[#FF004F] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {service.title}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1f2125] mb-4 leading-tight">
                  {service.hero_description}
                </h1>
                <p className="text-lg text-[#3c3e41] mb-6 leading-relaxed">
                  {service.overview}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="bg-[#FF004F] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] text-center"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="bg-[#ECF0F3] text-[#FF004F] px-8 py-4 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-center flex items-center justify-center gap-2"
                  >
                    Learn More <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Right Image */}
              <motion.div variants={fadeInUp} className="relative">
                <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] bg-white p-4">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover rounded-xl"
                    priority
                  />
                </div>
                {/* Floating stats */}
                <div className="absolute -bottom-6 -left-6 bg-[#ECF0F3] p-4 rounded-xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-[#FF004F] w-5 h-5" />
                    <div>
                      <div className="text-sm font-semibold text-[#1f2125]">
                        {service.delivery_time}
                      </div>
                      <div className="text-xs text-[#3c3e41]">
                        Delivery Time
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={staggerContainer}
            >
              {[
                {
                  icon: FaRocket,
                  title: "Fast Delivery",
                  desc: service.delivery_time,
                },
                {
                  icon: FaShieldAlt,
                  title: "Guarantee",
                  desc: "100% Satisfaction",
                },
                { icon: FaHeart, title: "Support", desc: "Ongoing Support" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-[#ECF0F3] p-6 rounded-xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] text-center"
                >
                  <stat.icon className="w-8 h-8 text-[#FF004F] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#1f2125] mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-sm text-[#3c3e41]">{stat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
                What&#39;s Included
              </h2>
              <p className="text-[#3c3e41] max-w-2xl mx-auto">
                Comprehensive features designed to deliver exceptional results
                for your project.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={staggerContainer}
            >
              {service.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
                >
                  <FaCheck className="text-[#FF004F] w-5 h-5 flex-shrink-0 mt-1" />
                  <span className="text-[#3c3e41] font-medium leading-relaxed">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-16 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
                How I Work
              </h2>
              <p className="text-[#3c3e41] max-w-2xl mx-auto">
                A proven process that ensures quality results and smooth project
                delivery.
              </p>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={staggerContainer}
            >
              {service.process.map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FF004F] text-white flex items-center justify-center font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1f2125] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#3c3e41] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
                Technologies I Use
              </h2>
              <p className="text-[#3c3e41]">
                Modern and proven technologies to build robust solutions.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={staggerContainer}
            >
              {service.technologies.map((tech, idx) => (
                <motion.span
                  key={idx}
                  variants={fadeInUp}
                  className="bg-[#ECF0F3] text-[#3c3e41] px-4 py-2 rounded-full text-sm font-medium shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] hover:shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] transition-all duration-300"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Portfolio Examples */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
                Portfolio Examples
              </h2>
              <p className="text-[#3c3e41]">
                See some of my recent work in this category.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={staggerContainer}
            >
              {service.portfolio_examples.map((example, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="group bg-[#ECF0F3] rounded-2xl overflow-hidden shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={example.image}
                      alt={example.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-[#1f2125] mb-2 group-hover:text-[#FF004F] transition-colors duration-300">
                      {example.title}
                    </h3>
                    <p className="text-sm text-[#3c3e41] leading-relaxed">
                      {example.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
                Pricing Options
              </h2>
              <p className="text-[#3c3e41] max-w-2xl mx-auto">
                Choose the package that best fits your needs and budget.
              </p>
            </motion.div>

            {/* Pricing Toggle */}
            <motion.div
              className="flex justify-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
            >
              <div className="bg-[#ECF0F3] p-2 rounded-xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] flex">
                {(["basic", "standard", "premium"] as const).map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setActivePricing(plan)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 capitalize ${
                      activePricing === plan
                        ? "bg-[#ECF0F3] text-[#FF004F] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]"
                        : "text-[#3c3e41] hover:text-[#FF004F]"
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Active Pricing Card */}
            <motion.div
              key={activePricing}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-2xl mx-auto bg-[#ECF0F3] rounded-2xl p-8 shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff]"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#1f2125] mb-2 capitalize">
                  {activePricing} Package
                </h3>
                <div className="text-3xl font-bold text-[#FF004F] mb-4">
                  {service.pricing[activePricing].price}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {service.pricing[activePricing].features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <FaCheck className="text-[#FF004F] w-4 h-4 flex-shrink-0" />
                    <span className="text-[#3c3e41] text-sm font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/contact"
                  className="bg-[#FF004F] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] inline-block"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Me */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
                Why Choose Me
              </h2>
              <p className="text-[#3c3e41]">
                Here&#39;s what sets my services apart from the competition.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={staggerContainer}
            >
              {service.why_choose.map((reason, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="flex items-start gap-4 bg-[#ECF0F3] rounded-xl p-6 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
                >
                  <FaLightbulb className="text-[#FF004F] w-5 h-5 flex-shrink-0 mt-1" />
                  <span className="text-[#1f2125] font-medium leading-relaxed">
                    {reason}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
                Client Testimonials
              </h2>
              <p className="text-[#3c3e41]">
                What my clients say about this service.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={staggerContainer}
            >
              {service.testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-[#FF004F] w-4 h-4" />
                    ))}
                  </div>
                  <p className="text-[#3c3e41] mb-4 leading-relaxed">
                    &quot;{testimonial.feedback}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ECF0F3] rounded-full flex items-center justify-center">
                      <FaUser className="text-[#FF004F] w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#1f2125]">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-[#3c3e41] flex items-center gap-1">
                        <FaBuilding className="w-3 h-3" />
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-[#3c3e41]">
                Got questions? Here are the most common ones about this service.
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={staggerContainer}
            >
              {service.faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-white rounded-xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <FaQuestionCircle className="text-[#FF004F] w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold text-[#1f2125]">
                        {faq.question}
                      </span>
                    </div>
                    {expandedFaq === idx ? (
                      <FaChevronUp className="text-[#FF004F] w-5 h-5" />
                    ) : (
                      <FaChevronDown className="text-[#FF004F] w-5 h-5" />
                    )}
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-6 pb-6">
                      <p className="text-[#3c3e41] leading-relaxed pl-8">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center bg-[#ECF0F3] rounded-2xl p-12 shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff]"
            >
              <FaRocket className="w-12 h-12 text-[#FF004F] mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-[#1f2125] mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-[#3c3e41] mb-8 leading-relaxed">
                Let&#39;s discuss your project and create something amazing
                together.
                {service.guarantee}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-[#FF004F] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] text-center"
                >
                  Start Your Project
                </Link>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="bg-[#ECF0F3] text-[#FF004F] px-8 py-4 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-center"
                >
                  View Pricing
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
