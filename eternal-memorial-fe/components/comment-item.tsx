"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ContentActions } from "./content-actions"
import { apiCall, getUser } from "@/lib/auth"
import { Trash2 } from "lucide-react"

interface CommentItemProps {
  id: string
  memorialId: string
  author: string
  content: string
  createdAt: string
  userId: string
  onCommentDeleted: () => void
}

export function CommentItem({
  id,
  memorialId,
  author,
  content,
  createdAt,
  userId,
  onCommentDeleted,
}: CommentItemProps) {
  const user = getUser()
  const [deleting, setDeleting] = useState(false)
  const isAuthor = user?.id === userId

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return

    setDeleting(true)
    try {
      await apiCall(`/api/memorials/${memorialId}/comments/${id}`, { method: "DELETE" })
      onCommentDeleted()
    } catch (err) {
      console.error("Failed to delete comment:", err)
    } finally {
      setDeleting(false)
    }
  }

  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold text-foreground">{author}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
          <div className="flex items-center gap-1">
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleting}
                className="h-8 w-8 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
            <ContentActions contentId={id} contentType="comment" />
          </div>
        </div>
        <p className="text-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  )
}
