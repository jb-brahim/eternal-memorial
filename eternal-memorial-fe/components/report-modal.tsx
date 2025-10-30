"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiCall, getUser } from "@/lib/auth"
import { Flag } from "lucide-react"

interface ReportModalProps {
  contentId: string
  contentType: "memorial" | "comment"
  onClose: () => void
}

export function ReportModal({ contentId, contentType, onClose }: ReportModalProps) {
  const user = getUser()
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason || !user) return

    setSubmitting(true)
    try {
      await apiCall("/api/reports", {
        method: "POST",
        body: JSON.stringify({
          contentId,
          contentType,
          reason,
          description,
          reportedBy: user.id,
        }),
      })
      setSubmitted(true)
      setTimeout(onClose, 2000)
    } catch (err) {
      console.error("Failed to submit report:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md border-border/50">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">Thank you for reporting</p>
            <p className="text-muted-foreground">Our team will review this content shortly.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Flag className="h-5 w-5" />
            Report Content
          </CardTitle>
          <CardDescription className="text-muted-foreground">Help us keep our community safe</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium text-foreground">
                Reason
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full rounded-md border border-border/50 bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a reason</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="spam">Spam</option>
                <option value="harassment">Harassment</option>
                <option value="misinformation">Misinformation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details..."
                rows={3}
                className="w-full rounded-md border border-border/50 bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-border/50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !reason}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? "Submitting..." : "Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
