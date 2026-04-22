"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HoverLift({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={reduceMotion ? undefined : { type: "spring", stiffness: 220, damping: 24 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
