"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

interface ContactFormProps {
  serviceTitle: string;
  packageName: string;
  packagePrice: string; // নতুন prop
}

const ContactForm: React.FC<ContactFormProps> = ({
  serviceTitle,
  packageName,
  packagePrice, // নতুন prop
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    price: packagePrice, // নতুন ফিল্ড
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Auto-fill subject and price based on props
    const subject = `Inquiry for ${
      packageName.charAt(0).toUpperCase() + packageName.slice(1)
    } package - ${serviceTitle}`;
    setFormData((prev) => ({
      ...prev,
      subject,
      price: packagePrice, // প্যাকেজের দাম সেট করুন
    }));
  }, [serviceTitle, packageName, packagePrice]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          price: formData.price,
        }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: `Inquiry for ${
            packageName.charAt(0).toUpperCase() + packageName.slice(1)
          } package - ${serviceTitle}`,
          message: "",
          price: packagePrice,
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitStatus === "success" && (
        <motion.div
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaCheckCircle className="text-green-500 w-5 h-5" />
          <span className="text-green-800">
            Thank you! Your message has been sent successfully.
          </span>
        </motion.div>
      )}
      {submitStatus === "error" && (
        <motion.div
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationTriangle className="text-red-500 w-5 h-5" />
          <span className="text-red-800">
            Sorry, an error occurred. Please try again.
          </span>
        </motion.div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#1f2125] font-semibold mb-2">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={`w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff] ${
                  errors.name ? "border-red-300" : ""
                }`}
              />
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-[#1f2125] font-semibold mb-2">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff] ${
                  errors.email ? "border-red-300" : ""
                }`}
              />
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>
        {/* Phone and Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#1f2125] font-semibold mb-2">
              Phone Number{" "}
              <span className="text-[#3c3e41] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1700 000000"
                className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff]"
              />
              <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
            </div>
          </div>
          <div>
            <label className="block text-[#1f2125] font-semibold mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              className={`w-full px-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff] ${
                errors.subject ? "border-red-300" : ""
              }`}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
        </div>
        {/* Price Field */}
        <div>
          <label className="block text-[#1f2125] font-semibold mb-2">
            Price
          </label>
          <div className="relative">
            <input
              type="text"
              name="price"
              value={formData.price}
              readOnly
              className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff]"
            />
            {/* You can use an icon here if you want */}
          </div>
        </div>
        {/* Message */}
        <div>
          <label className="block text-[#1f2125] font-semibold mb-2">
            Message *
          </label>
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project, goals, or any questions..."
              rows={5}
              className={`w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff] resize-none ${
                errors.message ? "border-red-300" : ""
              }`}
            />
            <FaComment className="absolute left-4 top-4 text-[#3c3e41] w-4 h-4" />
          </div>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>
        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-8 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer ${
            isSubmitting
              ? "bg-[#3c3e41]"
              : "bg-[#FF004F] hover:bg-[#e6003d] shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[8px_8px_20px_#d1d9e6,-8px_-8px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
          }`}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </>
          ) : (
            <>
              <FaPaperPlane className="w-4 h-4" />
              Submit Order
            </>
          )}
        </motion.button>
      </form>
    </>
  );
};

export default ContactForm;
