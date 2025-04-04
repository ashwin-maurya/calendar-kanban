"use client";

import {
  format,
  subWeeks,
  addWeeks,
  addDays,
  startOfWeek,
  getDay,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { useState, useEffect } from "react";

interface CalendarHeaderProps {
  isMobile: boolean;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onWeekTransition?: (direction: "left" | "right") => void;
}

export default function CalendarHeader({
  isMobile,
  currentDate,
  setCurrentDate,
}: CalendarHeaderProps) {
  const [visibleWeek, setVisibleWeek] = useState(
    startOfWeek(currentDate, { weekStartsOn: 0 })
  );

  const weekStart = format(visibleWeek, "MMM d");
  const weekEnd = format(addWeeks(visibleWeek, 1), "MMM d");
  const visibleMonth = format(visibleWeek, "MMMM yyyy");

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(visibleWeek, i);
    return {
      day: format(date, "EEE"),
      date: format(date, "d"),
      fullDate: date,
      isToday: format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
      isActive:
        format(date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd"),
    };
  });

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setVisibleWeek(addWeeks(visibleWeek, 1));
    },
    onSwipedRight: () => {
      setVisibleWeek(subWeeks(visibleWeek, 1));
    },
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 50,
  });

  useEffect(() => {
    const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    if (
      format(currentWeekStart, "yyyy-MM-dd") !==
      format(visibleWeek, "yyyy-MM-dd")
    ) {
      setVisibleWeek(currentWeekStart);
    }
  }, [currentDate]);

  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.key === "ArrowLeft") {
          setCurrentDate(subWeeks(currentDate, 1));
        } else if (e.key === "ArrowRight") {
          setCurrentDate(addWeeks(currentDate, 1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentDate, isMobile, setCurrentDate]);

  return (
    <header className="bg-gradient-to-r fixed top-0 left-0 right-0 z-10 from-[#56ab2f] to-[#a8e063] text-white">
      <div className="flex justify-center md:justify-between items-center p-4">
        {!isMobile && (
          <button
            className="cursor-pointer"
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
          >
            <CircleChevronLeft />
          </button>
        )}
        <AnimatePresence mode="wait">
          <motion.h1
            key={isMobile ? visibleMonth : weekStart}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-lg font-semibold"
          >
            {isMobile ? visibleMonth : `${weekStart} - ${weekEnd}`}
          </motion.h1>
        </AnimatePresence>
        {!isMobile && (
          <button
            className="cursor-pointer"
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          >
            <CircleChevronRight />
          </button>
        )}
      </div>
      {isMobile && (
        <motion.div
          className="flex justify-between px-2 sm:px-4 pb-2 relative"
          {...swipeHandlers}
          initial={false}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {weekDays.map(({ day, date, fullDate, isToday, isActive }) => (
            <button
              key={day + date}
              onClick={() => setCurrentDate(fullDate)}
              className={`flex flex-col max-xs:w-8 w-12 h-16 items-center transition-all ${
                isActive
                  ? "bg-white/20 -translate-y-0.5 shadow-lg"
                  : "hover:bg-white/10"
              } rounded-lg px-3 py-1.5 ${
                isToday ? "text-white bg-white/10 font-medium" : "text-white/70"
              }`}
            >
              <span className="text-xs font-medium">{day}</span>
              <span
                className={`text-sm mt-1 ${
                  isActive ? "font-bold" : isToday ? "font-semibold" : ""
                }`}
              >
                {date}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeDay"
                  className="w-1 h-1 bg-white rounded-full mt-1"
                />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </header>
  );
}
