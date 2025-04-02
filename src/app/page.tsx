"use client";

import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { useDrop } from "react-dnd";
import type { DropTargetMonitor } from "react-dnd";
import CalendarHeader from "@/components/CalendarHeader";
import DayColumn from "@/components/DayColumn";
import EventDetail from "@/components/EventDetail";
import LoadingIndicator from "@/components/LoadingIndicator";
import eventsData from "@/data/event";
import { EventsByDate } from "@/lib/types";
import {
  format,
  startOfWeek,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
} from "date-fns";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date("2025-03-31"));
  const [events, setEvents] = useState<EventsByDate>(eventsData);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLoading, setShowLoading] = useState<"left" | "right" | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => !isDragging && setCurrentDate(addDays(currentDate, 1)),
    onSwipedRight: () => !isDragging && setCurrentDate(subDays(currentDate, 1)),
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const clearHoverState = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowLoading(null);
  };

  const startHoverCheck = (direction: "left" | "right") => {
    clearHoverState();
    setShowLoading(direction);

    hoverTimeoutRef.current = setTimeout(() => {
      setCurrentDate((prev) =>
        direction === "left" ? subWeeks(prev, 1) : addWeeks(prev, 1)
      );
      clearHoverState();
    }, 1500);
  };

  const [{ isOverLeft }, dropLeft] = useDrop(
    () => ({
      accept: "EVENT",
      hover: (
        item: { id: string; fromDate: string },
        monitor: DropTargetMonitor
      ) => {
        if (monitor.isOver({ shallow: true }) && !hoverTimeoutRef.current) {
          startHoverCheck("left");
        }
      },
      drop: clearHoverState,
      collect: (monitor: DropTargetMonitor) => ({
        isOverLeft: !!monitor.isOver({ shallow: true }),
      }),
    }),
    []
  );

  const [{ isOverRight }, dropRight] = useDrop(
    () => ({
      accept: "EVENT",
      hover: (
        item: { id: string; fromDate: string },
        monitor: DropTargetMonitor
      ) => {
        if (monitor.isOver({ shallow: true }) && !hoverTimeoutRef.current) {
          startHoverCheck("right");
        }
      },
      drop: clearHoverState,
      collect: (monitor: DropTargetMonitor) => ({
        isOverRight: !!monitor.isOver({ shallow: true }),
      }),
    }),
    []
  );

  useEffect(() => {
    return clearHoverState;
  }, []);

  useEffect(() => {
    if (!isOverLeft && !isOverRight) {
      clearHoverState();
    }
  }, [isOverLeft, isOverRight]);
  const handleLeftDoubleClick = () => {
    setCurrentDate((prev) => subWeeks(prev, 1));
    clearHoverState();
  };

  const handleRightDoubleClick = () => {
    setCurrentDate((prev) => addWeeks(prev, 1));
    clearHoverState();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8ff] to-[#eef1f9] text-gray-800">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <main {...(isMobile ? swipeHandlers : {})} className="mx-auto px-4 py-6">
        <AnimatePresence>
          {showLoading && <LoadingIndicator direction={showLoading} />}
        </AnimatePresence>
        <div className="relative flex h-[calc(100vh-12rem)]">
          <div
            ref={dropLeft}
            data-zone="left"
            className={`w-[10%] h-full flex items-center justify-center transition-colors duration-200 select-none`}
            onDoubleClick={handleLeftDoubleClick}
          />
          <div className="w-[80%] grid grid-cols-1 md:grid-cols-7 gap-6">
            {(isMobile ? [currentDate] : days).map((day) => (
              <DayColumn
                key={day.toISOString()}
                date={day}
                events={events[format(day, "yyyy-MM-dd")] || []}
                setEvents={setEvents}
                setIsDragging={setIsDragging}
              />
            ))}
          </div>
          <div
            ref={dropRight}
            data-zone="right"
            className={`w-[10%] h-full flex items-center justify-center transition-colors duration-200 select-none`}
            onDoubleClick={handleRightDoubleClick}
          />
        </div>
      </main>
      {selectedEvent && (
        <EventDetail
          event={
            Object.values(events)
              .flat()
              .find((e) => e.id === selectedEvent)!
          }
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
