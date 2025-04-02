"use client";

import { format, subWeeks, addWeeks } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export default function CalendarHeader({
  currentDate,
  setCurrentDate,
}: CalendarHeaderProps) {
  const weekStart = format(currentDate, "MMM d");
  const weekEnd = format(addWeeks(currentDate, 1), "MMM d");

  return (
    <header className="p-4 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white">
      <div className="flex justify-between items-center">
        <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
          <CircleChevronLeft />
        </button>
        <AnimatePresence mode="wait">
          <motion.h1
            key={weekStart}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-lg font-semibold"
          >
            {`${weekStart} - ${weekEnd}`}
          </motion.h1>
        </AnimatePresence>
        <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
          <CircleChevronRight />
        </button>
      </div>
    </header>
  );
}
