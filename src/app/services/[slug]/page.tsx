"use client";

import { useParams } from "next/navigation";
import { services } from "./ServiceData";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader/PageHeader";
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
  FaExternalLinkAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaDollarSign,
  FaCog,
  FaRedo,
  FaQuoteLeft,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useState, useCallback, useEffect } from "react";
import ContactModal from "@/components/ContactModal/ContactModal";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30, transition: { duration: 0.3 } },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

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

const capsuleVariant: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

const optimizedViewport = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -100px 0px",
};

const LOCAL_KEY = "portfolio_loves";

type PortfolioExample = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  images?: string[];
  client: string;
  date: string;
  services: string;
  budget: string;
  likes: number;
  link: string;
  features: string[];
};

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === slug);
  const [activePricing, setActivePricing] = useState<
    "basic" | "standard" | "premium"
  >("standard");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [selectedProject, setSelectedProject] =
    useState<PortfolioExample | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loves, setLoves] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        setLoves(JSON.parse(stored));
      } else {
        const initialLoves: { [key: string]: number } = {};
        services.forEach((s) =>
          s.portfolio_examples.forEach((p) => {
            initialLoves[p.id] = p.likes;
          })
        );
        setLoves(initialLoves);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(initialLoves));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && Object.keys(loves).length > 0) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(loves));
    }
  }, [loves]);

  const handleLove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoves((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const openModal = (project: PortfolioExample) => {
    if (typeof window !== "undefined") {
      const scrollY = window.scrollY;
      setScrollPosition(scrollY);
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
    }
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = useCallback(() => {
    if (typeof window !== "undefined") {
      const scrollY = scrollPosition;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
    }
    setSelectedProject(null);
  }, [scrollPosition]);

  const prevImage = () => {
    if (selectedProject && selectedProject.images) {
      setCurrentImageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const nextImage = () => {
    if (selectedProject && Array.isArray(selectedProject.images)) {
      setCurrentImageIndex((prev) =>
        Math.min(selectedProject.images!.length - 1, prev + 1)
      );
    }
  };

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        closeContactModal();
      }
    };
    if (selectedProject || isContactModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedProject, isContactModalOpen, closeModal]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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

  return (
    <>
      <PageHeader
        title={service.title}
        subtitle={service.subtitle}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.title, href: `/services/${service.slug}` },
        ]}
      />
      <div className="bg-[#ECF0F3]">
        {/* Hero Section */}
        <section className="py-16 md:py-20">
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
                    className="bg-[#FF004F] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] text-center cursor-pointer"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="bg-[#ECF0F3] text-[#FF004F] px-8 py-4 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-center flex items-center justify-center gap-2 cursor-pointer"
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
                <div className="absolute -bottom-6 left-4 lg:-left-6 bg-[#ECF0F3] p-4 rounded-xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
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
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
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
        <section id="features" className="py-16 md:py-20 scroll-mt-20">
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
                  className="flex items-start gap-4 bg-[#ECF0F3] rounded-xl p-6 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
                >
                  <FaCheck className="text-[#FF004F] w-5 h-5 flex-shrink-0 mt-1" />
                  <span className="text-[#1f2125] font-medium leading-relaxed">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Process Section - Modernized & Professional */}
        <section id="process" className="py-16 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={optimizedViewport}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#1f2125] mb-4">
                My Working Process
              </h2>
              <p className="text-lg text-[#3c3e41] max-w-2xl mx-auto">
                I follow a structured and agile process to ensure every project
                is a success.
              </p>
            </motion.div>

            <div className="space-y-16">
              {service.process.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={optimizedViewport}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                    idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 bg-[#ECF0F3] rounded-full flex items-center justify-center shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
                      <span className="text-5xl font-bold text-[#FF004F] opacity-75">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-[#1f2125] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#3c3e41] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
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
                  variants={capsuleVariant}
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
                  key={example.id || idx}
                  variants={fadeInUp}
                  className="group bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden cursor-pointer"
                  onClick={() => openModal(example)}
                >
                  <div className="relative h-64 overflow-hidden rounded-t-2xl">
                    <Image
                      src={example.image}
                      alt={example.title}
                      fill
                      className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-[4000ms] ease-in-out group-hover:-translate-y-[calc(100%-16rem)]"
                    />
                    <a
                      href={example.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#FF004F] uppercase tracking-wider">
                        {service.title}
                      </span>
                      <button
                        onClick={(e) => handleLove(example.id, e)}
                        className="flex items-center gap-1.5 text-sm text-[#3c3e41] cursor-pointer focus:outline-none"
                      >
                        <FaHeart className="transition-colors duration-200 hover:text-[#FF004F]" />
                        <span>{loves[example.id] || example.likes}</span>
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-[#1f2125] leading-snug group-hover:text-[#FF004F] transition-colors duration-300">
                      {example.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section - FULLY REBUILT to match PricingSection.tsx */}
        <section id="pricing" className="py-16 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-start">
              {/* Left Side - Sticky Heading */}
              <motion.div
                className="lg:sticky lg:top-28 self-start"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={optimizedViewport}
                transition={{ duration: 0.6 }}
              >
                <div className="text-[#FF004F] text-sm font-semibold mb-4 tracking-wider uppercase">
                  PRICING
                </div>
                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1f2125] leading-tight mb-6"
                  variants={headingContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={optimizedViewport}
                >
                  {"Pricing Options".split("").map((char, index) => (
                    <motion.span
                      key={`${char}-${index}`}
                      variants={headingCharacter}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.h2>
                <p className="text-[#3c3e41] text-lg leading-relaxed mb-6">
                  Choose the package that best fits your needs and budget for{" "}
                  <span className="font-semibold text-[#FF004F]">
                    {service.title}
                  </span>
                  .
                </p>
                <div className="space-y-3 text-sm text-[#3c3e41]">
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-[#FF004F] w-4 h-4" />
                    <span>{service.guarantee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-[#FF004F] w-4 h-4" />
                    <span>Transparent Pricing, No Hidden Costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-[#FF004F] w-4 h-4" />
                    <span>Free Consultation to Discuss Your Project</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Pricing Card */}
              <motion.div
                className="w-full max-w-full"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={optimizedViewport}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Tab Navigation */}
                <div className="relative mb-8">
                  {activePricing === "standard" && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-[#FF004F] to-[#e6003d] text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg flex items-center gap-2">
                        <FaStar className="text-yellow-300 w-3 h-3 md:w-4 md:h-4" />
                        Recommended
                      </div>
                    </div>
                  )}
                  <div className="bg-[#ECF0F3] p-2 rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] flex">
                    {(["basic", "standard", "premium"] as const).map((plan) => (
                      <button
                        key={plan}
                        onClick={() => setActivePricing(plan)}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer text-base capitalize ${
                          activePricing === plan
                            ? "bg-[#ECF0F3] text-[#FF004F] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]"
                            : "text-[#3c3e41] hover:text-[#FF004F]"
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Plan Card */}
                <motion.div
                  key={activePricing}
                  className="bg-[#ECF0F3] rounded-3xl p-8 shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1f2125] mb-2 capitalize">
                        {activePricing} Package
                      </h3>
                      <p className="text-[#3c3e41] font-light">
                        For {service.title}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-3xl font-bold text-[#FF004F]">
                        {service.pricing[activePricing].price}
                      </div>
                    </div>
                  </div>

                  <p className="text-[#3c3e41] mb-8 leading-relaxed font-light">
                    This package includes all the essential features to get your
                    project up and running with excellent quality and support.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                    {service.pricing[activePricing].features.map(
                      (feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <FaCheck className="text-[#FF004F] w-4 h-4 flex-shrink-0 mt-1" />
                          <span className="text-[#3c3e41] text-sm font-light flex-1 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    onClick={openContactModal}
                    className="w-full block bg-[#ECF0F3] text-[#FF004F] py-4 px-4 rounded-2xl font-semibold shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] hover:shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] transition-all duration-300 mb-6 cursor-pointer text-center"
                  >
                    ORDER NOW →
                  </button>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-[#3c3e41]">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4 flex-shrink-0" />
                      <span>{service.delivery_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaRedo className="w-4 h-4 flex-shrink-0" />
                      <span>Unlimited Revisions</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
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

        {/* Testimonials Section - New Professional Slider Design */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
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

            {service.testimonials.length > 0 && (
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={optimizedViewport}
                transition={{ duration: 0.5 }}
              >
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex -ml-4">
                    {service.testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.3333%] pl-4"
                      >
                        <div className="h-full flex flex-col bg-[#ECF0F3] rounded-2xl p-8 shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff]">
                          <FaQuoteLeft className="text-[#FF004F] w-8 h-8 mb-6 opacity-40" />
                          <p className="text-[#3c3e41] mb-6 leading-relaxed font-light flex-grow">
                            {testimonial.feedback}
                          </p>
                          <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[#d1d9e6]">
                            <div className="w-12 h-12 bg-[#ECF0F3] rounded-full flex items-center justify-center shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                              <FaUser className="text-[#FF004F] w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-base text-[#1f2125]">
                                {testimonial.name}
                              </div>
                              <div className="text-sm text-[#3c3e41] flex items-center gap-1.5">
                                <FaBuilding className="w-3 h-3" />
                                {testimonial.company}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {service.testimonials.length > 3 && (
                  <>
                    <button
                      onClick={scrollPrev}
                      className="absolute top-1/2 -translate-y-1/2 -left-4 w-12 h-12 bg-[#ECF0F3] rounded-full flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#FF004F] transition-all duration-300 z-10 lg:flex"
                      aria-label="Previous Testimonial"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={scrollNext}
                      className="absolute top-1/2 -translate-y-1/2 -right-4 w-12 h-12 bg-[#ECF0F3] rounded-full flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#FF004F] transition-all duration-300 z-10 lg:flex"
                      aria-label="Next Testimonial"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20">
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
                  className="bg-[#ECF0F3] rounded-2xl shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-8 h-8 flex-shrink-0 bg-[#ECF0F3] rounded-full flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]">
                        <FaQuestionCircle className="text-[#FF004F] w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[#1f2125] pt-1">
                        {faq.question}
                      </span>
                    </div>
                    <div className="w-8 h-8 flex-shrink-0 bg-[#ECF0F3] rounded-full flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#FF004F] transition-transform duration-300">
                      {expandedFaq === idx ? <FaMinus /> : <FaPlus />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <p className="text-[#3c3e41] leading-relaxed pl-12 border-l-2 border-[#d1d9e6] ml-4">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-20">
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
                  className="bg-[#ECF0F3] text-[#FF004F] px-8 py-4 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 text-center cursor-pointer"
                >
                  View Pricing
                </button>
              </div>
            </motion.div>
          </div>
        </section> */}
      </div>

      {/* Project Detail Modal - FULLY UPDATED */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
          >
            <motion.div
              className="bg-[#ECF0F3] rounded-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden"
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6]">
                <span className="text-xs font-medium text-[#FF004F] uppercase tracking-wider">
                  Project Details
                </span>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#FF004F] hover:text-[#e6003d] transition-colors duration-300"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[calc(80vh-100px)] overflow-y-auto">
                {/* Left: Image Slider */}
                <div className="relative bg-[#ECF0F3] p-6">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                    <Image
                      src={
                        selectedProject.images
                          ? selectedProject.images[currentImageIndex]
                          : selectedProject.image
                      }
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                    {selectedProject.images &&
                      selectedProject.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage();
                            }}
                            disabled={currentImageIndex === 0}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage();
                            }}
                            disabled={
                              currentImageIndex ===
                              selectedProject.images.length - 1
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          >
                            <FaChevronRight />
                          </button>
                        </>
                      )}
                  </div>
                </div>

                {/* Right: Project Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#1f2125] mb-2">
                      {selectedProject.title}
                    </h2>
                    <p className="text-[#3c3e41] leading-relaxed text-sm">
                      {selectedProject.longDescription}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                      <div className="flex items-center gap-2 text-[#FF004F] mb-1">
                        <FaUser className="w-3 h-3" />
                        <span className="text-xs font-medium">Client</span>
                      </div>
                      <p className="text-[#1f2125] font-semibold text-sm">
                        {selectedProject.client}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                      <div className="flex items-center gap-2 text-[#FF004F] mb-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span className="text-xs font-medium">Date</span>
                      </div>
                      <p className="text-[#1f2125] font-semibold text-sm">
                        {selectedProject.date}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                      <div className="flex items-center gap-2 text-[#FF004F] mb-1">
                        <FaCog className="w-3 h-3" />
                        <span className="text-xs font-medium">Services</span>
                      </div>
                      <p className="text-[#1f2125] font-semibold text-sm">
                        {selectedProject.services}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#ECF0F3] shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                      <div className="flex items-center gap-2 text-[#FF004F] mb-1">
                        <FaDollarSign className="w-3 h-3" />
                        <span className="text-xs font-medium">Budget</span>
                      </div>
                      <p className="text-[#1f2125] font-semibold text-sm">
                        {selectedProject.budget}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2125] mb-2">
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedProject.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-lg bg-[#ECF0F3] shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff]"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#FF004F]"></div>
                          <span className="text-[#3c3e41] text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <Link
                      href="/contact"
                      className="flex-1 bg-[#FF004F] text-white py-2.5 px-6 rounded-lg font-semibold text-center hover:bg-[#e6003d] transition-colors duration-300 text-sm"
                    >
                      HIRE ME
                    </Link>
                    <button
                      onClick={(e) => handleLove(selectedProject.id, e)}
                      className="px-4 py-2.5 rounded-lg bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center gap-2 text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300"
                    >
                      <FaHeart />
                      <span>
                        {loves[selectedProject.id] || selectedProject.likes}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        serviceTitle={service.title}
        packageName={activePricing}
        packagePrice={service.pricing[activePricing].price}
      />
    </>
  );
}
