"use client";

import { useDrop } from "react-dnd";
import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import EventCard from "./EventCard";
import { Event, EventsByDate } from "@/lib/types";

interface DayColumnProps {
  date: Date;
  events: Event[];
  setEvents: (events: EventsByDate) => void;
  setCurrentDate: (date: Date) => void;
  setIsDragging: (dragging: boolean) => void;
}

export default function DayColumn({
  date,
  events,
  setEvents,
  setCurrentDate,
  setIsDragging,
}: DayColumnProps) {
  const [traverseTimer, setTraverseTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const moveEvent = (eventId: string, fromDate: string, toDate: string) => {
    setEvents((prev: any) => {
      const updated = { ...prev };
      const event = updated[fromDate].find((e) => e.id === eventId);
      updated[fromDate] = updated[fromDate].filter((e) => e.id !== eventId);
      updated[toDate] = [...(updated[toDate] || []), event!].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
      if (!updated[fromDate].length) delete updated[fromDate];
      return updated;
    });
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "EVENT",
    drop: (item: { id: string; fromDate: string }) => {
      if (traverseTimer) clearTimeout(traverseTimer);
      const toDate = format(date, "yyyy-MM-dd");
      if (item.fromDate !== toDate) {
        moveEvent(item.id, item.fromDate, toDate);
      }
    },
    hover: (item: { id: string; fromDate: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const screenWidth = window.innerWidth;
      const edgeThreshold = screenWidth * 0.1; // 10% of screen width
      const isNearLeft = offset.x < edgeThreshold;
      const isNearRight = offset.x > screenWidth - edgeThreshold;

      if ((isNearLeft || isNearRight) && !traverseTimer) {
        setTraverseTimer(
          setTimeout(() => {
            setCurrentDate(isNearLeft ? subDays(date, 1) : addDays(date, 1));
            setTraverseTimer(null);
          }, 1500) // 1.5s edge traversal
        );
      } else if (!isNearLeft && !isNearRight && traverseTimer) {
        clearTimeout(traverseTimer);
        setTraverseTimer(null);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    return () => {
      if (traverseTimer) clearTimeout(traverseTimer);
    };
  }, [traverseTimer]);

  return (
    <div
      ref={drop}
      className={`border p-2 bg-gray-50 rounded min-h-[200px] w-full md:w-auto ${
        isOver ? "bg-blue-100" : ""
      }`}
    >
      <h2 className="text-sm font-medium">{format(date, "EEE, MMM d")}</h2>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          date={date}
          setIsDragging={setIsDragging}
        />
      ))}
    </div>
  );
}
