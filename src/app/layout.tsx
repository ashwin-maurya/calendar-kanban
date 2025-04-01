"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./globals.css";

// export const metadata = {
//   title: "Calendar Kanban Board",
//   description: "A draggable calendar experience",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
      </body>
    </html>
  );
}
