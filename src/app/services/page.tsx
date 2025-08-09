"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import PageHeader from "../../components/PageHeader/PageHeader";
import { servicesList } from "../../lib/servicesListData";
import { FaArrowRight } from "react-icons/fa";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const optimizedViewport = { once: true, amount: 0.2 };

export default function AllServicesPage() {
  return (
    <>
      <PageHeader
        title="My Services"
        subtitle="Crafting digital solutions to elevate your brand. Explore the range of services I offer to bring your vision to life."
        breadcrumbs={[{ label: "Services", href: "/services" }]}
      />

      <div className="bg-[#ECF0F3] py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={optimizedViewport}
            variants={staggerContainer}
          >
            {servicesList.map((service) => (
              <motion.div key={service.slug} variants={fadeInUp}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block bg-[#ECF0F3] rounded-2xl p-8 h-full transition-all duration-300 shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] hover:-translate-y-2"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-[#ECF0F3] rounded-xl flex items-center justify-center shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] transition-all duration-300 group-hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff]">
                      <service.icon className="w-8 h-8 text-[#FF004F]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1f2125] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[#3c3e41] mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center font-semibold text-[#FF004F] transition-transform duration-300 group-hover:translate-x-1 mt-auto">
                    View Details <FaArrowRight className="ml-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
