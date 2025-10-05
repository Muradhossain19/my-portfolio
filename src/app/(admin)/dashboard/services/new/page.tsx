"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  FaSave,
  FaArrowLeft,
  FaImage,
  FaPlus,
  FaTimes,
  FaDollarSign,
  FaCheck,
  FaFolder,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import portfolioData from "@/components/PortfolioSection/PortfolioData";

interface ServiceForm {
  title: string;
  subtitle: string;
  slug: string;
  image: string;
  hero_description: string;
  overview: string;
  features: string[];
  process: Array<{
    title: string;
    description: string;
  }>;
  benefits: string[];
  technologies: string[];
  portfolio_examples: Array<{
    id: string;
    title: string;
    image: string;
    images: string[];
    description: string;
    longDescription: string;
    client: string;
    date: string;
    services: string;
    budget: string;
    likes: number;
    link: string;
    features: string[];
  }>;
  pricing: {
    basic: { price: string; features: string[] };
    standard: { price: string; features: string[] };
    premium: { price: string; features: string[] };
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  testimonials: Array<{
    name: string;
    company: string;
    feedback: string;
    rating: number;
  }>;
  why_choose: string[];
  delivery_time: string;
  guarantee: string;
  is_active: boolean;
}

const AddNewService = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ServiceForm>({
    title: "",
    subtitle: "",
    slug: "",
    image: "",
    hero_description: "",
    overview: "",
    features: [],
    process: [{ title: "", description: "" }],
    benefits: [],
    technologies: [],
    portfolio_examples: [],
    pricing: {
      basic: { price: "", features: [] },
      standard: { price: "", features: [] },
      premium: { price: "", features: [] },
    },
    faqs: [{ question: "", answer: "" }],
    testimonials: [],
    why_choose: [],
    delivery_time: "",
    guarantee: "",
    is_active: false,
  });

  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newWhyChoose, setNewWhyChoose] = useState("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }));
      setNewTechnology("");
    }
  };

  const removeTechnology = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addWhyChoose = () => {
    if (newWhyChoose.trim()) {
      setFormData((prev) => ({
        ...prev,
        why_choose: [...prev.why_choose, newWhyChoose.trim()],
      }));
      setNewWhyChoose("");
    }
  };

  const removeWhyChoose = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      why_choose: prev.why_choose.filter((_, i) => i !== index),
    }));
  };

  const addPricingFeature = (tier: "basic" | "standard" | "premium") => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [tier]: {
          ...prev.pricing[tier],
          features: [...prev.pricing[tier].features, ""],
        },
      },
    }));
  };

  const updatePricingFeature = (
    tier: "basic" | "standard" | "premium",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [tier]: {
          ...prev.pricing[tier],
          features: prev.pricing[tier].features.map((feature, i) =>
            i === index ? value : feature
          ),
        },
      },
    }));
  };

  const removePricingFeature = (
    tier: "basic" | "standard" | "premium",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [tier]: {
          ...prev.pricing[tier],
          features: prev.pricing[tier].features.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const addProcess = () => {
    setFormData((prev) => ({
      ...prev,
      process: [...prev.process, { title: "", description: "" }],
    }));
  };

  const updateProcess = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      process: prev.process.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeProcess = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      process: prev.process.filter((_, i) => i !== index),
    }));
  };

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const updateFAQ = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (is_active: boolean) => {
    setSaving(true);
    try {
      const serviceData = {
        ...formData,
        is_active,
        pricing: {
          basic: {
            price: formData.pricing.basic.price,
            features: formData.pricing.basic.features.filter((f) => f.trim()),
          },
          standard: {
            price: formData.pricing.standard.price,
            features: formData.pricing.standard.features.filter((f) =>
              f.trim()
            ),
          },
          premium: {
            price: formData.pricing.premium.price,
            features: formData.pricing.premium.features.filter((f) => f.trim()),
          },
        },
        process: formData.process.filter(
          (p) => p.title.trim() && p.description.trim()
        ),
        faqs: formData.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      };

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/dashboard/services");
      } else {
        throw new Error(result.error || "Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/services"
            className="w-10 h-10 bg-[#ECF0F3] rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300"
          >
            <FaArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1f2125]">
              Add New Service
            </h1>
            <p className="text-[#3c3e41]">Create a new service offering</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-[#ECF0F3] text-[#3c3e41] px-6 py-3 rounded-xl font-medium shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                Publish Service
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-8">
        {/* Basic Information */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#1f2125] font-semibold mb-3">
                Service Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Web Development"
                className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
                required
              />
            </div>
            <div>
              <label className="block text-[#1f2125] font-semibold mb-3">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="web-development"
                className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#1f2125] font-semibold mb-3">
                Subtitle *
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subtitle: e.target.value,
                  }))
                }
                placeholder="Brief description of your service"
                className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#1f2125] font-semibold mb-3">
                Service Image URL *
              </label>
              <div className="relative">
                <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41]/70 w-4 h-4" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-12 pr-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
                  required
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Service Description
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[#1f2125] font-semibold mb-3">
                Hero Description *
              </label>
              <textarea
                value={formData.hero_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero_description: e.target.value,
                  }))
                }
                placeholder="Compelling description for the hero section"
                rows={3}
                className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)] resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-[#1f2125] font-semibold mb-3">
                Service Overview *
              </label>
              <textarea
                value={formData.overview}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    overview: e.target.value,
                  }))
                }
                placeholder="Detailed overview of your service"
                rows={4}
                className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)] resize-none"
                required
              />
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Service Features
          </h2>
          <div className="space-y-4">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <FaCheck className="text-[#FF004F] w-4 h-4 flex-shrink-0" />
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...formData.features];
                    newFeatures[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      features: newFeatures,
                    }));
                  }}
                  className="flex-1 px-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] transition-all duration-300"
                />
                <button
                  onClick={() => removeFeature(index)}
                  className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors duration-300"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <FaPlus className="text-[#FF004F] w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addFeature()}
                placeholder="Add a new feature..."
                className="flex-1 px-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300"
              />
              <button
                onClick={addFeature}
                className="w-8 h-8 bg-[#FF004F] rounded-lg flex items-center justify-center text-white hover:bg-[#e6003d] transition-colors duration-300"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Technologies Used
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-[#ECF0F3] text-[#3c3e41] px-3 py-1 rounded-full text-sm font-medium shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] flex items-center gap-2"
                >
                  {tech}
                  <button
                    onClick={() => removeTechnology(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTechnology()}
                placeholder="Add a technology..."
                className="flex-1 px-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300"
              />
              <button
                onClick={addTechnology}
                className="w-8 h-8 bg-[#FF004F] rounded-lg flex items-center justify-center text-white hover:bg-[#e6003d] transition-colors duration-300"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Service Benefits
          </h2>
          <div className="space-y-4">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <FaCheck className="text-green-500 w-4 h-4 flex-shrink-0" />
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => {
                    const newBenefits = [...formData.benefits];
                    newBenefits[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      benefits: newBenefits,
                    }));
                  }}
                  className="flex-1 px-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] transition-all duration-300"
                />
                <button
                  onClick={() => removeBenefit(index)}
                  className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors duration-300"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <FaPlus className="text-green-500 w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                placeholder="Add a benefit..."
                className="flex-1 px-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300"
              />
              <button
                onClick={addBenefit}
                className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white hover:bg-green-600 transition-colors duration-300"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Process */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Work Process
          </h2>
          <div className="space-y-6">
            {formData.process.map((step, index) => (
              <div
                key={index}
                className="bg-[#ECF0F3] rounded-xl p-6 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1f2125]">
                    Step {index + 1}
                  </h3>
                  <button
                    onClick={() => removeProcess(index)}
                    className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors duration-300"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) =>
                      updateProcess(index, "title", e.target.value)
                    }
                    placeholder="Process step title"
                    className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300"
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) =>
                      updateProcess(index, "description", e.target.value)
                    }
                    placeholder="Process step description"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addProcess}
              className="w-full py-4 bg-[#ECF0F3] rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#FF004F] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            >
              <FaPlus className="w-4 h-4" />
              Add Process Step
            </button>
          </div>
        </motion.div>

        {/* Why Choose */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Why Choose Us
          </h2>
          <div className="space-y-4">
            {formData.why_choose.map((reason, index) => (
              <div key={index} className="flex items-center gap-3">
                <FaCheck className="text-blue-500 w-4 h-4 flex-shrink-0" />
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => {
                    const newReasons = [...formData.why_choose];
                    newReasons[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      why_choose: newReasons,
                    }));
                  }}
                  className="flex-1 px-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] transition-all duration-300"
                />
                <button
                  onClick={() => removeWhyChoose(index)}
                  className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors duration-300"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <FaPlus className="text-blue-500 w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                value={newWhyChoose}
                onChange={(e) => setNewWhyChoose(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addWhyChoose()}
                placeholder="Add a reason to choose us..."
                className="flex-1 px-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300"
              />
              <button
                onClick={addWhyChoose}
                className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors duration-300"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Examples Section */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Portfolio Examples
          </h2>

          {/* Available Portfolio Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1f2125] mb-4">
              Available Portfolio Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2 bg-[#ECF0F3] rounded-xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
              {portfolioData
                .filter(
                  (item) =>
                    formData.title &&
                    (item.category
                      .toLowerCase()
                      .includes(formData.title.toLowerCase()) ||
                      item.services
                        .toLowerCase()
                        .includes(formData.title.toLowerCase()) ||
                      item.title
                        .toLowerCase()
                        .includes(formData.title.toLowerCase()))
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] cursor-pointer hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all duration-300"
                    onClick={() => {
                      const portfolioItem = {
                        id: String(item.id),
                        title: item.title,
                        description: item.description,
                        longDescription: item.longDescription,
                        image: item.images[0] || "",
                        images: item.images,
                        client: item.client,
                        date: item.date,
                        services: item.services,
                        budget: item.budget,
                        likes: item.likes,
                        link: item.link,
                        features: item.features,
                      };

                      const isAlreadyAdded = formData.portfolio_examples.some(
                        (p) => p.id === portfolioItem.id
                      );
                      if (!isAlreadyAdded) {
                        setFormData((prev) => ({
                          ...prev,
                          portfolio_examples: [
                            ...prev.portfolio_examples,
                            portfolioItem,
                          ],
                        }));
                      }
                    }}
                  >
                    <div className="relative h-24 mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="text-sm font-semibold text-[#1f2125] mb-1 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#3c3e41]">{item.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[#FF004F]">
                        {item.client}
                      </span>
                      <button
                        type="button"
                        className="text-xs bg-[#FF004F] text-white px-2 py-1 rounded hover:bg-[#e6003d] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Selected Portfolio Items */}
          <div>
            <h3 className="text-lg font-semibold text-[#1f2125] mb-4">
              Selected Portfolio Items ({formData.portfolio_examples.length})
            </h3>
            {formData.portfolio_examples.length === 0 ? (
              <div className="text-center py-8 text-[#3c3e41]">
                <FaFolder className="w-12 h-12 mx-auto mb-4 text-[#d1d9e6]" />
                <p>No portfolio items selected</p>
                <p className="text-sm mt-1">
                  Select from available items above
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.portfolio_examples.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#ECF0F3] rounded-xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#1f2125] mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#3c3e41] mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#FF004F]">
                            {item.client}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                portfolio_examples:
                                  prev.portfolio_examples.filter(
                                    (_, i) => i !== index
                                  ),
                              }));
                            }}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {formData.faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#ECF0F3] rounded-xl p-6 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1f2125]">
                    FAQ {index + 1}
                  </h3>
                  <button
                    onClick={() => removeFAQ(index)}
                    className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors duration-300"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) =>
                      updateFAQ(index, "question", e.target.value)
                    }
                    placeholder="FAQ question"
                    className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                    placeholder="FAQ answer"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addFAQ}
              className="w-full py-4 bg-[#ECF0F3] rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] text-[#FF004F] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            >
              <FaPlus className="w-4 h-4" />
              Add FAQ
            </button>
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Pricing Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["basic", "standard", "premium"] as const).map((tier) => (
              <div
                key={tier}
                className="bg-[#ECF0F3] rounded-xl p-6 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
              >
                <h3 className="text-lg font-bold text-[#1f2125] mb-4 capitalize">
                  {tier}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#1f2125] font-semibold mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41]/70 w-4 h-4" />
                      <input
                        type="text"
                        value={formData.pricing[tier].price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              [tier]: {
                                ...prev.pricing[tier],
                                price: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="$500 - $1,500"
                        className="w-full pl-12 pr-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_rgba(209,217,230,0.8),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#1f2125] font-semibold mb-2">
                      Features
                    </label>
                    <div className="space-y-2">
                      {formData.pricing[tier].features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) =>
                              updatePricingFeature(tier, index, e.target.value)
                            }
                            placeholder="Feature description"
                            className="flex-1 px-3 py-1 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_2px_2px_4px_rgba(209,217,230,0.8),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 text-sm"
                          />
                          <button
                            onClick={() => removePricingFeature(tier, index)}
                            className="w-6 h-6 bg-[#ECF0F3] rounded-lg shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors duration-300"
                          >
                            <FaTimes className="w-2 h-2" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addPricingFeature(tier)}
                        className="w-full py-2 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] text-[#FF004F] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      >
                        <FaPlus className="w-3 h-3" />
                        Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Details */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
        >
          <h2 className="text-xl font-bold text-[#1f2125] mb-6">
            Additional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#1f2125] font-semibold mb-3">
                Delivery Time *
              </label>
              <input
                type="text"
                value={formData.delivery_time}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    delivery_time: e.target.value,
                  }))
                }
                placeholder="e.g., 2-8 weeks"
                className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
                required
              />
            </div>
            <div>
              <label className="block text-[#1f2125] font-semibold mb-3">
                Guarantee *
              </label>
              <input
                type="text"
                value={formData.guarantee}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guarantee: e.target.value,
                  }))
                }
                placeholder="e.g., 100% satisfaction guarantee"
                className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
                required
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddNewService;
