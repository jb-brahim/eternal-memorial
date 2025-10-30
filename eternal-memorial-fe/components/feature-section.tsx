"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/useAuth"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useState } from "react"
import Link from "next/link"

interface FeatureSectionProps {
  icon: React.ReactNode
  title: string
  description: string
  type: "candle" | "story" | "comment"
}

export function FeatureSection({ icon, title, description, type }: FeatureSectionProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [showAuthAlert, setShowAuthAlert] = useState(false)

  const handleClick = () => {
    if (type === "candle") {
      // For candles, directly go to memorials
      router.push("/memorials")
    } else if (!user) {
      // For stories and comments, show auth alert if not logged in
      setShowAuthAlert(true)
    } else {
      // If logged in, redirect to appropriate page
      router.push("/memorials")
    }
  }

  return (
    <>
      <div 
        onClick={handleClick}
        className="text-center cursor-pointer p-6 rounded-lg hover:bg-white/5 transition-colors"
      >
        <div className="flex justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <AlertDialog open={showAuthAlert} onOpenChange={setShowAuthAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in required</AlertDialogTitle>
            <AlertDialogDescription>
              Please sign in or create an account to {type === "story" ? "create memorials" : "leave comments"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <Link href="/login" className="flex-1">
              <AlertDialogAction className="w-full">Sign In</AlertDialogAction>
            </Link>
            <Link href="/register" className="flex-1">
              <AlertDialogAction className="w-full bg-primary">Create Account</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}