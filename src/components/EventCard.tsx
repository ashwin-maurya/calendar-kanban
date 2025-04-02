"use client";

import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { Event } from "@/lib/types";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import EventDetail from "./EventDetail";

interface EventCardProps {
  event: Event;
  date: Date;
  setIsDragging: (dragging: boolean) => void;
}

export default function EventCard({
  event,
  date,
  setIsDragging,
}: EventCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "EVENT",
    item: { id: event.id, fromDate: format(date, "yyyy-MM-dd") },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: () => setIsDragging(false),
  }));

  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging, setIsDragging]);

  return (
    <motion.div
      ref={drag}
      onClick={() => setIsOpen(true)}
      className={`p-3 mb-2 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
          <div className="mt-1 flex items-center">
            <span className="text-xs text-gray-500">{event.time}</span>
          </div>
        </div>
        <div className="ml-2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      </div>
      {isOpen && <EventDetail event={event} onClose={() => setIsOpen(false)} />}
    </motion.div>
  );
}
