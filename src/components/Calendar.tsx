"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { useDrop } from "react-dnd/dist/hooks";
import type { DropTargetMonitor } from "react-dnd/dist/types";
import CalendarHeader from "@/components/CalendarHeader";
import DayColumn from "@/components/DayColumn";
import EventDetail from "@/components/EventDetail";
import InfoPage from "@/components/InfoPage";
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
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { CircleHelp } from "lucide-react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventsByDate>(eventsData);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showLoading, setShowLoading] = useState<"left" | "right" | null>(null);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeOpacity, setSwipeOpacity] = useState(1);
  const [isWeekTransition, setIsWeekTransition] = useState(false);
  const [weekTransitionDirection, setWeekTransitionDirection] = useState<
    "left" | "right" | null
  >(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const x = useMotionValue(0);

  const swipeHandlers = useSwipeable({
    onSwiping: (e) => {
      if (!isDragging) {
        setIsSwiping(true);
        const delta = e.deltaX;
        setSwipeProgress(delta);
        x.set(delta);

        const absDelta = Math.abs(delta);
        const newOpacity = Math.max(0.5, 1 - absDelta / 200);
        setSwipeOpacity(newOpacity);
      }
    },
    onSwipedLeft: () => {
      if (!isDragging) {
        setSlideDirection("right");
        setCurrentDate(addDays(currentDate, 1));
        setIsSwiping(false);
        setSwipeProgress(0);
        setSwipeOpacity(1);
        x.set(0);
      }
    },
    onSwipedRight: () => {
      if (!isDragging) {
        setSlideDirection("left");
        setCurrentDate(subDays(currentDate, 1));
        setIsSwiping(false);
        setSwipeProgress(0);
        setSwipeOpacity(1);
        x.set(0);
      }
    },
    onTouchEndOrOnMouseUp: () => {
      setIsSwiping(false);
      setSwipeProgress(0);
      setSwipeOpacity(1);
      x.set(0);
    },
    trackTouch: true,
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 50,
    swipeDuration: 500,
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
    if (selectedEvent) return;
    if (hoverTimeoutRef.current) return;

    setShowLoading(direction);

    hoverTimeoutRef.current = setTimeout(() => {
      setWeekTransitionDirection(direction);
      setIsWeekTransition(true);
      setCurrentDate((prev) =>
        direction === "left"
          ? isMobile
            ? subDays(prev, 1)
            : subWeeks(prev, 1)
          : isMobile
          ? addDays(prev, 1)
          : addWeeks(prev, 1)
      );
      clearHoverState();

      setTimeout(() => {
        setIsWeekTransition(false);
        setWeekTransitionDirection(null);
      }, 500);
    }, 1500);
  };

  const [{ isOverLeft }, dropLeft] = useDrop(
    () => ({
      accept: "EVENT",
      hover: (
        item: { id: string; fromDate: string },
        monitor: DropTargetMonitor
      ) => {
        if (monitor.isOver({ shallow: true }) && !selectedEvent) {
          startHoverCheck("left");
        }
      },
      drop: clearHoverState,
      collect: (monitor: DropTargetMonitor) => ({
        isOverLeft: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [selectedEvent, isMobile]
  );

  const [{ isOverRight }, dropRight] = useDrop(
    () => ({
      accept: "EVENT",
      hover: (
        item: { id: string; fromDate: string },
        monitor: DropTargetMonitor
      ) => {
        if (monitor.isOver({ shallow: true }) && !selectedEvent) {
          startHoverCheck("right");
        }
      },
      drop: clearHoverState,
      collect: (monitor: DropTargetMonitor) => ({
        isOverRight: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [selectedEvent, isMobile]
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
    setWeekTransitionDirection("left");
    setIsWeekTransition(true);
    setCurrentDate((prev) => (isMobile ? subDays(prev, 1) : subWeeks(prev, 1)));
    clearHoverState();

    setTimeout(() => {
      setIsWeekTransition(false);
      setWeekTransitionDirection(null);
    }, 500);
  };

  const handleRightDoubleClick = () => {
    if (selectedEvent) return;
    setWeekTransitionDirection("right");
    setIsWeekTransition(true);
    setCurrentDate((prev) => (isMobile ? addDays(prev, 1) : addWeeks(prev, 1)));
    clearHoverState();

    setTimeout(() => {
      setIsWeekTransition(false);
      setWeekTransitionDirection(null);
    }, 500);
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

  const handleWeekTransition = (direction: "left" | "right") => {
    setWeekTransitionDirection(direction);
    setIsWeekTransition(true);

    setTimeout(() => {
      setIsWeekTransition(false);
      setWeekTransitionDirection(null);
    }, 500);
  };

  return (
    <div className="min-h-screen h-[100vh] overflow-hidden bg-gradient-to-br from-[#F4FBF0] to-[#FAFDF6] text-gray-800 overflow-x-hidden">
      <CalendarHeader
        isMobile={isMobile}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onWeekTransition={handleWeekTransition}
      />
      <div className="mt-[130px] md:mt-[80px]"></div>
      <main
        className="mx-auto h-[80vh] md:h-[85vh] py-6 overflow-x-hidden"
        ref={mainContentRef}
      >
        <div
          {...(isMobile ? swipeHandlers : {})}
          className="relative flex h-full overflow-x-hidden touch-pan-x"
        >
          <AnimatePresence>
            {showLoading && (
              <LoadingIndicator isMobile={isMobile} direction={showLoading} />
            )}
          </AnimatePresence>
          <div
            ref={dropLeftRef}
            data-zone="left"
            className={`${
              isMobile ? "w-[10%]" : "w-[10%]"
            } h-full flex items-center justify-center transition-colors duration-200 select-none`}
            onDoubleClick={
              isMobile ? () => setSelectedEvent(null) : handleLeftDoubleClick
            }
          />
          <div
            className={`${
              isMobile ? "w-[80%]" : "w-[80%]"
            } grid grid-cols-1 md:grid-cols-7 gap-6 overflow-hidden p-1 md:py-2`}
          >
            <AnimatePresence mode="wait">
              {(isMobile ? [currentDate] : days).map((day) => (
                <motion.div
                  key={day.toISOString()}
                  initial={
                    (isMobile && !isSwiping) || isWeekTransition
                      ? {
                          x:
                            slideDirection === "left" ||
                            weekTransitionDirection === "left"
                              ? -100
                              : 100,
                          opacity: 0.5,
                        }
                      : {}
                  }
                  animate={
                    isSwiping
                      ? {
                          x: swipeProgress,
                          opacity: swipeOpacity,
                        }
                      : {
                          x: 0,
                          opacity: 1,
                        }
                  }
                  exit={
                    (isMobile && !isSwiping) || isWeekTransition
                      ? {
                          x:
                            slideDirection === "left" ||
                            weekTransitionDirection === "left"
                              ? 100
                              : -100,
                          opacity: 0.5,
                        }
                      : {}
                  }
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                    mass: 0.5,
                  }}
                  className={isMobile ? "w-full" : ""}
                >
                  <DayColumn
                    date={day}
                    events={events[format(day, "yyyy-MM-dd")] || []}
                    setEvents={setEvents}
                    setIsDragging={setIsDragging}
                    selectedEvent={selectedEvent}
                    setSelectedEvent={setSelectedEvent}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div
            ref={dropRightRef}
            data-zone="right"
            className={`${
              isMobile ? "w-[10%]" : "w-[10%]"
            } h-full flex items-center justify-center transition-colors duration-200 select-none`}
            onDoubleClick={
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
      {showInfo && <InfoPage onClose={() => setShowInfo(false)} />}

      <button
        onClick={() => setShowInfo(true)}
        className="fixed bottom-6 right-6 p-3 bg-[#56ab2f] rounded-full shadow-lg hover:shadow-xl transition-shadow z-30 flex items-center justify-center group cursor-pointer outline-none"
      >
        <CircleHelp color="white" />
      </button>
    </div>
  );
}
