"use client";

import { DndProvider } from "react-dnd/dist/core";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./globals.css";
import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
});

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
        <body className={poppins.variable}>
          {isClient ? (
            <DndProvider backend={HTML5Backend}>{children}</DndProvider>
          ) : null}
        </body>
      </html>
    </>
  );
}
