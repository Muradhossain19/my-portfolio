import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  error?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select a service",
  name,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`w-full px-4 py-4 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] font-light transition-all duration-300 flex items-center justify-between ${
          error ? "border-red-300" : ""
        }`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        name={name}
      >
        <span className={value ? "" : "text-[#3c3e41]"}>
          {value || placeholder}
        </span>
        <FaChevronDown className="ml-2 text-[#3c3e41]" />
      </button>
      {open && (
        <ul className="absolute left-0 right-0 mt-2 bg-[#ECF0F3] rounded-xl shadow-[0_4px_24px_rgba(44,62,80,0.08)] z-20 max-h-60 overflow-auto border border-[#d1d9e6]">
          {options.map((option) => (
            <li
              key={option}
              className={`px-4 py-3 cursor-pointer hover:bg-[#FF004F]/10 text-[#1f2125] ${
                value === option ? "bg-[#FF004F]/10 font-semibold" : ""
              }`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              role="option"
              aria-selected={value === option}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onChange(option);
                  setOpen(false);
                }
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomDropdown;
