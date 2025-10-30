"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiCall } from "@/lib/auth"
import { Users, Heart, MessageSquare, Flame } from "lucide-react"

interface Stats {
  users: number
  memorials: number
  comments: number
  candles: number
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiCall("/api/admin/stats")
        // Transform the data to match our display needs
        setStats({
          users: data.users ?? 0,
          memorials: data.memorials ?? 0,
          comments: data.comments ?? 0,
          candles: data.candles ?? 0
        })
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <p className="text-muted-foreground">Loading statistics...</p>
  }

  if (!stats) {
    return <p className="text-destructive">Failed to load statistics</p>
  }

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-500" },
    { label: "Total Memorials", value: stats.memorials, icon: Heart, color: "text-red-500" },
    { label: "Total Comments", value: stats.comments, icon: MessageSquare, color: "text-amber-500" },
    { label: "Candles Lit", value: stats.candles, icon: Flame, color: "text-orange-500" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
