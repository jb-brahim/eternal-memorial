"use client"

import { useAuth } from "@/lib/useAuth"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"

export function AdminButton() {
  const { user } = useAuth()

  if (user?.role !== "admin") {
    return null
  }

  return (
    <Link href="/admin">
      <Button variant="outline" size="sm" className="border-border/50">
        <ShieldCheck className="h-4 w-4 mr-2" />
        Admin Dashboard
      </Button>
    </Link>
  )
}