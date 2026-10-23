'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Plus, Layers } from 'lucide-react'
import { DrinkAddon, DrinkLayer, SensoryProfile } from '@/types'

interface CupXRayCanvasProps {
  itemName: string
  layers: DrinkLayer[]
  sensory?: SensoryProfile
  onQuickOrderLayer?: (addon: DrinkAddon, layerName: string) => void
}

const NUM_NODES = 36
const SPRING_K = 0.045
const DAMPING = 0.88
const SPREAD = 0.24

interface WaveBoundary {
  heights: number[]
  velocities: number[]
}

export default function CupXRayCanvas({
  itemName,
  layers,
  sensory,
  onQuickOrderLayer,
}: CupXRayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const isVisibleRef = useRef<boolean>(true)
  const lastPointerXRef = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0)

  const boundariesRef = useRef<WaveBoundary[]>([])

  useEffect(() => {
    setSelectedLayerIndex(0)
    boundariesRef.current = layers.map(() => ({
      heights: new Array(NUM_NODES).fill(0),
      velocities: new Array(NUM_NODES).fill(0),
    }))
  }, [layers])

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (width === 0 || height === 0) return

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    ctx.strokeStyle = 'rgba(42, 157, 143, 0.08)'
    ctx.lineWidth = 1
    const gridStep = 24
    for (let gx = 0; gx < width; gx += gridStep) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, height)
      ctx.stroke()
    }
    for (let gy = 0; gy < height; gy += gridStep) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(width, gy)
      ctx.stroke()
    }

    const cupTopY = height * 0.14
    const cupBottomY = height * 0.88
    const cupHeight = cupBottomY - cupTopY
    const topHalfW = Math.min(width * 0.34, 128)
    const bottomHalfW = Math.min(width * 0.25, 96)
    const centerX = width * 0.5

    const defineCupClipPath = () => {
      ctx.beginPath()
      ctx.moveTo(centerX - topHalfW, cupTopY)
      ctx.lineTo(centerX + topHalfW, cupTopY)
      ctx.lineTo(centerX + bottomHalfW, cupBottomY)
      ctx.lineTo(centerX - bottomHalfW, cupBottomY)
      ctx.closePath()
    }

    ctx.save()
    defineCupClipPath()
    ctx.clip()

    const totalRatio = layers.reduce((acc, l) => acc + l.ratio, 0) || 100
    const liquidTopMargin = cupTopY + cupHeight * 0.08
    const usableLiquidH = cupBottomY - liquidTopMargin

    let cumulativeRatio = 0
    const layerTopYs: number[] = []
    layers.forEach((layer) => {
      const yPos = liquidTopMargin + (cumulativeRatio / totalRatio) * usableLiquidH
      layerTopYs.push(yPos)
      cumulativeRatio += layer.ratio
    })

    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i]
      const baseTopY = layerTopYs[i]
      const wave = boundariesRef.current[i]
      const isSelected = i === selectedLayerIndex

      ctx.beginPath()
      const leftX = centerX - topHalfW - 12
      const rightX = centerX + topHalfW + 12
      const spanW = rightX - leftX

      for (let n = 0; n < NUM_NODES; n++) {
        const nx = leftX + (n / (NUM_NODES - 1)) * spanW
        const offset = wave ? wave.heights[n] : 0
        const ny = baseTopY + offset
        if (n === 0) {
          ctx.moveTo(nx, ny)
        } else {
          ctx.lineTo(nx, ny)
        }
      }

      ctx.lineTo(rightX, cupBottomY + 20)
      ctx.lineTo(leftX, cupBottomY + 20)
      ctx.closePath()

      ctx.fillStyle = layer.color
      ctx.globalAlpha = isSelected ? 0.95 : 0.78
      ctx.fill()

      ctx.beginPath()
      for (let n = 0; n < NUM_NODES; n++) {
        const nx = leftX + (n / (NUM_NODES - 1)) * spanW
        const offset = wave ? wave.heights[n] : 0
        const ny = baseTopY + offset
        if (n === 0) ctx.moveTo(nx, ny)
        else ctx.lineTo(nx, ny)
      }
      ctx.globalAlpha = 1
      ctx.strokeStyle = isSelected ? '#4ECDC4' : 'rgba(245, 245, 245, 0.35)'
      ctx.lineWidth = isSelected ? 2 : 1
      ctx.stroke()
    }

    ctx.restore()

    defineCupClipPath()
    ctx.strokeStyle = '#2A9D8F'
    ctx.lineWidth = 1.75
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(centerX, cupTopY, topHalfW, 8, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(17, 17, 17, 0.85)'
    ctx.fill()
    ctx.strokeStyle = '#2A9D8F'
    ctx.lineWidth = 1.5
    ctx.stroke()

    let currentRatio = 0
    layers.forEach((layer, idx) => {
      const topY = liquidTopMargin + (currentRatio / totalRatio) * usableLiquidH
      const layerH = (layer.ratio / totalRatio) * usableLiquidH
      const midY = topY + layerH * 0.5
      currentRatio += layer.ratio

      const isSelected = idx === selectedLayerIndex
      const progressT = (midY - cupTopY) / cupHeight
      const halfWAtMid = topHalfW - (topHalfW - bottomHalfW) * progressT
      const anchorX = centerX + halfWAtMid * 0.55
      const calloutEndX = Math.min(width - 14, centerX + topHalfW + 32)

      ctx.beginPath()
      ctx.arc(anchorX, midY, isSelected ? 4 : 2.5, 0, Math.PI * 2)
      ctx.fillStyle = isSelected ? '#4ECDC4' : '#F5F5F5'
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(anchorX, midY)
      ctx.lineTo(calloutEndX, midY)
      ctx.strokeStyle = isSelected ? '#4ECDC4' : 'rgba(138, 155, 168, 0.45)'
      ctx.lineWidth = isSelected ? 1.5 : 1
      ctx.stroke()

      ctx.font = 'bold 10px monospace'
      ctx.fillStyle = isSelected ? '#4ECDC4' : '#8A9BA8'
      ctx.textAlign = 'right'
      ctx.fillText(`L0${idx + 1} · ${layer.ratio}%`, calloutEndX, midY - 5)
    })

    ctx.restore()
  }, [layers, selectedLayerIndex])

  const stepPhysics = useCallback(() => {
    if (!isVisibleRef.current) {
      rafRef.current = null
      return
    }

    let totalKineticEnergy = 0
    const boundaries = boundariesRef.current

    for (let b = 0; b < boundaries.length; b++) {
      const { heights, velocities } = boundaries[b]
      for (let i = 0; i < NUM_NODES; i++) {
        const force = -SPRING_K * heights[i]
        velocities[i] = (velocities[i] + force) * DAMPING
        heights[i] += velocities[i]
      }

      const leftDeltas = new Array(NUM_NODES).fill(0)
      const rightDeltas = new Array(NUM_NODES).fill(0)

      for (let i = 0; i < NUM_NODES; i++) {
        if (i > 0) {
          leftDeltas[i] = SPREAD * (heights[i] - heights[i - 1])
          velocities[i - 1] += leftDeltas[i]
        }
        if (i < NUM_NODES - 1) {
          rightDeltas[i] = SPREAD * (heights[i] - heights[i + 1])
          velocities[i + 1] += rightDeltas[i]
        }
      }

      for (let i = 0; i < NUM_NODES; i++) {
        if (i > 0) heights[i - 1] += leftDeltas[i]
        if (i < NUM_NODES - 1) heights[i + 1] += rightDeltas[i]
        totalKineticEnergy += Math.abs(heights[i]) + Math.abs(velocities[i])
      }
    }

    drawFrame()

    if (totalKineticEnergy > 0.08 && !prefersReducedMotion) {
      rafRef.current = window.requestAnimationFrame(stepPhysics)
    } else {
      for (let b = 0; b < boundaries.length; b++) {
        boundaries[b].heights.fill(0)
        boundaries[b].velocities.fill(0)
      }
      drawFrame()
      rafRef.current = null
    }
  }, [drawFrame, prefersReducedMotion])

  const triggerRipple = useCallback(
    (normalizedX: number, impulseStrength: number) => {
      if (prefersReducedMotion) {
        drawFrame()
        return
      }
      const nodeIndex = Math.max(
        1,
        Math.min(NUM_NODES - 2, Math.floor(normalizedX * NUM_NODES))
      )
      boundariesRef.current.forEach((boundary, idx) => {
        const factor = idx === 0 ? 1 : idx === 1 ? 0.8 : 0.65
        boundary.velocities[nodeIndex] += impulseStrength * factor
        if (nodeIndex > 0) {
          boundary.velocities[nodeIndex - 1] += impulseStrength * 0.5 * factor
        }
        if (nodeIndex < NUM_NODES - 1) {
          boundary.velocities[nodeIndex + 1] += impulseStrength * 0.5 * factor
        }
      })

      if (rafRef.current === null && isVisibleRef.current) {
        rafRef.current = window.requestAnimationFrame(stepPhysics)
      }
    },
    [drawFrame, prefersReducedMotion, stepPhysics]
  )

  useEffect(() => {
    drawFrame()
    triggerRipple(0.5, 4.5)
    const onResize = () => drawFrame()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [drawFrame, triggerRipple])

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isVisibleRef.current = Boolean(entry?.isIntersecting)
        if (!entry?.isIntersecting && rafRef.current !== null) {
          window.cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        } else if (entry?.isIntersecting) {
          drawFrame()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [drawFrame])

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    const prevX = lastPointerXRef.current
    lastPointerXRef.current = relX

    const deltaX = prevX !== null ? Math.abs(relX - prevX) : 0.02
    const strength = Math.min(6, Math.max(1.5, deltaX * 55))
    triggerRipple(relX, strength)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const height = rect.height
    const cupTopY = height * 0.14
    const cupBottomY = height * 0.88
    const liquidTop = cupTopY + (cupBottomY - cupTopY) * 0.08
    const usableH = cupBottomY - liquidTop

    if (clickY >= liquidTop && clickY <= cupBottomY) {
      const relRatio = ((clickY - liquidTop) / usableH) * 100
      let acc = 0
      for (let i = 0; i < layers.length; i++) {
        acc += layers[i].ratio
        if (relRatio <= acc) {
          setSelectedLayerIndex(i)
          break
        }
      }
    }
    const relX = (e.clientX - rect.left) / rect.width
    triggerRipple(relX, 5.5)
  }

  const activeLayer = layers[selectedLayerIndex] ?? layers[0]

  return (
    <div
      ref={containerRef}
      className="bg-brand-bg border border-brand-border p-4 sm:p-5 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-2 border-b border-brand-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-tosca" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-brand-white uppercase">
            X-RAY ANATOMY // {itemName.toUpperCase()}
          </span>
        </div>
        <span className="text-[10px] font-mono text-brand-tosca uppercase">
          INTERACTIVE FLUID
        </span>
      </div>

      <div className="relative w-full h-[250px] sm:h-[280px] my-3">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onClick={handleCanvasClick}
          aria-label={`Simulasi anatomi lapisan ${itemName}. Sentuh atau geser untuk menggerakkan lapisan cairan.`}
          className="w-full h-full cursor-crosshair touch-pan-y block"
        />
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {layers.map((layer, idx) => {
          const isSelected = idx === selectedLayerIndex
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => {
                setSelectedLayerIndex(idx)
                triggerRipple(0.5, 4)
              }}
              className={`min-h-[44px] px-2 py-1.5 text-left border transition-colors ${
                isSelected
                  ? 'bg-brand-surface border-brand-tosca'
                  : 'bg-brand-surface/50 border-brand-border hover:border-brand-tosca/60'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[9px] font-mono font-bold text-brand-tosca">
                  L0{idx + 1} · {layer.ratio}%
                </span>
                <span
                  className="w-2.5 h-2.5 border border-brand-white/30 shrink-0"
                  style={{ backgroundColor: layer.color }}
                />
              </div>
              <p className="text-[10px] font-bold text-brand-white truncate mt-0.5">
                {layer.name}
              </p>
            </button>
          )
        })}
      </div>

      {activeLayer && (
        <div className="p-3.5 bg-brand-surface border border-brand-border space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-brand-tosca uppercase">
              SPEC L0{selectedLayerIndex + 1} — {activeLayer.name}
            </span>
            <span className="text-[10px] font-mono text-brand-white font-bold">
              {activeLayer.ratio}% VOL
            </span>
          </div>
          <p className="text-brand-muted text-xs leading-relaxed">
            {activeLayer.specNote}
          </p>

          {sensory && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brand-border/60 font-mono text-[10px]">
              <div>
                <span className="text-brand-muted block">BODY</span>
                <span className="text-brand-white font-bold">{sensory.body}/5</span>
              </div>
              <div>
                <span className="text-brand-muted block">SWEETNESS</span>
                <span className="text-brand-white font-bold">{sensory.sweetness}/5</span>
              </div>
              <div>
                <span className="text-brand-muted block">TEXTURE</span>
                <span className="text-brand-white font-bold">{sensory.creaminess}/5</span>
              </div>
            </div>
          )}

          {onQuickOrderLayer && (
            <button
              type="button"
              onClick={() =>
                onQuickOrderLayer(
                  activeLayer.recommendedBoost ?? 'Normal',
                  activeLayer.name
                )
              }
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-brand-tosca hover:bg-brand-toscaLight text-brand-bg text-[11px] font-mono font-bold tracking-widest uppercase px-3 py-2 transition-colors mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              PESAN DENGAN RACIKAN INI (
              {activeLayer.recommendedBoost && activeLayer.recommendedBoost !== 'Normal'
                ? activeLayer.recommendedBoost.toUpperCase()
                : 'TAKaran STANDAR'}
              )
            </button>
          )}
        </div>
      )}
    </div>
  )
}
