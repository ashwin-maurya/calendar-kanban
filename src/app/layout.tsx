"use client";

import { DndProvider } from "react-dnd/dist/core";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./globals.css";
import { useState, useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <html lang="en">
        <body>
          {isClient ? (
            <DndProvider backend={HTML5Backend}>{children}</DndProvider>
          ) : null}
        </body>
      </html>
    </>
  );
}
