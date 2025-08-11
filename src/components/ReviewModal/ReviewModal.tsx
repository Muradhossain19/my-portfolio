import React, { useState } from "react";
import {
  FaUser,
  FaBriefcase,
  FaBuilding,
  FaClipboardList,
  FaCalendarAlt,
  FaStar,
  FaComment,
  FaPaperPlane,
  FaTimes,
  FaImage,
} from "react-icons/fa";
import { services } from "@/app/services/[slug]/ServiceData";

const currentDate = new Date();
const monthYear = currentDate.toLocaleString("default", {
  month: "long",
  year: "numeric",
});

interface ReviewForm {
  name: string;
  position: string;
  company: string;
  project: string;
  image: File | null;
  date: string;
  rating: number;
  testimonial: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: ReviewForm) => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [form, setForm] = useState<ReviewForm>({
    name: "",
    position: "",
    company: "",
    project: "",
    image: null,
    date: monthYear,
    rating: 5,
    testimonial: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRating = (r: number) =>
    setForm((prev) => ({ ...prev, rating: r }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#ECF0F3] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[20px_20px_40px_#00000033] relative">
        {/* Sticky Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6] flex-shrink-0 sticky top-0 bg-[#ECF0F3] z-10">
          <h2 className="text-2xl font-bold text-[#1f2125] text-center w-full">
            Write a Review
          </h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 w-10 h-10 rounded-full bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#FF004F] hover:text-[#e6003d] transition-colors duration-300"
          >
            <FaTimes />
          </button>
        </div>
        {/* Scrollable Form */}
        <div className="p-8 overflow-y-auto flex-1">
          {success ? (
            <div className="text-center text-[#FF004F] font-semibold py-8">
              Thank you for your review!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff]"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
                </div>
              </div>
              {/* Designation */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-2">
                  Designation *
                </label>
                <div className="relative">
                  <input
                    name="position"
                    type="text"
                    required
                    placeholder="Your Designation"
                    className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff]"
                    value={form.position}
                    onChange={handleChange}
                  />
                  <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
                </div>
              </div>
              {/* Company Name */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <input
                    name="company"
                    type="text"
                    required
                    placeholder="Company Name"
                    className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff]"
                    value={form.company}
                    onChange={handleChange}
                  />
                  <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
                </div>
              </div>
              {/* Service Taken */}
              <div>
                <label
                  htmlFor="project"
                  className="block text-[#1f2125] font-semibold mb-2"
                >
                  Service Taken *
                </label>
                <div className="relative">
                  <select
                    id="project"
                    name="project"
                    required
                    value={form.project}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff] appearance-none"
                    aria-label="Service Taken"
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <FaClipboardList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4 pointer-events-none" />
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-2">
                  Upload Image
                </label>
                <div className="relative">
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleChange}
                  />
                  <div className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] font-light transition-all duration-300 flex items-center cursor-pointer">
                    <FaImage className="mr-3 text-[#3c3e41] w-5 h-5" />
                    <span>{form.image ? form.image.name : "Choose File"}</span>
                  </div>
                </div>
              </div>
              {/* Date */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    name="date"
                    type="text"
                    value={form.date}
                    readOnly
                    className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff]"
                  />
                  <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
                </div>
              </div>
              {/* Rating */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-2">
                  Rating *
                </label>
                <div className="flex gap-2 items-center pl-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <FaStar
                      key={r}
                      className={`w-6 h-6 cursor-pointer ${
                        r <= form.rating ? "text-[#FF004F]" : "text-gray-300"
                      }`}
                      onClick={() => handleRating(r)}
                    />
                  ))}
                </div>
              </div>
              {/* Testimonial Message */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-2">
                  Testimonial Message *
                </label>
                <div className="relative">
                  <textarea
                    name="testimonial"
                    required
                    placeholder="Your feedback..."
                    rows={4}
                    className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41] font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff] resize-none"
                    value={form.testimonial}
                    onChange={handleChange}
                  />
                  <FaComment className="absolute left-4 top-4 text-[#3c3e41] w-4 h-4" />
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-8 rounded-xl font-semibold text-white bg-[#FF004F] hover:bg-[#e6003d] shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
              >
                <FaPaperPlane className="w-4 h-4" />
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
