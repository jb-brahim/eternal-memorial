"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CommentItem } from "./comment-item"
import { apiCall, getUser } from "@/lib/auth"
import { MessageCircle } from "lucide-react"

interface Comment {
  _id: string
  author: string
  content: string
  createdAt: string
  userId: string
  memorialId: string
  isHidden?: boolean
}

interface CommentsSectionProps {
  memorialId: string
}

export function CommentsSection({ memorialId }: CommentsSectionProps) {
  const user = getUser()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await apiCall(`/api/memorials/${memorialId}/comments`)
        // Transform the data to match our interface
        const transformedComments = data.map((comment: any) => ({
          _id: comment._id,
          author: comment.author || "Anonymous",
          content: comment.content,
          createdAt: comment.createdAt,
          userId: comment.userId,
          memorialId: comment.memorialId,
          isHidden: comment.isHidden
        }))
        setComments(transformedComments)
      } catch (err) {
        console.error("Failed to fetch comments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [memorialId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setSubmitting(true)
    try {
      const data = await apiCall(`/api/memorials/${memorialId}/comments`, {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          content: newComment,
        }),
      })

      setComments([...comments, data])
      setNewComment("")
    } catch (err) {
      console.error("Failed to post comment:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCommentDeleted = () => {
    // Refresh comments
    const fetchComments = async () => {
      try {
        const data = await apiCall(`/api/memorials/${memorialId}/comments`)
        setComments(data)
      } catch (err) {
        console.error("Failed to fetch comments:", err)
      }
    }
    fetchComments()
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <MessageCircle className="h-5 w-5" />
          Memories & Condolences
        </CardTitle>
        <CardDescription className="text-muted-foreground">{comments.length} messages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share a memory or message of support..."
            rows={3}
            className="w-full rounded-md border border-border/50 bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {submitting ? "Posting..." : "Post Memory"}
          </Button>
        </form>

        {/* Comments List */}
        <div className="border-t border-border/50 pt-6">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground">No messages yet. Be the first to share.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  id={comment._id}
                  memorialId={memorialId}
                  author={comment.author}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  userId={comment.userId}
                  onCommentDeleted={handleCommentDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
