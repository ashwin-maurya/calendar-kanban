"use client";

import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import CalendarHeader from "@/components/CalendarHeader";
import DayColumn from "@/components/DayColumn";
import EventDetail from "@/components/EventDetail";
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

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date("2025-03-31"));
  const [events, setEvents] = useState<EventsByDate>(eventsData);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Week days for desktop
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => !isDragging && setCurrentDate(addDays(currentDate, 1)),
    onSwipedRight: () => !isDragging && setCurrentDate(subDays(currentDate, 1)),
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  // Responsive logic: Show 1 day on mobile, 7 days on desktop
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8ff] to-[#eef1f9] text-gray-800">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <main
        {...(isMobile ? swipeHandlers : {})}
        className="p-4 flex flex-col md:grid md:grid-cols-7 gap-4 overflow-hidden"
      >
        {(isMobile ? [currentDate] : days).map((day) => (
          <DayColumn
            key={day.toISOString()}
            date={day}
            events={events[format(day, "yyyy-MM-dd")] || []}
            setEvents={setEvents}
            setCurrentDate={setCurrentDate}
            setIsDragging={setIsDragging}
          />
        ))}
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
