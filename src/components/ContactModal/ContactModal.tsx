"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import ContactForm from "../ContactForm/ContactForm";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  packageName: string;
  packagePrice: string;
}

const modalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  packageName,
  packagePrice,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-[#ECF0F3] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[20px_20px_40px_#00000033]"
            variants={modalContentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#d1d9e6] flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#1f2125]">
                  Start Your Project
                </h2>
                <p className="text-sm text-[#3c3e41]">
                  Inquiry for:{" "}
                  <span className="font-semibold text-[#FF004F]">
                    {packageName.charAt(0).toUpperCase() + packageName.slice(1)}{" "}
                    Package
                  </span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#ECF0F3] shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center text-[#FF004F] hover:text-[#e6003d] transition-colors duration-300"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body with Form */}
            <div className="p-8 overflow-y-auto">
              <ContactForm
                serviceTitle={serviceTitle}
                packageName={packageName}
                packagePrice={packagePrice}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
