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
      className={`p-3 mb-2 bg-white rounded-md border border-[#E3F5D9] ring-[#56ab2f] outline-[#56ab2f] shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
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
      </div>
    </motion.div>
  );
}
