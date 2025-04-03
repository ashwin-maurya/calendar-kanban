"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Event } from "@/lib/types";
import { useEffect } from "react";

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
      />

      <motion.div
        key="content"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          exit: { duration: 0.3 },
        }}
        className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50
                 md:inset-0 md:rounded-none md:h-screen"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-4 mb-10 md:hidden" />

        <div className="h-[85vh] md:h-screen overflow-y-auto px-4 pb-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-200 p-2 rounded"
          >
            Esc
          </motion.button>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold"
          >
            {event.title}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm text-gray-600"
          >
            {event.time}
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2"
          >
            {event.description}
          </motion.p>

          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.25 }}
            src={event.imageUrl}
            alt={event.title}
            className="w-full md:w-1/2 max-h-[500px] object-cover h-auto mt-4 rounded"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
