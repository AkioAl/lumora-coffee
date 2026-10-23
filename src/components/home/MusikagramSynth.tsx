'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Power } from 'lucide-react'

type ChannelKey = 'rain' | 'steam' | 'chord'

const CHANNELS: { key: ChannelKey; label: string; ceiling: number }[] = [
  { key: 'rain', label: 'RAIN ON ROOFTOP', ceiling: 0.5 },
  { key: 'steam', label: 'ESPRESSO STEAM & CAFE HUM', ceiling: 0.45 },
  { key: 'chord', label: 'LO-FI WARM CHORD', ceiling: 0.5 },
]

const DEFAULT_VOLUMES: Record<ChannelKey, number> = { rain: 55, steam: 35, chord: 30 }
const CHORD_FREQUENCIES = [130.81, 164.81, 196.0, 246.94]
const FFT_SIZE = 1024

interface AudioGraph {
  ctx: AudioContext
  gains: Record<ChannelKey, GainNode>
  analyser: AnalyserNode
  sources: AudioScheduledSourceNode[]
}

function createNoiseBuffer(ctx: AudioContext, brown: boolean): AudioBuffer {
  const length = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    if (brown) {
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    } else {
      data[i] = white
    }
  }
  return buffer
}

function buildGraph(volumes: Record<ChannelKey, number>): AudioGraph | null {
  const AudioContextCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextCtor) return null

  const ctx = new AudioContextCtor()
  const sources: AudioScheduledSourceNode[] = []

  const master = ctx.createGain()
  master.gain.setValueAtTime(0, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.8)

  const analyser = ctx.createAnalyser()
  analyser.fftSize = FFT_SIZE
  master.connect(analyser)
  analyser.connect(ctx.destination)

  const gains = {} as Record<ChannelKey, GainNode>
  CHANNELS.forEach(({ key, ceiling }) => {
    const g = ctx.createGain()
    g.gain.value = (volumes[key] / 100) * ceiling
    g.connect(master)
    gains[key] = g
  })

  const whiteSource = ctx.createBufferSource()
  whiteSource.buffer = createNoiseBuffer(ctx, false)
  whiteSource.loop = true
  const brownSource = ctx.createBufferSource()
  brownSource.buffer = createNoiseBuffer(ctx, true)
  brownSource.loop = true
  const steamSource = ctx.createBufferSource()
  steamSource.buffer = createNoiseBuffer(ctx, false)
  steamSource.loop = true
  sources.push(whiteSource, brownSource, steamSource)

  const rainHigh = ctx.createBiquadFilter()
  rainHigh.type = 'highpass'
  rainHigh.frequency.value = 1000
  const rainLow = ctx.createBiquadFilter()
  rainLow.type = 'lowpass'
  rainLow.frequency.value = 7000
  const rainHiss = ctx.createGain()
  rainHiss.gain.value = 0.55
  whiteSource.connect(rainHigh).connect(rainLow).connect(rainHiss).connect(gains.rain)

  const rumbleLow = ctx.createBiquadFilter()
  rumbleLow.type = 'lowpass'
  rumbleLow.frequency.value = 300
  const rumbleGain = ctx.createGain()
  rumbleGain.gain.value = 0.6
  brownSource.connect(rumbleLow).connect(rumbleGain).connect(gains.rain)

  const steamBand = ctx.createBiquadFilter()
  steamBand.type = 'bandpass'
  steamBand.frequency.value = 420
  steamBand.Q.value = 0.9
  const steamMod = ctx.createGain()
  steamMod.gain.value = 0.6
  steamSource.connect(steamBand).connect(steamMod).connect(gains.steam)

  const steamLfo = ctx.createOscillator()
  steamLfo.frequency.value = 0.15
  const steamLfoDepth = ctx.createGain()
  steamLfoDepth.gain.value = 0.3
  steamLfo.connect(steamLfoDepth).connect(steamMod.gain)
  sources.push(steamLfo)

  const chordFilter = ctx.createBiquadFilter()
  chordFilter.type = 'lowpass'
  chordFilter.frequency.value = 1100
  const tremolo = ctx.createGain()
  tremolo.gain.value = 0.7
  chordFilter.connect(tremolo).connect(gains.chord)

  const tremoloLfo = ctx.createOscillator()
  tremoloLfo.frequency.value = 0.2
  const tremoloDepth = ctx.createGain()
  tremoloDepth.gain.value = 0.2
  tremoloLfo.connect(tremoloDepth).connect(tremolo.gain)
  sources.push(tremoloLfo)

  CHORD_FREQUENCIES.forEach((freq) => {
    ;(['triangle', 'sine'] as const).forEach((type, idx) => {
      const osc = ctx.createOscillator()
      osc.type = type
      osc.frequency.value = freq
      osc.detune.value = idx === 0 ? -6 : 6
      const oscGain = ctx.createGain()
      oscGain.gain.value = 0.05
      osc.connect(oscGain).connect(chordFilter)
      sources.push(osc)
    })
  })

  sources.forEach((s) => s.start())
  return { ctx, gains, analyser, sources }
}

export default function MusikagramSynth() {
  const reduceMotion = useReducedMotion()
  const [isOn, setIsOn] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  const [volumes, setVolumes] = useState<Record<ChannelKey, number>>(DEFAULT_VOLUMES)

  const graphRef = useRef<AudioGraph | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const volumesRef = useRef(volumes)

  useEffect(() => {
    volumesRef.current = volumes
  }, [volumes])

  const drawIdle = useCallback(() => {
    const canvas = canvasRef.current
    const ctx2d = canvas?.getContext('2d')
    if (!canvas || !ctx2d) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx2d.scale(dpr, dpr)
    ctx2d.clearRect(0, 0, width, height)
    ctx2d.strokeStyle = 'rgba(42, 157, 143, 0.35)'
    ctx2d.lineWidth = 1
    ctx2d.beginPath()
    ctx2d.moveTo(0, height / 2)
    ctx2d.lineTo(width, height / 2)
    ctx2d.stroke()
  }, [])

  const stopAudio = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    const graph = graphRef.current
    graphRef.current = null
    if (graph) {
      graph.sources.forEach((s) => {
        try {
          s.stop()
        } catch {
          return
        }
      })
      void graph.ctx.close()
    }
    setIsOn(false)
    drawIdle()
  }, [drawIdle])

  const startVisualizer = useCallback((analyser: AnalyserNode) => {
    const canvas = canvasRef.current
    const ctx2d = canvas?.getContext('2d')
    if (!canvas || !ctx2d) return
    const samples = new Uint8Array(analyser.fftSize)

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
      }
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)
      analyser.getByteTimeDomainData(samples)
      ctx2d.clearRect(0, 0, width, height)
      ctx2d.strokeStyle = '#2A9D8F'
      ctx2d.lineWidth = 1.5
      ctx2d.beginPath()
      const step = width / (samples.length - 1)
      for (let i = 0; i < samples.length; i++) {
        const y = (samples[i] / 255) * height
        if (i === 0) ctx2d.moveTo(0, y)
        else ctx2d.lineTo(i * step, y)
      }
      ctx2d.stroke()
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
  }, [])

  const handleToggle = () => {
    if (isOn) {
      stopAudio()
      return
    }
    const graph = buildGraph(volumesRef.current)
    if (!graph) {
      setUnsupported(true)
      return
    }
    graphRef.current = graph
    setIsOn(true)
    startVisualizer(graph.analyser)
  }

  const handleVolume = (key: ChannelKey, value: number, ceiling: number) => {
    setVolumes((prev) => ({ ...prev, [key]: value }))
    const graph = graphRef.current
    if (graph) {
      graph.gains[key].gain.setTargetAtTime((value / 100) * ceiling, graph.ctx.currentTime, 0.05)
    }
  }

  useEffect(() => {
    drawIdle()
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      const graph = graphRef.current
      graphRef.current = null
      if (graph) {
        graph.sources.forEach((s) => {
          try {
            s.stop()
          } catch {
            return
          }
        })
        void graph.ctx.close()
      }
    }
  }, [drawIdle])

  return (
    <div className="bg-brand-bg border border-brand-border p-5 sm:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-brand-tosca uppercase">
          MUSIKAGRAM // CAFE SOUNDSCAPE
        </span>
        <span className="text-[10px] font-mono text-brand-muted uppercase">
          {isOn ? 'ON AIR' : 'STANDBY'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div
          aria-hidden="true"
          className={`shrink-0 w-28 h-28 self-center ${isOn && !reduceMotion ? 'animate-spin' : ''}`}
          style={{ animationDuration: '3.2s' }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle cx="60" cy="60" r="58" fill="#0B0B0B" stroke="#2A2A2A" strokeWidth="2" />
            <circle cx="60" cy="60" r="48" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="40" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="32" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="20" fill="#2A9D8F" />
            <line x1="60" y1="42" x2="60" y2="52" stroke="#050505" strokeWidth="2" />
            <circle cx="60" cy="60" r="3" fill="#050505" />
          </svg>
        </div>

        <div className="flex-1 flex flex-col gap-1">
          {CHANNELS.map(({ key, label, ceiling }) => (
            <label
              key={key}
              className="flex flex-col gap-1 min-h-[44px] justify-center text-[10px] font-mono text-brand-muted uppercase"
            >
              <span className="flex items-center justify-between">
                <span>{label}</span>
                <span className="text-brand-white font-bold">{volumes[key]}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={volumes[key]}
                onChange={(e) => handleVolume(key, Number(e.target.value), ceiling)}
                className="w-full accent-brand-tosca h-6"
              />
            </label>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-16 border border-brand-border bg-brand-surface block"
      />

      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isOn}
        className={`w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-mono font-bold tracking-widest uppercase border transition-colors ${
          isOn
            ? 'bg-brand-tosca border-brand-tosca text-brand-bg'
            : 'bg-brand-surface border-brand-border text-brand-white hover:border-brand-tosca'
        }`}
      >
        <Power className="w-4 h-4" />
        {isOn ? 'MATIKAN MUSIKAGRAM' : 'TUNE IN: MUSIKAGRAM AMBIENCE'}
      </button>

      {unsupported && (
        <p className="text-xs font-mono text-amber-400">
          Browser ini tidak mendukung Web Audio API, soundscape tidak dapat dinyalakan.
        </p>
      )}
    </div>
  )
}
