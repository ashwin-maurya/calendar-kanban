import { Metadata } from "next";
import Calendar from "@/components/Calendar";

export const metadata: Metadata = {
  title: "Calendar Kanban | Planban",
  description:
    "A modern calendar application with drag-and-drop functionality for task management",
  keywords: [
    "calendar",
    "kanban",
    "events",
    "task management",
    "drag and drop",
  ],
};

export default function Home() {
  return <Calendar />;
}
