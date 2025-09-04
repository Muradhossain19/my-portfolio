import React, { useState, useRef } from "react";
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
  FaChevronDown,
} from "react-icons/fa";
import { services } from "@/app/services/[slug]/ServiceData";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

// Month list for current year only
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const months = monthNames
  .slice(0, currentDate.getMonth() + 1)
  .map((m) => `${m} ${currentYear}`);

// const months: string[] = [];
// const years = [2023, currentYear];
// years.forEach((year) => {
//   const lastMonth =
//     year === currentYear ? currentDate.getMonth() : 11; // 0-indexed
//   for (let m = 0; m <= lastMonth; m++) {
//     months.push(`${monthNames[m]} ${year}`);
//   }
// });

// Default date: current month
const defaultMonth = `${monthNames[currentDate.getMonth()]} ${currentYear}`;

// Custom dropdown component
function CustomDropdown({
  options,
  value,
  onChange,
  icon,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="w-full pl-12 pr-8 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] font-light flex items-center justify-between cursor-pointer transition-all duration-300"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center gap-2">
          {icon}
          {value || <span className="text-gray-400">{placeholder}</span>}
        </span>
        <FaChevronDown
          className={`ml-2 w-4 h-4 text-[#3c3e41] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full w-full mt-2 bg-[#ECF0F3] rounded-xl shadow-lg z-20 border border-[#d1d9e6]">
          {options.map((opt) => (
            <div
              key={opt}
              className={`px-5 py-3 cursor-pointer hover:bg-[#FF004F]/10 hover:text-[#FF004F] text-[#1f2125] transition-colors duration-200 ${
                value === opt ? "bg-[#FF004F]/10 text-[#FF004F]" : ""
              }`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
    date: defaultMonth, // auto detect current month
    rating: 5,
    testimonial: "",
  });
  const [success, setSuccess] = useState(false);
  const [dateError, setDateError] = useState("");

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
    if (name === "date") setDateError("");
  };

  const handleCustomChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "date") setDateError("");
  };

  const handleRating = (r: number) =>
    setForm((prev) => ({ ...prev, rating: r }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Date validation: future month not allowed
    const selectedDate = new Date(form.date + " 1");
    if (
      selectedDate.getFullYear() > currentDate.getFullYear() ||
      (selectedDate.getFullYear() === currentDate.getFullYear() &&
        selectedDate.getMonth() > currentDate.getMonth())
    ) {
      setDateError("Future month is not allowed.");
      return;
    }

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
                <label className="block text-[#1f2125] font-semibold mb-2">
                  Service Taken *
                </label>
                <div className="relative">
                  <CustomDropdown
                    options={services.map((s) => s.title)}
                    value={form.project}
                    onChange={(val) => handleCustomChange("project", val)}
                    icon={
                      <FaClipboardList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
                    }
                    placeholder="Select a service"
                  />
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
                  <div className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] font-light transition-all duration-300 flex items-center cursor-pointer relative">
                    <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-5 h-5" />
                    <span className="pl-8">
                      {form.image ? form.image.name : "Choose File"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Date */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-2">
                  Date
                </label>
                <div className="relative">
                  <CustomDropdown
                    options={months}
                    value={form.date}
                    onChange={(val) => handleCustomChange("date", val)}
                    icon={
                      <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
                    }
                    placeholder={defaultMonth} // show current month as default
                  />
                </div>
                {dateError && (
                  <p className="text-red-500 text-xs mt-2">{dateError}</p>
                )}
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
