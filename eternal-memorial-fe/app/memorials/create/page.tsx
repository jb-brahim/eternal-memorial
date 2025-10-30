"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { CreateMemorialForm } from "@/components/create-memorial-form"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CreateMemorialPage() {
  return (
    <ProtectedRoute>
      <main className="gradient-daylight dark:gradient-candlelight min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/memorials">
              <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex justify-center">
            <CreateMemorialForm />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
