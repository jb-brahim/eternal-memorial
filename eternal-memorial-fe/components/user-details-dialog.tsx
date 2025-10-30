"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiCall } from "@/lib/auth"
import { Card } from "./ui/card"
import { format } from "date-fns"

interface Memorial {
  _id: string
  title: string
  description: string
  createdAt: string
}

interface Comment {
  _id: string
  text: string
  memorialId: string
  memorialTitle: string
  createdAt: string
  isHidden?: boolean
}

interface CandleLog {
  _id: string
  memorialId: string
  memorialTitle: string
  createdAt: string
}

interface UserDetailsDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsDialog({ userId, open, onOpenChange }: UserDetailsDialogProps) {
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [candles, setCandles] = useState<CandleLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!open || !userId) return
      
      setLoading(true)
      setError(null)
      
      try {
        console.log("Fetching details for user:", userId)
        
        const memorialsPromise = apiCall(`/api/admin/users/${userId}/memorials`)
        console.log("Fetching memorials...")
        
        const commentsPromise = apiCall(`/api/admin/users/${userId}/comments`)
        console.log("Fetching comments...")
        
        const candlesPromise = apiCall(`/api/admin/users/${userId}/candles`)
        console.log("Fetching candles...")

        const [memorialsData, commentsData, candlesData] = await Promise.all([
          memorialsPromise,
          commentsPromise,
          candlesPromise
        ])

        console.log("Memorials data:", memorialsData)
        console.log("Comments data:", commentsData)
        console.log("Candles data:", candlesData)

        setMemorials(memorialsData || [])
        setComments(commentsData || [])
        setCandles(candlesData || [])
      } catch (err: any) {
        console.error("Failed to fetch user details:", err)
        setError(err?.message || "Failed to load user details")
        // Reset the data on error
        setMemorials([])
        setComments([])
        setCandles([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [userId, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View user's memorials, comments, and candle lighting history
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="memorials" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="memorials">
              Memorials ({memorials.length})
            </TabsTrigger>
            <TabsTrigger value="comments">
              Comments ({comments.length})
            </TabsTrigger>
            <TabsTrigger value="candles">
              Candles ({candles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="memorials">
            {loading ? (
              <p className="text-center py-4">Loading memorials...</p>
            ) : error ? (
              <p className="text-center py-4 text-destructive">{error}</p>
            ) : memorials.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No memorials found</p>
            ) : (
              <div className="space-y-4">
                {memorials.map((memorial) => (
                  <Card key={memorial._id} className="p-4">
                    <h3 className="font-medium mb-2">{memorial.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{memorial.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Created on {format(new Date(memorial.createdAt), "MMM d, yyyy")}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments">
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : comments.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No comments found</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment._id} className="p-4">
                    <h3 className="font-medium mb-2">{comment.memorialTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{comment.text}</p>
                    <p className="text-xs text-muted-foreground">
                      Commented on {format(new Date(comment.createdAt), "MMM d, yyyy")}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="candles">
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : candles.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No candles found</p>
            ) : (
              <div className="space-y-4">
                {candles.map((candle) => (
                  <Card key={candle._id} className="p-4">
                    <h3 className="font-medium mb-2">{candle.memorialTitle}</h3>
                    <p className="text-xs text-muted-foreground">
                      Lit on {format(new Date(candle.createdAt), "MMM d, yyyy")}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}