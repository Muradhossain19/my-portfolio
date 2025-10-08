// src/app/(admin)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { FaUsers, FaEnvelope, FaPlus, FaBell, FaStar } from "react-icons/fa";
import Link from "next/link";

interface DashboardStats {
  totalContacts: number;
  totalReviews: number;
  totalSubscribers: number;
  totalPortfolios: number; // <-- নতুন property
}

interface RecentActivity {
  id: number;
  type: "contact" | "review" | "subscription";
  message: string;
  timestamp: string;
  created_at?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalReviews: 0,
    totalSubscribers: 0,
    totalPortfolios: 0, // <-- নতুন property
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching dashboard data..."); // Debug log

        // Fetch stats
        const statsResponse = await fetch("/api/admin/dashboard-stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log("Stats data received:", statsData); // Debug log
          setStats(statsData);
        } else {
          console.log("Stats API failed, using fallback data");
          setStats({
            totalContacts: 25,
            totalReviews: 12,
            totalSubscribers: 48,
            totalPortfolios: 8, // <-- fallback value
          });
        }

        // Fetch recent activity
        const activityResponse = await fetch("/api/admin/recent-activity");
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          console.log("Activity data received:", activityData); // Debug log
          setRecentActivity(activityData);
        } else {
          console.log("Activity API failed, using fallback data");
          // Fallback dummy data
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
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to dummy data
        setStats({
          totalContacts: 25,
          totalReviews: 12,
          totalSubscribers: 48,
          totalPortfolios: 8, // <-- fallback value
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter activities by type
  const getReviewActivities = () => {
    return recentActivity.filter((activity) => activity.type === "review");
  };

  const getFormsAndLikesActivities = () => {
    return recentActivity.filter(
      (activity) =>
        activity.type === "contact" || activity.type === "subscription"
    );
  };

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
      title: "Add New Portfolio",
      description: "Showcase your latest work",
      icon: FaPlus,
      href: "/dashboard/portfolios/new",
      color: "bg-[#FF004F]",
    },
    {
      title: "Add New Blog",
      description: "Share a new blog post",
      icon: FaPlus,
      href: "/dashboard/blog/new",
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
      title: "Total Portfolios", // <-- পরিবর্তন
      value: stats.totalPortfolios, // <-- পরিবর্তন
      icon: FaStar,
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

      {/* Recent Activities - Split into two sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Reviews Activity */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1f2125]">
              Recent Reviews
            </h2>
            <Link
              href="/dashboard/reviews"
              className="text-sm text-[#FF004F] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="space-y-4">
              {getReviewActivities().length > 0 ? (
                getReviewActivities()
                  .slice(0, 5)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-[#ECF0F3] rounded-xl shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#3c3e41]/10">
                        <FaStar className="w-3 h-3 text-yellow-500" />
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
                  ))
              ) : (
                <div className="text-center py-8">
                  <FaStar className="w-12 h-12 text-[#d1d9e6] mx-auto mb-2" />
                  <p className="text-[#3c3e41]">No recent reviews</p>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Forms & Subscriptions Activity */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1f2125]">
              Recent Forms & Subscriptions
            </h2>
            <Link
              href="/dashboard/contacts"
              className="text-sm text-[#FF004F] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="space-y-4">
              {getFormsAndLikesActivities().length > 0 ? (
                getFormsAndLikesActivities()
                  .slice(0, 5)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-[#ECF0F3] rounded-xl shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === "contact"
                            ? "bg-[#FF004F]/10"
                            : "bg-[#FF004F]/10"
                        }`}
                      >
                        {activity.type === "contact" && (
                          <FaEnvelope className="w-3 h-3 text-[#FF004F]" />
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
                  ))
              ) : (
                <div className="text-center py-8">
                  <FaEnvelope className="w-12 h-12 text-[#d1d9e6] mx-auto mb-2" />
                  <p className="text-[#3c3e41]">No recent submissions</p>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
