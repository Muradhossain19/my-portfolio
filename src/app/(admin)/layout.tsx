// src/app/(admin)/layout.tsx
"use client";

import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaCog,
  FaUsers,
  FaEnvelope,
  FaChartLine,
  FaBell,
  FaSignOutAlt,
  FaUserShield,
  FaClipboardList,
  FaProjectDiagram,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";

// Sidebar Layout Component
function AdminSidebarLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!loading && !user && !pathname.includes("/login")) {
      router.replace("/login");
    }
  }, [user, loading, router, pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECF0F3] flex items-center justify-center">
        <div className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff]">
          <div className="w-12 h-12 border-4 border-[#FF004F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3c3e41] text-center">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page without sidebar
  if (!user || pathname.includes("/login")) {
    return <>{children}</>;
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: FaHome,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      title: "Services",
      icon: FaProjectDiagram,
      href: "/dashboard/services",
      active: pathname.startsWith("/dashboard/services"),
    },
    {
      title: "Portfolio",
      icon: FaClipboardList,
      href: "/dashboard/portfolio",
      active: pathname.startsWith("/dashboard/portfolio"),
    },
    {
      title: "Contacts",
      icon: FaEnvelope,
      href: "/dashboard/contacts",
      active: pathname.startsWith("/dashboard/contacts"),
    },
    {
      title: "Reviews",
      icon: FaUsers,
      href: "/dashboard/reviews",
      active: pathname.startsWith("/dashboard/reviews"),
    },
    {
      title: "Analytics",
      icon: FaChartLine,
      href: "/dashboard/analytics",
      active: pathname.startsWith("/dashboard/analytics"),
    },
    {
      title: "Settings",
      icon: FaCog,
      href: "/dashboard/settings",
      active: pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#ECF0F3] flex">
      {/* Sidebar */}
      <motion.aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#ECF0F3] border-r border-[#d1d9e6] transition-all duration-300 flex flex-col ${
          isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"
        } ${isMobile && !sidebarOpen ? "-translate-x-full" : ""}`}
        style={{ height: "100vh" }}
        initial={false}
        animate={{
          width: isMobile ? (sidebarOpen ? 256 : 0) : sidebarOpen ? 256 : 80,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Top (Logo/Brand) */}
        <div className="p-4.5 border-b border-[#d1d9e6] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF004F] rounded-xl flex items-center justify-center">
              <FaUserShield className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-[#1f2125]">
                  Admin Panel
                </h1>
                <p className="text-xs text-[#3c3e41]">Murad Hossain</p>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    item.active
                      ? "bg-[#FF004F] text-white shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]"
                      : "text-[#3c3e41] hover:bg-[#ECF0F3] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      item.active ? "text-white" : "text-[#3c3e41]"
                    }`}
                  />
                  {sidebarOpen && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom (Profile & Logout) */}
        <div className="p-4 border-t border-[#d1d9e6] flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            {/* User avatar */}
            <div className="w-10 h-10 bg-[#ECF0F3] rounded-xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] flex items-center justify-center">
              {/* You can use user's initial or avatar here */}
              <span className="w-8 h-8 rounded-full bg-[#222] text-white flex items-center justify-center font-bold text-lg">
                {user.name?.[0] || "U"}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1f2125]">
                  {user.name}
                </p>
                <p className="text-xs text-[#3c3e41]">{user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <FaSignOutAlt className="w-4 h-4" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Sticky Header */}
        <header className="bg-[#ECF0F3] border-b border-[#d1d9e6] px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 bg-[#ECF0F3] rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300"
              >
                {sidebarOpen ? (
                  <FaTimes className="w-4 h-4" />
                ) : (
                  <FaBars className="w-4 h-4" />
                )}
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#1f2125]">
                  {menuItems.find((item) => item.active)?.title ||
                    "Admin Panel"}
                </h1>
                <p className="text-sm text-[#3c3e41]">
                  Manage your portfolio and services
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#ECF0F3] rounded-xl shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center">
                <FaBell className="w-4 h-4 text-[#3c3e41]" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content (scrollable) */}
        <main className="flex-1 overflow-y-auto bg-[#ECF0F3] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Main Layout - Same as your existing structure
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminSidebarLayout>{children}</AdminSidebarLayout>
    </AdminAuthProvider>
  );
}
