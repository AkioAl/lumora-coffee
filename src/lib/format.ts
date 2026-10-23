import { Location } from '@/types'

export function formatPrice(min: number, max: number): string {
  const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`
  return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`
}

export type BranchLiveStatus = {
  state: 'OPEN' | 'CLOSING_SOON' | 'CLOSED'
  label: string
  detail: string
}

export function getWibCurrentMinutes(now: Date = new Date()): number {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(now)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  return hour * 60 + minute
}

export function getBranchLiveStatus(location: Location, now: Date = new Date()): BranchLiveStatus {
  const currentMin = getWibCurrentMinutes(now)
  const openMin = location.openHour * 60
  const closeMin = location.closeHour * 60

  if (currentMin >= openMin && currentMin < closeMin) {
    const remainingMin = closeMin - currentMin
    if (remainingMin <= 60) {
      return {
        state: 'CLOSING_SOON',
        label: 'CLOSING SOON',
        detail: `Tutup ${remainingMin} menit lagi`,
      }
    }
    const closeHourFormatted = `${String(location.closeHour % 24).padStart(2, '0')}:00 WIB`
    return {
      state: 'OPEN',
      label: 'OPEN NOW',
      detail: `Buka s/d ${closeHourFormatted}`,
    }
  }

  const openHourFormatted = `${String(location.openHour).padStart(2, '0')}:00 WIB`
  return {
    state: 'CLOSED',
    label: 'CLOSED',
    detail: `Buka kembali ${openHourFormatted}`,
  }
}

export function calculateHaversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function formatDistanceAndEta(distanceKm: number): {
  distanceText: string
  etaText: string
} {
  const roundedKm = distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm).toString()
  const estimatedMinutes = Math.max(3, Math.round((distanceKm / 28) * 60))

  if (estimatedMinutes >= 60) {
    const hours = Math.floor(estimatedMinutes / 60)
    const mins = estimatedMinutes % 60
    return {
      distanceText: `${roundedKm} KM`,
      etaText: mins > 0 ? `~${hours}j ${mins}m berkendara` : `~${hours} jam berkendara`,
    }
  }

  return {
    distanceText: `${roundedKm} KM`,
    etaText: `~${estimatedMinutes} mnt berkendara`,
  }
}
