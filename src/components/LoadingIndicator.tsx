import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  direction: "left" | "right";
}

export default function LoadingIndicator({ direction }: LoadingIndicatorProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      key={`loading-${direction}-${Date.now()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed top-1/2 ${
        direction === "left" ? "left-2" : "right-2"
      } transform -translate-y-1/2 z-50`}
    >
      <div className="flex flex-col items-center space-y-2 bg-white/95 backdrop-blur-sm p-4 rounded-full shadow-lg">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
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
              stroke="#3B82F6"
              strokeWidth="8"
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-gray-700"
        >
          {direction === "left" ? "Previous Day" : "Next Day"}
        </motion.div>
      </div>
    </motion.div>
  );
}
