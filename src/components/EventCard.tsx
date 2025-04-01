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
      className={`p-2 mb-2 bg-white shadow rounded cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-sm font-semibold">{event.title}</h3>
      <p className="text-xs text-gray-600">{event.time}</p>
      {isOpen && <EventDetail event={event} onClose={() => setIsOpen(false)} />}
    </motion.div>
  );
}
