'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function FadeInOnScroll({ children, className, delay = 0 }: FadeInOnScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
