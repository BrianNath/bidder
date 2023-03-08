import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImagePopup = ({ imageUrl, onClose, isOpen }) => {
  return isOpen ? (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 z-50 w-full h-full p-6 bg-black bg-opacity-50 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-3xl h-full overflow-hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <button
            style={{ right:"0" }}
            className="absolute top-0 p-4 text-white"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <img
            className="w-full h-full object-cover"
            src={imageUrl}
            alt="Hero"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : null;
};

export default ImagePopup;
