"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiCall, getUser } from "@/lib/auth"
import { Flame } from "lucide-react"

interface CandleLighterProps {
  memorialId: string
  candleCount: number
  onCandleAdded: () => void
}

export function CandleLighter({ memorialId, candleCount, onCandleAdded }: CandleLighterProps) {
  const user = getUser()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleLightCandle = async () => {
    if (!user) return

    setLoading(true)
    try {
      await apiCall(`/api/memorials/${memorialId}/candles`, {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
      })
      onCandleAdded()
      setMessage("Candle lit in remembrance")
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      console.error("Failed to light candle:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={handleLightCandle}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 glow-gold dark:glow-amber"
        >
          <Flame className="h-5 w-5" />
          Light a Candle
        </Button>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{candleCount}</p>
          <p className="text-sm text-muted-foreground">candles lit</p>
        </div>
      </div>
      {message && <p className="text-sm text-primary font-medium">{message}</p>}
    </div>
  )
}
