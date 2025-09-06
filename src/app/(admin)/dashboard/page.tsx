// src/app/(admin)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  FaUsers,
  FaProjectDiagram,
  FaEnvelope,
  FaHeart,
  FaPlus,
  FaEdit,
  FaBell,
  FaChartLine,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";
import Link from "next/link";

interface DashboardStats {
  totalContacts: number;
  totalReviews: number;
  totalSubscribers: number;
  totalPortfolioLikes: number;
}

interface RecentActivity {
  id: number;
  type: "contact" | "review" | "subscription";
  message: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalReviews: 0,
    totalSubscribers: 0,
    totalPortfolioLikes: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats({
          totalContacts: 25,
          totalReviews: 12,
          totalSubscribers: 48,
          totalPortfolioLikes: 156,
        });

        setRecentActivity([
          {
            id: 1,
            type: "contact",
            message: "New contact form submission from John Doe",
            timestamp: "2 hours ago",
          },
          {
            id: 2,
            type: "review",
            message: "New 5-star review received",
            timestamp: "4 hours ago",
          },
          {
            id: 3,
            type: "subscription",
            message: "New newsletter subscription",
            timestamp: "6 hours ago",
          },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff]">
          <div className="w-12 h-12 border-4 border-[#FF004F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3c3e41] text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Add New Service",
      description: "Create a new service offering",
      icon: FaPlus,
      href: "/dashboard/services/new",
      color: "bg-[#FF004F]",
    },
    {
      title: "Manage Services",
      description: "Edit existing services",
      icon: FaEdit,
      href: "/dashboard/services",
      color: "bg-[#3c3e41]",
    },
    {
      title: "View Analytics",
      description: "Check website performance",
      icon: FaChartLine,
      href: "/dashboard/analytics",
      color: "bg-[#FF004F]",
    },
  ];

  const statsCards = [
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: FaEnvelope,
      color: "text-[#FF004F]",
      bgColor: "bg-[#FF004F]/10",
    },
    {
      title: "Client Reviews",
      value: stats.totalReviews,
      icon: FaUsers,
      color: "text-[#3c3e41]",
      bgColor: "bg-[#3c3e41]/10",
    },
    {
      title: "Subscribers",
      value: stats.totalSubscribers,
      icon: FaBell,
      color: "text-[#FF004F]",
      bgColor: "bg-[#FF004F]/10",
    },
    {
      title: "Portfolio Likes",
      value: stats.totalPortfolioLikes,
      icon: FaHeart,
      color: "text-[#3c3e41]",
      bgColor: "bg-[#3c3e41]/10",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Stats Cards */}
      <motion.section variants={itemVariants}>
        <h2 className="text-xl font-semibold text-[#1f2125] mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
              whileHover={{
                scale: 1.02,
                boxShadow: "15px 15px 30px #d1d9e6,-15px -15px 30px #ffffff",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#3c3e41] mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#1f2125]">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section variants={itemVariants}>
        <h2 className="text-xl font-semibold text-[#1f2125] mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <motion.div
                className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] cursor-pointer group"
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "inset 5px 5px 10px #d1d9e6,inset -5px -5px 10px #ffffff",
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#1f2125] mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-[#3c3e41]">{action.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Recent Activity & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xl font-semibold text-[#1f2125] mb-6">
            Recent Activity
          </h2>
          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-[#ECF0F3] rounded-xl shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "contact"
                        ? "bg-[#FF004F]/10"
                        : activity.type === "review"
                        ? "bg-[#3c3e41]/10"
                        : "bg-[#FF004F]/10"
                    }`}
                  >
                    {activity.type === "contact" && (
                      <FaEnvelope className="w-3 h-3 text-[#FF004F]" />
                    )}
                    {activity.type === "review" && (
                      <FaUsers className="w-3 h-3 text-[#3c3e41]" />
                    )}
                    {activity.type === "subscription" && (
                      <FaBell className="w-3 h-3 text-[#FF004F]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#1f2125] font-medium">
                      {activity.message}
                    </p>
                    <p className="text-xs text-[#3c3e41] mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Today's Schedule */}
        <motion.section variants={itemVariants}>
          <h2 className="text-xl font-semibold text-[#1f2125] mb-6">
            Today&#39;s Schedule
          </h2>
          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#ECF0F3] rounded-xl shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]">
                <div className="w-8 h-8 bg-[#FF004F]/10 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="w-3 h-3 text-[#FF004F]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#1f2125] font-medium">
                    Review client proposals
                  </p>
                  <p className="text-xs text-[#3c3e41] mt-1">10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[#ECF0F3] rounded-xl shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]">
                <div className="w-8 h-8 bg-[#3c3e41]/10 rounded-full flex items-center justify-center">
                  <FaClipboardList className="w-3 h-3 text-[#3c3e41]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#1f2125] font-medium">
                    Update portfolio projects
                  </p>
                  <p className="text-xs text-[#3c3e41] mt-1">2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[#ECF0F3] rounded-xl shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]">
                <div className="w-8 h-8 bg-[#FF004F]/10 rounded-full flex items-center justify-center">
                  <FaProjectDiagram className="w-3 h-3 text-[#FF004F]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#1f2125] font-medium">
                    Client meeting - Website redesign
                  </p>
                  <p className="text-xs text-[#3c3e41] mt-1">4:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
