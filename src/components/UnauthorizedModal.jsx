import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

function UnauthorizedModal({ isOpen }) {
  const router = useRouter();
  function handleCloseModal() {
    isOpen = false;
    router.push("/authentication/login");
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative bg-white max-w-xl mx-3 rounded-lg shadow-lg"
            initial={{ translateY: 100, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <h2 className="text-2xl mb-4 flex gap-2 align-items-center">
                <span className="text-red-500 font-bold">401</span>
                <span>Unauthorized</span>
              </h2>
              <p className="mb-4 max-w-sm">
                To access this feature, you need to be logged in. Please log in
                or create an account to continue.
              </p>
              <button
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-8 rounded m-auto block"
                onClick={handleCloseModal}
              >
                Login
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UnauthorizedModal;
