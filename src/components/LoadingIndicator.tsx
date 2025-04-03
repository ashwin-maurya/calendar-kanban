import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  direction: "left" | "right";
  isMobile: boolean;
}

export default function LoadingIndicator({
  direction,
  isMobile,
}: LoadingIndicatorProps) {
  const radius = isMobile ? 35 : 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      key={`loading-${direction}-${Date.now()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed top-1/2 ${
        direction === "left" ? "left-1 md:left-2" : "right-1 md:right-2"
      } transform -translate-y-1/2 z-50`}
    >
      <div className="flex flex-col items-center space-y-1 md:space-y-2 bg-white/95 backdrop-blur-sm p-2 md:p-4 rounded-full shadow-lg">
        <div className="relative w-12 h-12 md:w-16 md:h-16">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#a8e063"
              strokeWidth={isMobile ? 10 : 8}
            />
          </svg>

          <motion.svg
            key={`progress-${direction}-${Date.now()}`}
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 100 100"
            initial={{ rotate: -90 }}
            animate={{ rotate: -90 }}
          >
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#56ab2f"
              strokeWidth={isMobile ? 10 : 6}
              strokeDasharray={circumference}
              initial={{
                strokeDashoffset: direction === "right" ? circumference : 0,
              }}
              animate={{
                strokeDashoffset: direction === "right" ? 0 : circumference,
              }}
              transition={{ duration: 1.5, ease: "linear" }}
            />
          </motion.svg>
        </div>
      </div>
    </motion.div>
  );
}
