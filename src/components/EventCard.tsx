"use client";

import { useDrag } from "react-dnd/dist/hooks";
import { motion, LayoutGroup } from "framer-motion";
import { Event } from "@/lib/types";
import { useEffect, useCallback } from "react";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  date: Date;
  setIsDragging: (dragging: boolean) => void;
  selectedEvent: string | null;
  setSelectedEvent: (eventId: string | null) => void;
}

export default function EventCard({
  event,
  date,
  setIsDragging,
  selectedEvent,
  setSelectedEvent,
}: EventCardProps) {
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

  const dragRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) drag(node);
    },
    [drag]
  );

  return (
    <motion.div
      ref={dragRef}
      onClick={() => setSelectedEvent(event.id)}
      className={`p-3 mb-2 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
      layoutId={`card-${event.id}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <motion.div
        className="flex items-start justify-between"
        layoutId={`content-${event.id}`}
      >
        <div className="flex-1">
          <motion.h3
            className="text-sm font-medium text-gray-900"
            layoutId={`title-${event.id}`}
          >
            {event.title}
          </motion.h3>
          <motion.div
            className="mt-1 flex items-center"
            layoutId={`time-${event.id}`}
          >
            <span className="text-xs text-gray-500">{event.time}</span>
          </motion.div>
        </div>
        <motion.div
          className="ml-2 text-gray-400"
          layoutId={`icon-${event.id}`}
        >
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
