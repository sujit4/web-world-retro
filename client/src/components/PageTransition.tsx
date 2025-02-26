import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageTransition({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        ease: [0, 0.5, 0.5, 1], // Custom easing for pixelated feel
      }}
    >
      {children}
    </motion.div>
  );
}