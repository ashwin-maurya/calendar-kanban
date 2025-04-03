"use client";

import { useDrop } from "react-dnd/dist/hooks";
import type { DropTargetMonitor } from "react-dnd/dist/types";
import { format } from "date-fns";
import EventCard from "./EventCard";
import { Event, EventsByDate } from "@/lib/types";
import { useCallback } from "react";
import type { SetStateAction } from "react";

interface DayColumnProps {
  date: Date;
  events: Event[];
  setEvents: (value: SetStateAction<EventsByDate>) => void;
  setIsDragging: (dragging: boolean) => void;
  selectedEvent: string | null;
  setSelectedEvent: (eventId: string | null) => void;
}

export default function DayColumn({
  date,
  events,
  setEvents,
  setIsDragging,
  selectedEvent,
  setSelectedEvent,
}: DayColumnProps) {
  const moveEvent = (eventId: string, fromDate: string, toDate: string) => {
    setEvents((prev: EventsByDate) => {
      const updated: { [key: string]: Event[] } = { ...prev };
      const event = updated[fromDate]?.find((e) => e.id === eventId);
      if (!event) return prev;
      updated[fromDate] = updated[fromDate].filter((e) => e.id !== eventId);
      updated[toDate] = [...(updated[toDate] || []), event].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
      if (!updated[fromDate].length) delete updated[fromDate];
      return updated;
    });
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "EVENT",
    drop: (item: { id: string; fromDate: string }) => {
      const toDate = format(date, "yyyy-MM-dd");
      if (item.fromDate !== toDate) {
        moveEvent(item.id, item.fromDate, toDate);
      }
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const dropRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) drop(node);
    },
    [drop]
  );

  return (
    <div
      ref={dropRef}
      data-date={format(date, "yyyy-MM-dd")}
      className={`flex flex-col h-full bg-white rounded-lg shadow-sm border border-[#E3F5D9] transition-all duration-300 w-full ${
        isOver ? "ring-2 ring-[#56ab2f]" : ""
      }`}
    >
      <div className="p-3 border-b border-[#E3F5D9] rounded-t-lg bg-[#E3F5D9]">
        <h2 className="text-sm font-semibold text-gray-700">
          {format(date, "EEE")}
        </h2>
        <p className="text-xs text-gray-500">{format(date, "MMM d")}</p>
      </div>
      <div className="flex-1 p-2 min-h-[200px] overflow-y-auto overflow-x-hidden">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-gray-400">No events</p>
          </div>
        ) : (
          events.map((event, i) => (
            <EventCard
              key={event.id + "-" + i}
              event={event}
              date={date}
              setIsDragging={setIsDragging}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          ))
        )}
      </div>
    </div>
  );
}
