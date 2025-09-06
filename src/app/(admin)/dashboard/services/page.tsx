"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface PricingTier {
  price: string;
  features?: string[];
}

interface Pricing {
  basic: PricingTier;
  standard: PricingTier;
  premium: PricingTier;
}

interface Service {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  slug: string;
  is_active: boolean;
  pricing: Pricing;
  created_at: string;
  updated_at: string;
}

// API Response interface
interface ServiceApiResponse {
  success: boolean;
  services: Array<{
    id: string;
    title: string;
    subtitle: string;
    image: string;
    slug: string;
    is_active: boolean;
    pricing: string; // JSON string from database
    created_at: string;
    updated_at: string;
  }>;
}

type ServiceStatus = "all" | "active" | "inactive";

const ServicesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus>("all");
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Safe JSON parse function
  const safeJsonParse = (jsonString: string): Pricing => {
    try {
      if (!jsonString || jsonString.trim() === "") {
        return {
          basic: { price: "" },
          standard: { price: "" },
          premium: { price: "" },
        };
      }
      return JSON.parse(jsonString) as Pricing;
    } catch (error) {
      console.warn("JSON parse error:", error);
      return {
        basic: { price: "" },
        standard: { price: "" },
        premium: { price: "" },
      };
    }
  };

  // Wrap fetchServices with useCallback
  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch("/api/services");
      const data = (await response.json()) as ServiceApiResponse;

      if (data.success) {
        // Parse pricing for each service with proper typing
        const parsedServices: Service[] = data.services.map((service) => ({
          ...service,
          pricing: safeJsonParse(service.pricing),
        }));
        setServicesList(parsedServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Now useEffect dependency warning is resolved
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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

  const filteredServices = servicesList.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && service.is_active) ||
      (statusFilter === "inactive" && !service.is_active);
    return matchesSearch && matchesStatus;
  });

  const handleDeleteService = async (serviceId: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setServicesList((prev) =>
          prev.filter((service) => service.id !== serviceId)
        );
        setShowDeleteModal(null);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECF0F3] flex items-center justify-center">
        <div className="bg-[#ECF0F3] rounded-2xl p-8 shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff]">
          <div className="w-12 h-12 border-4 border-[#FF004F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3c3e41] text-center">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[#3c3e41]">Manage your service offerings</p>
          <p className="text-sm text-[#3c3e41]/70">
            Total: {servicesList.length} services
          </p>
        </div>
        <Link
          href="/dashboard/services/new"
          className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add New Service
        </Link>
      </div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-[#ECF0F3] rounded-2xl p-6 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#ECF0F3] rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ServiceStatus)}
              className="appearance-none bg-[#ECF0F3] rounded-xl px-4 py-3 pr-10 shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] border-none outline-none focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)] transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3c3e41] w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            className="bg-[#ECF0F3] rounded-2xl shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] overflow-hidden group hover:shadow-[15px_15px_30px_#d1d9e6,-15px_-15px_30px_#ffffff] transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Service Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={service.image || "/images/placeholder.jpg"}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    service.is_active
                  )}`}
                >
                  {service.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Service Content */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#1f2125] mb-2">
                {service.title}
              </h3>
              <p className="text-[#3c3e41] text-sm mb-4 line-clamp-2">
                {service.subtitle}
              </p>

              {/* Pricing */}
              <div className="mb-4">
                <p className="text-xs text-[#3c3e41] mb-1">Starting from:</p>
                <p className="text-lg font-bold text-[#FF004F]">
                  {service.pricing?.basic?.price || "Contact for pricing"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/services/${service.slug}`}
                    target="_blank"
                    className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300"
                  >
                    <FaEye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/dashboard/services/edit/${service.id}`}
                    className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center text-[#3c3e41] hover:text-[#FF004F] transition-colors duration-300"
                  >
                    <FaEdit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(service.id)}
                    className="w-8 h-8 bg-[#ECF0F3] rounded-lg shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] flex items-center justify-center text-[#3c3e41] hover:text-red-500 transition-colors duration-300"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#3c3e41]">
                  Updated: {new Date(service.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-16">
          <div className="w-20 h-20 bg-[#ECF0F3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff]">
            <FaCog className="w-8 h-8 text-[#3c3e41]" />
          </div>
          <h3 className="text-xl font-bold text-[#1f2125] mb-2">
            No services found
          </h3>
          <p className="text-[#3c3e41] mb-6">
            Try adjusting your search or filters
          </p>
          <Link
            href="/dashboard/services/new"
            className="bg-[#FF004F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#e6003d] transition-colors duration-300 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] inline-flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add Your First Service
          </Link>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-[#ECF0F3] rounded-2xl p-8 max-w-md w-full shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1f2125] mb-2">
                Delete Service
              </h3>
              <p className="text-[#3c3e41] mb-6">
                Are you sure you want to delete this service? This action cannot
                be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-[#ECF0F3] text-[#3c3e41] py-3 px-4 rounded-xl font-medium shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteService(showDeleteModal)}
                  disabled={deleting}
                  className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ServicesManagement;
