"use client";

import { motion } from "framer-motion";
import { Event } from "@/lib/types";

interface EventDetailProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  return (
    <motion.div
      animate={{
        scale: 1,
        opacity: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-white p-4 z-50 overflow-auto"
    >
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onClose}
        className="absolute top-4 right-4 bg-gray-200 p-2 rounded"
      >
        Close
      </motion.button>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold"
      >
        {event.title}
      </motion.h2>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-sm text-gray-600"
      >
        {event.time}
      </motion.p>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2"
      >
        {event.description}
      </motion.p>
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25 }}
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-auto mt-4 rounded"
      />
    </motion.div>
  );
}
