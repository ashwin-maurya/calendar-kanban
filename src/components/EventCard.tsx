"use client";

import { useDrag } from "react-dnd/dist/hooks";
import { motion, LayoutGroup, usePresence } from "framer-motion";
import { Event } from "@/lib/types";
import { useEffect, useCallback, useState } from "react";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  date: Date;
  setIsDragging: (dragging: boolean) => void;
  selectedEvent: string | null;
  setSelectedEvent: (eventId: string | null) => void;
  isNew?: boolean;
}

export default function EventCard({
  event,
  date,
  setIsDragging,
  selectedEvent,
  setSelectedEvent,
  isNew = false,
}: EventCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "EVENT",
    item: { id: event.id, fromDate: format(date, "yyyy-MM-dd") },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: () => setIsDragging(false),
  }));

  const [isPresent, safeToRemove] = usePresence();
  const [shouldAnimate, setShouldAnimate] = useState(!isNew);

  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging, setIsDragging]);

  useEffect(() => {
    // Enable animations after initial render for new cards
    if (isNew) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

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
      className={`p-3 mb-2 bg-white rounded-md border border-[#E3F5D9] ring-[#56ab2f] outline-[#56ab2f] shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      } ${isNew ? "relative" : ""}`}
      layoutId={shouldAnimate ? `card-${event.id}` : undefined}
      initial={isNew ? { opacity: 0, scale: 0.8 } : false}
      animate={isNew ? { opacity: 1, scale: 1 } : undefined}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={
        isNew ? { type: "spring", stiffness: 500, damping: 25 } : undefined
      }
    >
      <motion.div
        className="flex items-start justify-between"
        layoutId={shouldAnimate ? `content-${event.id}` : undefined}
      >
        <div className="flex-1">
          <motion.h3
            className="text-sm font-medium text-gray-900"
            layoutId={shouldAnimate ? `title-${event.id}` : undefined}
          >
            {event.title}
          </motion.h3>
          <motion.div
            className="mt-1 flex items-center"
            layoutId={shouldAnimate ? `time-${event.id}` : undefined}
          >
            <span className="text-xs text-gray-500">{event.time}</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
