// File: components/Header.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Testimonial", path: "/testimonial" },
    { name: "Price", path: "/price" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-[#ECF0F3] sticky top-0 z-50 border-b-[1px] border-gray-200 h-[80px]">
        <nav className="container mx-auto flex justify-between items-center h-full px-4">
          <Link href="/">
            <Image
              src="/images/Logo/murad-logo.png"
              alt="Murad Hossain Logo"
              height={70}
              width={150}
              quality={100}
              priority
            />
          </Link>

          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className="relative font-normal text-[#1f2125] transition-colors duration-300 hover:text-[#FF004F] after:content-[''] after:absolute after:left-1/2 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-[#FF004F] after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-14 h-14 rounded-full bg-[#ECF0F3] flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-shadow duration-200"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6 text-[#FF004F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* ব্যাকড্রপ */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-50 z-[90] transition-opacity duration-500 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* মোবাইল মেন্যু প্যানেল */}
      <div
        className={`
          fixed top-0 left-0 w-4/5 max-w-sm h-full bg-[#ECF0F3] z-[100] shadow-2xl
          transition-transform duration-500 ease-in-out
          p-8
          overflow-y-auto
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* উপরের অংশ */}
        <div className="flex justify-between items-start mb-5">
          {/* ১. ছবির পরিবর্তে আপনার লোগো ব্যবহার করা হলো */}
          <Image
            src="/images/Logo/murad-logo.png"
            alt="Murad Hossain Logo"
            width={120} // সাইজ অ্যাডজাস্ট করতে পারেন
            height={50}
          />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-12 h-12 rounded-full bg-[#ECF0F3] flex items-center justify-center flex-shrink-0 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] active:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-shadow duration-200"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-[#FF004F]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ২. ডেসক্রিপশন টেক্সটকে আলাদা সেকশনে আনা হলো */}
        <p className="text-base text-[#3c3e41] leading-relaxed mb-3">
          I am a creative developer building modern web experiences.
        </p>

        <hr className="border-gray-300 my-4" />

        {/* মেন্যু আইটেম */}
        <ul className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="text-sm font-normal text-[#3c3e41] hover:text-[#FF004F] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>

        {/* নিচের অংশ */}
        <div className="mt-8">
          <h4 className="text-sm font-medium uppercase tracking-widest text-[#3c3e41] mb-4">
            Find With Me
          </h4>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] transition-all duration-300"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] transition-all duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-md bg-[#ECF0F3] flex items-center justify-center text-xl text-[#3c3e41] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:text-[#FF004F] transition-all duration-300"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
