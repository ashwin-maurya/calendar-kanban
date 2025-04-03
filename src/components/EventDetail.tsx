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

    document.body.style.overflow = "hidden";
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
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />

      <motion.div
        layoutId={`card-${event.id}`}
        className="fixed inset-0 bg-gradient-to-br from-white to-gray-50 z-50 overflow-hidden"
        transition={{
          layout: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        }}
      >
        <motion.div
          layoutId={`content-${event.id}`}
          className="relative max-w-5xl mx-auto h-full p-8 pt-20"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>

          <div className="grid grid-cols-1 md:grid-cols-2 px-1 gap-12 h-full">
            <div className="space-y-6">
              <motion.h2
                layoutId={`title-${event.id}`}
                className="text-4xl font-bold"
              >
                {event.title}
              </motion.h2>

              <motion.div
                layoutId={`time-${event.id}`}
                className="text-xl text-gray-600"
              >
                {event.time}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-700 leading-relaxed"
              >
                {event.description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="relative h-full min-h-[400px]"
            >
              <motion.img
                src={event.imageUrl}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
