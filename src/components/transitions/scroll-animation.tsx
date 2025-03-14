"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import type { ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
  once?: boolean
}

export function ScrollAnimation({
  children,
  delay = 0,
  direction = "up",
  className = "",
  once = true,
}: ScrollAnimationProps) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  const directionVariants = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionVariants[direction] }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

