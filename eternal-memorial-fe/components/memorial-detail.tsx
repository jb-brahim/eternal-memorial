"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CandleLighter } from "./candle-lighter"
import { CommentsSection } from "./comments-section"
import { apiCall, getUser } from "@/lib/auth"
import { Edit2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { MemorialImageCarousel } from "./memorial-image-carousel"

interface MemorialDetailProps {
  id: string
}

interface Memorial {
  id: string
  name: string
  story: string
  photos?: string[]
  candleCount: number
  createdAt: string
  userId: string
}

export function MemorialDetail({ id }: MemorialDetailProps) {
  const router = useRouter()
  const user = getUser()
  const [memorial, setMemorial] = useState<Memorial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMemorial = async () => {
      try {
        const data = await apiCall(`/api/memorials/${id}`)
        setMemorial(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load memorial")
      } finally {
        setLoading(false)
      }
    }

    fetchMemorial()
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this memorial?")) return

    try {
      await apiCall(`/api/memorials/${id}`, { method: "DELETE" })
      router.push("/memorials")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete memorial")
    }
  }

  const isOwner = user?.id === memorial?.userId

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading memorial...</p>
        </div>
      </div>
    )
  }

  if (error || !memorial) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        <p>{error || "Memorial not found"}</p>
      </div>
    )
  }

  const date = new Date(memorial.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      {memorial.photos && memorial.photos.length > 0 && (
        <MemorialImageCarousel 
          images={memorial.photos} 
          interval={3000}
        />
      )}

      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl text-foreground">{memorial.name}</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">{date}</CardDescription>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push(`/memorials/${id}/edit`)}
                  className="border-border/50 hover:bg-primary/10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDelete}
                  className="border-border/50 hover:bg-destructive/10 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Story & Memories</h3>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">{memorial.story}</p>
          </div>

          <div className="border-t border-border/50 pt-6">
            <CandleLighter
              memorialId={id}
              candleCount={memorial.candleCount}
              onCandleAdded={() => {
                setMemorial({ ...memorial, candleCount: memorial.candleCount + 1 })
              }}
            />
          </div>
        </CardContent>
      </Card>

      <CommentsSection memorialId={id} />
    </div>
  )
}
