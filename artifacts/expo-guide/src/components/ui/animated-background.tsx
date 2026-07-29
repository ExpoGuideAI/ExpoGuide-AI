import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className }: BackgroundProps) {
  return (
    <div className={cn("fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background", className)}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-expo-teal/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[20%] -left-20 w-[500px] h-[500px] bg-expo-purple/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 right-[20%] w-[400px] h-[400px] bg-expo-blue/20 rounded-full blur-[90px]"
      />
    </div>
  );
}
