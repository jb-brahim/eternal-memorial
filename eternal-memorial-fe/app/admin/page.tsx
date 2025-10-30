"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminStats } from "@/components/admin-stats"
import { AdminUsersTable } from "@/components/admin-users-table"
import { Logo } from "@/components/logo"
import { AdminMemorialsTable } from "@/components/admin-memorials-table"
import { AdminReportsTable } from "@/components/admin-reports-table"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

function AdminDashboardContent() {
  return (
    <main className="gradient-daylight dark:gradient-candlelight min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Logo className="w-[200px] hover:opacity-80 transition-opacity" />
            <p className="text-muted-foreground mt-2">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/memorials">
              <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <AdminStats />
          <AdminReportsTable />
          <AdminUsersTable />
          <AdminMemorialsTable />
        </div>
      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
