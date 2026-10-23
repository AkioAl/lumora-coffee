'use client'

import { ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTiltDeg?: number
}

const SPRING_CONFIG = { stiffness: 220, damping: 22, mass: 0.6 }

export default function TiltCard({ children, className = '', maxTiltDeg = 9 }: TiltCardProps) {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const hoverStrength = useMotionValue(0)

  const springX = useSpring(pointerX, SPRING_CONFIG)
  const springY = useSpring(pointerY, SPRING_CONFIG)
  const springHover = useSpring(hoverStrength, SPRING_CONFIG)

  const rotateY = useTransform(springX, [0, 1], [-maxTiltDeg, maxTiltDeg])
  const rotateX = useTransform(springY, [0, 1], [maxTiltDeg, -maxTiltDeg])
  const glareX = useTransform(springX, [0, 1], [0, 100])
  const glareY = useTransform(springY, [0, 1], [0, 100])
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(245,245,245,0.16) 0%, rgba(245,245,245,0) 55%)`

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const rect = e.currentTarget.getBoundingClientRect()
    pointerX.set((e.clientX - rect.left) / rect.width)
    pointerY.set((e.clientY - rect.top) / rect.height)
    hoverStrength.set(1)
  }

  const handlePointerLeave = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
    hoverStrength.set(0)
  }

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-30"
        style={{ backgroundImage: glare, opacity: springHover }}
      />
    </motion.div>
  )
}
