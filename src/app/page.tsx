"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { useDrop } from "react-dnd/dist/hooks";
import type { DropTargetMonitor } from "react-dnd/dist/types";
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
    onSwipedLeft: () =>
      !isDragging && !selectedEvent && setCurrentDate(addDays(currentDate, 1)),
    onSwipedRight: () =>
      !isDragging && !selectedEvent && setCurrentDate(subDays(currentDate, 1)),
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const clearHoverState = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowLoading(null);
  };

  const startHoverCheck = (direction: "left" | "right") => {
    if (selectedEvent) return; // Don't allow hover checks when detail view is open
    clearHoverState();
    setShowLoading(direction);

    hoverTimeoutRef.current = setTimeout(() => {
      setCurrentDate((prev) =>
        direction === "left" ? subDays(prev, 1) : addDays(prev, 1)
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
        if (
          monitor.isOver({ shallow: true }) &&
          !hoverTimeoutRef.current &&
          !selectedEvent
        ) {
          startHoverCheck("left");
        }
      },
      drop: clearHoverState,
      collect: (monitor: DropTargetMonitor) => ({
        isOverLeft: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [selectedEvent]
  );

  const [{ isOverRight }, dropRight] = useDrop(
    () => ({
      accept: "EVENT",
      hover: (
        item: { id: string; fromDate: string },
        monitor: DropTargetMonitor
      ) => {
        if (
          monitor.isOver({ shallow: true }) &&
          !hoverTimeoutRef.current &&
          !selectedEvent
        ) {
          startHoverCheck("right");
        }
      },
      drop: clearHoverState,
      collect: (monitor: DropTargetMonitor) => ({
        isOverRight: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [selectedEvent]
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
    if (selectedEvent) return;
    setCurrentDate((prev) => subWeeks(prev, 1));
    clearHoverState();
  };

  const handleRightDoubleClick = () => {
    if (selectedEvent) return;
    setCurrentDate((prev) => addWeeks(prev, 1));
    clearHoverState();
  };

  const dropLeftRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) dropLeft(node);
    },
    [dropLeft]
  );

  const dropRightRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) dropRight(node);
    },
    [dropRight]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8ff] to-[#eef1f9] text-gray-800 overflow-x-hidden">
      <CalendarHeader
        isMobile={isMobile}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <main
        {...(isMobile ? swipeHandlers : {})}
        className="mx-auto h-[calc(100vh)] py-6 overflow-hidden"
      >
        <AnimatePresence>
          {showLoading && <LoadingIndicator direction={showLoading} />}
        </AnimatePresence>
        <div className="relative flex h-[calc(100vh-12rem)] overflow-hidden">
          <div
            ref={dropLeftRef}
            data-zone="left"
            className={`${
              isMobile ? "w-[10%]" : "w-[10%]"
            } h-full flex items-center justify-center transition-colors duration-200 select-none`}
            onClick={
              isMobile ? () => setSelectedEvent(null) : handleLeftDoubleClick
            }
          />
          <div
            className={`${
              isMobile ? "w-[80%]" : "w-[80%]"
            } grid grid-cols-1 md:grid-cols-7 gap-6 overflow-hidden`}
          >
            {(isMobile ? [currentDate] : days).map((day) => (
              <DayColumn
                key={day.toISOString()}
                date={day}
                events={events[format(day, "yyyy-MM-dd")] || []}
                setEvents={setEvents}
                setIsDragging={setIsDragging}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
              />
            ))}
          </div>
          <div
            ref={dropRightRef}
            data-zone="right"
            className={`${
              isMobile ? "w-[10%]" : "w-[10%]"
            } h-full flex items-center justify-center transition-colors duration-200 select-none`}
            onClick={
              isMobile ? () => setSelectedEvent(null) : handleRightDoubleClick
            }
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
