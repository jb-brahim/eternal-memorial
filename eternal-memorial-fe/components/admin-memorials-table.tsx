"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiCall } from "@/lib/auth"
import { Trash2 } from "lucide-react"

interface Memorial {
  id: string
  name: string
  author: string
  candleCount: number
  commentCount: number
  createdAt: string
}

export function AdminMemorialsTable() {
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemorials = async () => {
      try {
        const data = await apiCall("/api/admin/memorials")
        setMemorials(data)
      } catch (err) {
        console.error("Failed to fetch memorials:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMemorials()
  }, [])

  const handleDeleteMemorial = async (memorialId: string) => {
    if (!confirm("Delete this memorial?")) return

    try {
      await apiCall(`/api/admin/memorials/${memorialId}`, { method: "DELETE" })
      setMemorials(memorials.filter((m) => m.id !== memorialId))
    } catch (err) {
      console.error("Failed to delete memorial:", err)
    }
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">Memorials</CardTitle>
        <CardDescription className="text-muted-foreground">{memorials.length} total memorials</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading memorials...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Author</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Candles</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Comments</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memorials.map((memorial) => (
                  <tr key={memorial.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground font-medium">{memorial.name}</td>
                    <td className="py-3 px-4 text-foreground">{memorial.author}</td>
                    <td className="py-3 px-4 text-foreground">{memorial.candleCount}</td>
                    <td className="py-3 px-4 text-foreground">{memorial.commentCount}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {new Date(memorial.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMemorial(memorial.id)}
                        className="border-border/50 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
