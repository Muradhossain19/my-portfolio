"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaEye,
  FaTrash,
  FaSearch,
  FaFileExport,
  FaTimes,
  FaExclamationTriangle,
  FaReply,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import Link from "next/link";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
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

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

// Interfaces - Updated according to your database structure
interface ContactForm {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  service: string;
  message: string;
  created_at: string;
}

interface OrderForm {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  price: string;
  created_at: string;
}

interface SubscriptionForm {
  id: number;
  email: string;
  created_at: string;
}

type TabType = "contacts" | "orders" | "subscriptions";
type CombinedFormData = ContactForm | OrderForm | SubscriptionForm;

// Type guards
const isContactForm = (item: CombinedFormData): item is ContactForm => {
  return "service" in item;
};

const isOrderForm = (item: CombinedFormData): item is OrderForm => {
  return "price" in item;
};

const isSubscriptionForm = (
  item: CombinedFormData
): item is SubscriptionForm => {
  return !("name" in item) && "email" in item;
};

const ContactsManagement = () => {
  // States
  const [activeTab, setActiveTab] = useState<TabType>("contacts");
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [orders, setOrders] = useState<OrderForm[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    ContactForm | OrderForm | null
  >(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    type: TabType;
  } | null>(null);
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalOrders: 0,
    totalSubscribers: 0,
    totalRevenue: 0,
  });

  // Calculate stats function
  const calculateStats = useCallback(
    (
      contacts: ContactForm[],
      orders: OrderForm[],
      subscriptions: SubscriptionForm[]
    ) => {
      const totalRevenue = orders.reduce(
        (sum, order) =>
          sum + parseFloat(order.price.replace(/[^0-9.-]+/g, "") || "0"),
        0
      );

      setStats({
        totalContacts: contacts.length,
        totalOrders: orders.length,
        totalSubscribers: subscriptions.length,
        totalRevenue,
      });
    },
    []
  );

  // Fetch data function with useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch contacts
      const contactsRes = await fetch("/api/admin/contacts");
      const contactsData = await contactsRes.json();
      if (contactsData.success) {
        setContacts(contactsData.contacts);
      }

      // Fetch orders
      const ordersRes = await fetch("/api/admin/orders");
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setOrders(ordersData.orders);
      }

      // Fetch subscriptions
      const subsRes = await fetch("/api/admin/subscriptions");
      const subsData = await subsRes.json();
      if (subsData.success) {
        setSubscriptions(subsData.subscriptions);
      }

      // Calculate stats
      calculateStats(
        contactsData.contacts || [],
        ordersData.orders || [],
        subsData.subscriptions || []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  // useEffect with proper dependency
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data based on search
  const getFilteredData = (): CombinedFormData[] => {
    let data: CombinedFormData[] = [];

    switch (activeTab) {
      case "contacts":
        data = contacts;
        break;
      case "orders":
        data = orders;
        break;
      case "subscriptions":
        data = subscriptions;
        break;
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter((item) => {
        if (isSubscriptionForm(item)) {
          return item.email.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          // Type assertion to ensure item has name, email, and subject properties
          const formItem = item as ContactForm | OrderForm;
          return (
            formItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formItem.subject.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      });
    }

    return data;
  };

  // Handle actions
  const handleView = (item: ContactForm | OrderForm) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleDelete = (id: number, type: TabType) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(
        `/api/admin/${itemToDelete.type}/${itemToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchData(); // Refresh data
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const exportData = () => {
    const data = getFilteredData();
    const csv = convertToCSV(data);
    downloadCSV(csv, `${activeTab}_export.csv`);
  };

  const convertToCSV = (data: CombinedFormData[]) => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) => {
      return Object.values(item)
        .map((value) => {
          // Handle null/undefined values and escape quotes
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          // Escape quotes by doubling them and wrap in quotes if contains comma/quote
          if (
            stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",");
    });
    return [headers, ...rows].join("\n");
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECF0F3] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FF004F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#ECF0F3] p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1f2125] mb-2">
              Contact Management
            </h1>
            <p className="text-[#3c3e41]">
              Manage all your contact forms, orders, and subscriptions
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-[#ECF0F3] text-[#FF004F] px-6 py-3 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3c3e41] text-sm mb-1">Total Contacts</p>
                <p className="text-2xl font-bold text-[#1f2125]">
                  {stats.totalContacts}
                </p>
              </div>
              <FaEnvelope className="w-8 h-8 text-[#FF004F]" />
            </div>
          </div>

          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3c3e41] text-sm mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-[#1f2125]">
                  {stats.totalOrders}
                </p>
              </div>
              <FaDollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3c3e41] text-sm mb-1">Subscribers</p>
                <p className="text-2xl font-bold text-[#1f2125]">
                  {stats.totalSubscribers}
                </p>
              </div>
              <FaUser className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#3c3e41] text-sm mb-1">Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <FaStar className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#ECF0F3] p-2 rounded-2xl shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] flex mb-6">
          {[
            {
              key: "contacts" as const,
              label: "Contact Forms",
              count: stats.totalContacts,
            },
            {
              key: "orders" as const,
              label: "Order Forms",
              count: stats.totalOrders,
            },
            {
              key: "subscriptions" as const,
              label: "Subscriptions",
              count: stats.totalSubscribers,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? "bg-[#ECF0F3] text-[#FF004F] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]"
                  : "text-[#3c3e41] hover:text-[#FF004F]"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  activeTab === tab.key
                    ? "bg-[#FF004F] text-white"
                    : "bg-[#d1d9e6] text-[#3c3e41]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Export */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] text-[#1f2125] placeholder-[#3c3e41]"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
          </div>

          <button
            onClick={exportData}
            className="bg-[#ECF0F3] text-[#FF004F] px-6 py-3 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 flex items-center gap-2"
          >
            <FaFileExport className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={itemVariants}
        className="bg-[#ECF0F3] rounded-2xl shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#ECF0F3] border-b border-[#d1d9e6]">
              <tr>
                <th className="text-left p-6 text-[#1f2125] font-semibold">
                  {activeTab === "subscriptions" ? "Email" : "Contact Info"}
                </th>
                {activeTab !== "subscriptions" && (
                  <th className="text-left p-6 text-[#1f2125] font-semibold">
                    Subject
                  </th>
                )}
                {activeTab === "orders" && (
                  <th className="text-left p-6 text-[#1f2125] font-semibold">
                    Price
                  </th>
                )}
                <th className="text-left p-6 text-[#1f2125] font-semibold">
                  Date
                </th>
                <th className="text-left p-6 text-[#1f2125] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredData().map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#d1d9e6] hover:bg-[#d1d9e6]/30 transition-colors duration-200"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ECF0F3] rounded-full flex items-center justify-center shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                        <FaUser className="w-4 h-4 text-[#FF004F]" />
                      </div>
                      <div>
                        {isSubscriptionForm(item) ? (
                          <p className="text-[#1f2125] font-medium">
                            {item.email}
                          </p>
                        ) : (
                          <>
                            <p className="text-[#1f2125] font-medium">
                              {(item as ContactForm | OrderForm).name}
                            </p>
                            <p className="text-sm text-[#3c3e41]">
                              {(item as ContactForm | OrderForm).email}
                            </p>
                            {(item as ContactForm | OrderForm).phone && (
                              <p className="text-xs text-[#3c3e41]">
                                {(item as ContactForm | OrderForm).phone}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {activeTab !== "subscriptions" &&
                    !isSubscriptionForm(item) && (
                      <td className="p-6">
                        <p className="text-[#1f2125] font-medium line-clamp-2">
                          {(item as ContactForm | OrderForm).subject}
                        </p>
                        {isContactForm(item) && (
                          <p className="text-xs text-[#3c3e41] mt-1">
                            Service: {item.service}
                          </p>
                        )}
                      </td>
                    )}

                  {activeTab === "orders" && isOrderForm(item) && (
                    <td className="p-6">
                      <span className="text-lg font-bold text-green-600">
                        {item.price}
                      </span>
                    </td>
                  )}

                  <td className="p-6">
                    <div className="flex items-center gap-2 text-[#3c3e41]">
                      <FaCalendarAlt className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      {activeTab !== "subscriptions" &&
                        !isSubscriptionForm(item) && (
                          <button
                            onClick={() =>
                              handleView(item as ContactForm | OrderForm)
                            }
                            className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center text-[#FF004F] transition-all duration-300"
                            title="View Details"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        )}

                      <button
                        onClick={() => handleDelete(item.id, activeTab)}
                        className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center text-red-500 transition-all duration-300"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {getFilteredData().length === 0 && (
            <div className="text-center py-12">
              <FaEnvelope className="w-16 h-16 text-[#d1d9e6] mx-auto mb-4" />
              <p className="text-[#3c3e41] text-lg mb-2">
                No {activeTab} found
              </p>
              <p className="text-[#3c3e41]">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : `No ${activeTab} have been submitted yet`}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => setShowDetailModal(false)}
        >
          <motion.div
            className="bg-[#ECF0F3] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            variants={modalContentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6]">
              <h3 className="text-xl font-bold text-[#1f2125]">
                {activeTab === "orders" ? "Order Details" : "Contact Details"}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#FF004F]"
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                    <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                      Name
                    </label>
                    <p className="text-[#3c3e41]">{selectedItem.name}</p>
                  </div>
                  <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                    <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                      Email
                    </label>
                    <p className="text-[#3c3e41]">{selectedItem.email}</p>
                  </div>
                  {selectedItem.phone && (
                    <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                      <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                        Phone
                      </label>
                      <p className="text-[#3c3e41]">{selectedItem.phone}</p>
                    </div>
                  )}
                  <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                    <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                      Date
                    </label>
                    <p className="text-[#3c3e41]">
                      {formatDate(selectedItem.created_at)}
                    </p>
                  </div>
                </div>

                {/* Subject */}
                <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                  <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                    Subject
                  </label>
                  <p className="text-[#3c3e41]">{selectedItem.subject}</p>
                </div>

                {/* Service (for contacts) */}
                {activeTab === "contacts" && isContactForm(selectedItem) && (
                  <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                    <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                      Service
                    </label>
                    <p className="text-[#3c3e41]">{selectedItem.service}</p>
                  </div>
                )}

                {/* Price (for orders) */}
                {activeTab === "orders" && isOrderForm(selectedItem) && (
                  <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                    <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                      Price
                    </label>
                    <p className="text-[#FF004F] text-lg font-bold">
                      {selectedItem.price}
                    </p>
                  </div>
                )}

                {/* Message */}
                <div className="bg-[#ECF0F3] rounded-xl p-4 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]">
                  <label className="text-sm font-semibold text-[#1f2125] mb-2 block">
                    Message
                  </label>
                  <div className="text-[#3c3e41] whitespace-pre-wrap leading-relaxed">
                    {selectedItem.message}
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed action bar */}
            <div className="p-6 border-t border-[#d1d9e6] flex flex-col gap-3 md:flex-row">
              <button
                onClick={() =>
                  (window.location.href = `mailto:${selectedItem.email}`)
                }
                className="flex-1 bg-[#FF004F] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#e6003d] transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaReply className="w-4 h-4" />
                Reply via Email
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 bg-[#ECF0F3] text-[#3c3e41] px-6 py-3 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            className="bg-[#ECF0F3] rounded-2xl max-w-md w-full p-6"
            variants={modalContentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1f2125] mb-2">
                Confirm Deletion
              </h3>
              <p className="text-[#3c3e41] mb-6">
                Are you sure you want to delete this {activeTab.slice(0, -1)}?
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-[#ECF0F3] text-[#3c3e41] px-6 py-3 rounded-xl font-semibold shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContactsManagement;
