"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import {
  FaSave,
  FaArrowLeft,
  FaImage,
  FaPlus,
  FaTimes,
  FaDollarSign,
  FaCheck,
  FaTrash,
  FaEye,
  FaFolder,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import portfolioData from "@/components/PortfolioSection/PortfolioData";

interface ServiceForm {
  id: string;
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
    description: string;
    longDescription: string;
    image: string;
    images: string[];
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
  created_at: string;
  updated_at: string;
}

const EditService = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [formData, setFormData] = useState<ServiceForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newWhyChoose, setNewWhyChoose] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${serviceId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          console.log("Raw service data:", data.service); // Debug log
          console.log("API থেকে আসা updated_at:", data.service.updated_at);
          // Parse JSON fields with better error handling
          const service = {
            ...data.service,
            features: safeJsonParse(data.service.features, []),
            process: safeJsonParse(data.service.process, []),
            benefits: safeJsonParse(data.service.benefits, []),
            technologies: safeJsonParse(data.service.technologies, []),
            portfolio_examples: safeJsonParse(
              data.service.portfolio_examples,
              []
            ),
            pricing: safeJsonParse(data.service.pricing, {
              basic: { price: "", features: [] },
              standard: { price: "", features: [] },
              premium: { price: "", features: [] },
            }),
            faqs: safeJsonParse(data.service.faqs, []),
            testimonials: safeJsonParse(data.service.testimonials, []),
            why_choose: safeJsonParse(data.service.why_choose, []),
          };

          console.log("Parsed service data:", service);

          setFormData(service);
        } else {
          throw new Error(data.error || "Service not found");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        alert("Error loading service. Please try again.");
        router.push("/dashboard/services");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId, router]);

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
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      title: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && formData) {
      setFormData((prev) => ({
        ...prev!,
        features: [...prev!.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      features: prev!.features.filter((_, i) => i !== index),
    }));
  };

  const addTechnology = () => {
    if (newTechnology.trim() && formData) {
      setFormData((prev) => ({
        ...prev!,
        technologies: [...prev!.technologies, newTechnology.trim()],
      }));
      setNewTechnology("");
    }
  };

  const removeTechnology = (index: number) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      technologies: prev!.technologies.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && formData) {
      setFormData((prev) => ({
        ...prev!,
        benefits: [...prev!.benefits, newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      benefits: prev!.benefits.filter((_, i) => i !== index),
    }));
  };

  const addWhyChoose = () => {
    if (newWhyChoose.trim() && formData) {
      setFormData((prev) => ({
        ...prev!,
        why_choose: [...prev!.why_choose, newWhyChoose.trim()],
      }));
      setNewWhyChoose("");
    }
  };

  const removeWhyChoose = (index: number) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      why_choose: prev!.why_choose.filter((_, i) => i !== index),
    }));
  };

  const addPricingFeature = (tier: "basic" | "standard" | "premium") => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      pricing: {
        ...prev!.pricing,
        [tier]: {
          ...prev!.pricing[tier],
          features: [...(prev!.pricing[tier]?.features || []), ""],
        },
      },
    }));
  };

  const updatePricingFeature = (
    tier: "basic" | "standard" | "premium",
    index: number,
    value: string
  ) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      pricing: {
        ...prev!.pricing,
        [tier]: {
          ...prev!.pricing[tier],
          features: prev!.pricing[tier].features.map((feature, i) =>
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
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      pricing: {
        ...prev!.pricing,
        [tier]: {
          ...prev!.pricing[tier],
          features: prev!.pricing[tier].features.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const addProcess = () => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      process: [...prev!.process, { title: "", description: "" }],
    }));
  };

  const updateProcess = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      process: prev!.process.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeProcess = (index: number) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      process: prev!.process.filter((_, i) => i !== index),
    }));
  };

  const addFAQ = () => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      faqs: [...prev!.faqs, { question: "", answer: "" }],
    }));
  };

  const updateFAQ = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      faqs: prev!.faqs.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeFAQ = (index: number) => {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      faqs: prev!.faqs.filter((_, i) => i !== index),
    }));
  };

  // Image upload handler (for preview only, not actual upload)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    setImageUploading(true);

    // Show preview (base64)
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev!,
        image: reader.result as string,
      }));
      setImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (is_active?: boolean) => {
    if (!formData) return;

    setSaving(true);
    console.log("🔄 Starting save process...");
    console.log("🎯 Service ID:", serviceId);
    try {
      // created_at, updated_at বাদ দিন utility দিয়ে
      const rest = omit(formData, ["created_at", "updated_at"]);

      const serviceData = {
        ...rest,
        is_active: is_active !== undefined ? is_active : formData.is_active,
        pricing: {
          basic: {
            price: formData.pricing.basic?.price || "",
            features:
              formData.pricing.basic?.features.filter((f) => f.trim()) || [],
          },
          standard: {
            price: formData.pricing.standard?.price || "",
            features:
              formData.pricing.standard?.features.filter((f) => f.trim()) || [],
          },
          premium: {
            price: formData.pricing.premium?.price || "",
            features:
              formData.pricing.premium?.features.filter((f) => f.trim()) || [],
          },
        },
        process: formData.process.filter(
          (p) => p.title.trim() && p.description.trim()
        ),
        faqs: formData.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      };

      console.log("📦 Service data prepared:", Object.keys(serviceData));
      console.log("🌐 Making API call to:", `/api/services/${serviceId}`);

      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (result.success && result.service) {
        // --- নতুন পরিবর্তন ---
        // API থেকে পাওয়া নতুন ডেটা দিয়ে স্টেট আপডেট করুন
        const updatedService = {
          ...result.service,
          // JSON স্ট্রিং গুলোকে আবার অবজেক্টে পার্স করুন
          features: safeJsonParse(result.service.features, []),
          process: safeJsonParse(result.service.process, []),
          benefits: safeJsonParse(result.service.benefits, []),
          technologies: safeJsonParse(result.service.technologies, []),
          portfolio_examples: safeJsonParse(
            result.service.portfolio_examples,
            []
          ),
          pricing: safeJsonParse(result.service.pricing, {
            /* fallback */
          }),
          faqs: safeJsonParse(result.service.faqs, []),
          testimonials: safeJsonParse(result.service.testimonials, []),
          why_choose: safeJsonParse(result.service.why_choose, []),
        };
        setFormData(updatedService); // সরাসরি স্টেট আপডেট

        // একটি সফল বার্তা দেখাতে পারেন
        alert("Service updated successfully!");

        // যদি আপনি পেজ পরিবর্তন করতে চান, তাহলে করতে পারেন
        // router.push("/dashboard/services");
        // router.refresh(); // অথবা Next.js 13+ এর জন্য ক্যাশ ক্লিয়ার করতে
      } else {
        throw new Error(result.error || "Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Error updating service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/services");
      } else {
        throw new Error("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff]">
          <div className="w-12 h-12 border-4 border-[#FF004F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3c3e41] text-center">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff]">
          <p className="text-[#3c3e41] text-center">Service not found</p>
        </div>
      </div>
    );
  }

  function formatDate(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Dhaka",
    });
  }

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
            <h1 className="text-2xl font-bold text-[#1f2125]">Edit Service</h1>
            <p className="text-[#3c3e41]">
              Editing: <span className="font-semibold">{formData.title}</span>
            </p>
            <p className="text-xs text-[#3c3e41]">
              Last updated:<span>{formatDate(formData.updated_at)}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Preview Button */}
          <Link
            href={`/services/${formData.slug}`}
            target="_blank"
            className="bg-[#ECF0F3] text-[#3c3e41] px-4 py-3 rounded-xl font-medium shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 flex items-center gap-2"
          >
            <FaEye className="w-4 h-4" />
            Preview
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex items-center gap-2"
          >
            <FaTrash className="w-4 h-4" />
            Delete
          </button>

          {/* Status Actions */}
          {!formData.is_active ? (
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  Publish
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-yellow-600 transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex items-center gap-2 disabled:opacity-50"
            >
              Unpublish
            </button>
          )}

          {/* Save Changes */}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-[#3c3e41] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2a2c30] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            formData.is_active
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {formData.is_active ? "Active" : "Draft"}
        </span>
        <span className="text-sm text-[#3c3e41]">
          Created: {formatDate(formData.created_at)}
        </span>
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
                  setFormData((prev) => ({ ...prev!, slug: e.target.value }))
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
                    ...prev!,
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
                Service Image *
              </label>
              <div className="relative flex items-center gap-4">
                <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41]/70 w-4 h-4" />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev!,
                      image: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-12 pr-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="ml-2 px-4 py-2 bg-[#FF004F] text-white rounded-lg hover:bg-[#e6003d] transition"
                  disabled={imageUploading}
                >
                  {imageUploading ? "Uploading..." : "Upload"}
                </button>
                <Image
                  src={formData.image}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg border ml-4"
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
                    ...prev!,
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
                    ...prev!,
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
                      ...prev!,
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
                      ...prev!,
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
                      ...prev!,
                      why_choose: newReasons,
                    }));
                  }}
                  className="flex-1 px-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] text-[#1f2125] transition-all duration-300"
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
                className="flex-1 px-4 py-2 bg-[#ECF0F3] rounded-lg border-none outline-none shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300"
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
                    formData?.title &&
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
                      if (!formData) return;

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
                          ...prev!,
                          portfolio_examples: [
                            ...prev!.portfolio_examples,
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
              Selected Portfolio Items (
              {formData?.portfolio_examples.length || 0})
            </h3>
            {!formData?.portfolio_examples ||
            formData.portfolio_examples.length === 0 ? (
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
                              if (!formData) return;
                              setFormData((prev) => ({
                                ...prev!,
                                portfolio_examples:
                                  prev!.portfolio_examples.filter(
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
                    className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_3px_3px_10px_rgba(209,217,230,0.8),inset_-3px_-3px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                    placeholder="FAQ answer"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_3px_3px_10px_rgba(209,217,230,0.8),inset_-3px_-3px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 resize-none"
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
                        value={formData.pricing[tier]?.price || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev!,
                            pricing: {
                              ...prev!.pricing,
                              [tier]: {
                                ...prev!.pricing[tier],
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
                      {(formData.pricing[tier]?.features || []).map(
                        (feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) =>
                                updatePricingFeature(
                                  tier,
                                  index,
                                  e.target.value
                                )
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
                        )
                      )}
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
                    ...prev!,
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
                    ...prev!,
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#ECF0F3] rounded-2xl p-8 max-w-md mx-4 shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff]"
          >
            <h3 className="text-xl font-bold text-[#1f2125] mb-4">
              Delete Service
            </h3>
            <p className="text-[#3c3e41] mb-6">
              Are you sure you want to delete &quot;{formData.title}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-[#ECF0F3] text-[#3c3e41] px-4 py-3 rounded-xl font-medium shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default EditService;

function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON parsing error:", error);
    return fallback;
  }
}

function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const clone = { ...obj };
  keys.forEach((key) => {
    delete clone[key];
  });
  return clone;
}

// এই function টি component এর বাইরে বা ভিতরে যোগ করুন

// const getMatchingPortfolioItems = (serviceTitle: string) => {
//   const serviceCategoryMap: Record<string, string> = {
//     "web development": "Web Development",
//     wordpress: "WordPress",
//     "e-commerce": "E-commerce",
//     ecommerce: "E-commerce",
//   };

//   const lowerTitle = serviceTitle.toLowerCase();
//   const matchedCategory = Object.keys(serviceCategoryMap).find((key) =>
//     lowerTitle.includes(key)
//   );

//   if (matchedCategory) {
//     const category = serviceCategoryMap[matchedCategory];
//     return portfolioData.filter(
//       (item) =>
//         item.category === category ||
//         item.services.toLowerCase().includes(category.toLowerCase())
//     );
//   }

//   return portfolioData.filter(
//     (item) =>
//       item.title.toLowerCase().includes(lowerTitle) ||
//       item.services.toLowerCase().includes(lowerTitle) ||
//       item.category.toLowerCase().includes(lowerTitle)
//   );
// };
