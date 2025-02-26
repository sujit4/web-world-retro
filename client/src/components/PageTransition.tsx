import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageTransition({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1], // Custom easing that creates a stepped feel
        opacity: { duration: 0.25 }, // Faster opacity transition
        scale: { duration: 0.35 }, // Slightly slower scale for emphasis
      }}
    >
      {children}
    </motion.div>
  );
}