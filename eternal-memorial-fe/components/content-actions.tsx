"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ReportModal } from "./report-modal"
import { Flag, MoreVertical } from "lucide-react"

interface ContentActionsProps {
  contentId: string
  contentType: "memorial" | "comment"
}

export function ContentActions({ contentId, contentType }: ContentActionsProps) {
  const [showReport, setShowReport] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)} className="h-8 w-8 hover:bg-muted">
          <MoreVertical className="h-4 w-4" />
        </Button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-md border border-border/50 bg-card shadow-lg z-40">
            <button
              onClick={() => {
                setShowReport(true)
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 rounded-t-md"
            >
              <Flag className="h-4 w-4" />
              Report Content
            </button>
          </div>
        )}
      </div>

      {showReport && (
        <ReportModal contentId={contentId} contentType={contentType} onClose={() => setShowReport(false)} />
      )}
    </>
  )
}
