import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface InfoPageProps {
  onClose: () => void;
}

export default function InfoPage({ onClose }: InfoPageProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />

      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-[#F4FBF0] to-[#FAFDF6] z-50 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative max-w-5xl mx-auto h-full p-8 pt-20 overflow-y-auto">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute cursor-pointer top-5 right-8 p-3 rounded-full hover:bg-gray-100 transition-colors flex gap-2 items-center bg-[#E3F5D9] backdrop-blur-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="hidden md:block">ESC</span>
          </motion.button>

          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl md:text-4xl  font-bold text-gray-900">
              Calendar Kanban Guide
            </h1>

            <section className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Navigation
              </h2>
              <ul className="list-disc max-sm:text-sm  pl-6 space-y-2 text-gray-700">
                <li>
                  On Desktop, Use the arrow buttons in the header to navigate
                  between weeks or use the ctrl + arrow keys
                </li>
                <li>Double-click on the left/right edges to jump a week</li>
                <li>On mobile, swipe left/right to navigate between days</li>
                <li>
                  Click on any day in the mobile view to jump to that date
                </li>
                <li>Swipe the week tab to navigate between weeks on mobile</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Event Management
              </h2>
              <ul className="list-disc max-sm:text-sm  pl-6 space-y-2 text-gray-700">
                <li>Click on any event to view its details</li>
                <li>Drag and drop events between days to reschedule them</li>
                <li>
                  Hover over the edges while dragging to navigate to
                  previous/next days/weeks
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Tips & Tricks
              </h2>
              <ul className="list-disc max-sm:text-sm  pl-6 space-y-2 text-gray-700">
                <li>Use the ESC key to close any open modal</li>
                <li>Empty days show a &quot;No events&quot; placeholder</li>
                <li>Events maintain their order when moved between days</li>
              </ul>
            </section>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
