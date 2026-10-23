'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react'
import {
  BaristaTicketItem,
  DrinkAddon,
  DrinkSweetness,
  DrinkTemp,
  MenuItem,
  OrderType,
} from '@/types'
import { locations } from '@/data/locations'

const STORAGE_KEY = 'lumora_barista_ticket'

export const ADDON_PRICE_MAP: Record<DrinkAddon, number> = {
  'Normal': 0,
  '+Extra Espresso Shot': 6000,
  '+Extra Sea Salt Foam': 5000,
}

export interface AddTicketOptions {
  quantity?: number
  temp?: DrinkTemp
  sweetness?: DrinkSweetness
  addon?: DrinkAddon
  note?: string
  openDrawerAfter?: boolean
}

interface StoredTicketState {
  items: BaristaTicketItem[]
  branchId: string
  zoneCode: string
  orderType: OrderType
  splitCount: number
  includeTax: boolean
  ticketNumber: string
}

interface BaristaTicketContextValue {
  items: BaristaTicketItem[]
  branchId: string
  zoneCode: string
  orderType: OrderType
  splitCount: number
  includeTax: boolean
  ticketNumber: string
  isOpen: boolean
  totalCount: number
  subtotal: number
  taxAmount: number
  grandTotal: number
  perPersonAmount: number
  setIsOpen: (open: boolean) => void
  setBranchId: (id: string) => void
  setZoneCode: (code: string) => void
  setOrderType: (type: OrderType) => void
  setSplitCount: (count: number) => void
  setIncludeTax: (inc: boolean) => void
  addItem: (item: MenuItem, options?: AddTicketOptions) => void
  updateQuantity: (uid: string, delta: number) => void
  removeItem: (uid: string) => void
  clearTicket: () => void
  selectBranchZoneAndOpen: (branchId: string, zoneCode: string) => void
}

const BaristaTicketContext = createContext<BaristaTicketContextValue | null>(null)

export function BaristaTicketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BaristaTicketItem[]>([])
  const [branchId, setBranchId] = useState<string>(locations[0]?.id ?? 'tomang')
  const [zoneCode, setZoneCode] = useState<string>('Z-01')
  const [orderType, setOrderType] = useState<OrderType>('WFC Dine-In')
  const [splitCount, setSplitCount] = useState<number>(2)
  const [includeTax, setIncludeTax] = useState<boolean>(true)
  const [ticketNumber, setTicketNumber] = useState<string>('LMR-042')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [hydrated, setHydrated] = useState<boolean>(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredTicketState>
        if (Array.isArray(parsed.items)) setItems(parsed.items)
        if (typeof parsed.branchId === 'string') setBranchId(parsed.branchId)
        if (typeof parsed.zoneCode === 'string') setZoneCode(parsed.zoneCode)
        if (parsed.orderType) setOrderType(parsed.orderType)
        if (typeof parsed.splitCount === 'number') {
          setSplitCount(Math.min(10, Math.max(2, parsed.splitCount)))
        }
        if (typeof parsed.includeTax === 'boolean') setIncludeTax(parsed.includeTax)
        if (typeof parsed.ticketNumber === 'string') setTicketNumber(parsed.ticketNumber)
      } else {
        const randomNum = Math.floor(100 + Math.random() * 899)
        setTicketNumber(`LMR-${randomNum}`)
      }
    } catch {
      setTicketNumber('LMR-108')
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      const payload: StoredTicketState = {
        items,
        branchId,
        zoneCode,
        orderType,
        splitCount,
        includeTax,
        ticketNumber,
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      void 0
    }
  }, [items, branchId, zoneCode, orderType, splitCount, includeTax, ticketNumber, hydrated])

  const addItem = (menuItem: MenuItem, options?: AddTicketOptions) => {
    const isDrink = menuItem.category === 'kopi' || menuItem.category === 'non-coffee'
    const temp: DrinkTemp | undefined = isDrink ? (options?.temp ?? 'Iced') : undefined
    const sweetness: DrinkSweetness | undefined = isDrink
      ? (options?.sweetness ?? 'Normal 100%')
      : undefined
    const addon: DrinkAddon | undefined = isDrink ? (options?.addon ?? 'Normal') : undefined
    const note = options?.note?.trim() || undefined
    const qtyToAdd = Math.max(1, options?.quantity ?? 1)
    const addonCost = addon ? ADDON_PRICE_MAP[addon] : 0
    const unitPrice = menuItem.priceMin + addonCost

    const uid = [
      menuItem.id,
      temp ?? 'food',
      sweetness ?? 'std',
      addon ?? 'none',
      note ?? '',
    ].join('::')

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.uid === uid)
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qtyToAdd,
        }
        return updated
      }
      return [
        ...prev,
        {
          uid,
          menuId: menuItem.id,
          name: menuItem.name,
          category: menuItem.category,
          unitPrice,
          quantity: qtyToAdd,
          temp,
          sweetness,
          addon,
          note,
        },
      ]
    })

    if (options?.openDrawerAfter) {
      setIsOpen(true)
    }
  }

  const updateQuantity = (uid: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.uid === uid ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (uid: string) => {
    setItems((prev) => prev.filter((item) => item.uid !== uid))
  }

  const clearTicket = () => {
    setItems([])
  }

  const selectBranchZoneAndOpen = (newBranchId: string, newZoneCode: string) => {
    setBranchId(newBranchId)
    setZoneCode(newZoneCode)
    setOrderType('WFC Dine-In')
    setIsOpen(true)
  }

  const { totalCount, subtotal, taxAmount, grandTotal, perPersonAmount } = useMemo(() => {
    const count = items.reduce((acc, i) => acc + i.quantity, 0)
    const sub = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0)
    const tax = includeTax ? Math.round(sub * 0.1) : 0
    const grand = sub + tax
    const perPerson = splitCount > 0 ? Math.ceil(grand / splitCount) : grand
    return {
      totalCount: count,
      subtotal: sub,
      taxAmount: tax,
      grandTotal: grand,
      perPersonAmount: perPerson,
    }
  }, [items, includeTax, splitCount])

  return (
    <BaristaTicketContext.Provider
      value={{
        items,
        branchId,
        zoneCode,
        orderType,
        splitCount,
        includeTax,
        ticketNumber,
        isOpen,
        totalCount,
        subtotal,
        taxAmount,
        grandTotal,
        perPersonAmount,
        setIsOpen,
        setBranchId,
        setZoneCode,
        setOrderType,
        setSplitCount,
        setIncludeTax,
        addItem,
        updateQuantity,
        removeItem,
        clearTicket,
        selectBranchZoneAndOpen,
      }}
    >
      {children}
    </BaristaTicketContext.Provider>
  )
}

export function useBaristaTicket() {
  const ctx = useContext(BaristaTicketContext)
  if (!ctx) {
    throw new Error('useBaristaTicket must be used within a BaristaTicketProvider')
  }
  return ctx
}
