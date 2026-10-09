"use client";

import { motion, MotionConfig } from "motion/react";

/* Transição curta entre páginas; respeita "reduzir movimento" do aparelho */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
