"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiCall } from "@/lib/auth"
import { Ban, Home, RotateCcw, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { UserDetailsDialog } from "./user-details-dialog"

interface User {
  _id: string
  email: string
  name: string
  role: string
  isBanned: boolean
  createdAt: string
}

export function AdminUsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiCall("/api/admin/users")
        // Transform the data to match our interface
        const transformedData = data.map((user: any) => ({
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isBanned: user.isBanned,
          createdAt: user.createdAt
        }))
        setUsers(transformedData)
      } catch (err) {
        console.error("Failed to fetch users:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleBanUser = async (userId: string) => {
    if (!userId) return;
    try {
      await apiCall(`/api/admin/users/${userId}/ban`, { method: "PUT" })
      setUsers(users.map((u) => (u._id === userId ? { ...u, isBanned: true } : u)))
    } catch (err) {
      console.error("Failed to ban user:", err)
    }
  }

  const handleUnbanUser = async (userId: string) => {
    if (!userId) return;
    try {
      await apiCall(`/api/admin/users/${userId}/ban`, { method: "PUT" })
      setUsers(users.map((u) => (u._id === userId ? { ...u, isBanned: false } : u)))
    } catch (err) {
      console.error("Failed to unban user:", err)
    }
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-foreground">Users</CardTitle>
          <CardDescription className="text-muted-foreground">{users.length} total users</CardDescription>
        </div>
        <Link href="/memorials">
          <Button variant="outline" size="sm" className="border-border/50">
            <Home className="h-4 w-4 mr-2" />
            View Memorials
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-border/50 hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedUserId(user._id)}>
                    <td className="py-3 px-4 text-foreground">{user.name}</td>
                    <td className="py-3 px-4 text-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          user.isBanned ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600"
                        }`}
                      >
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.isBanned ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnbanUser(user._id)}
                          className="border-border/50 hover:bg-green-500/10"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Unban
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBanUser(user._id)}
                          className="border-border/50 hover:bg-destructive/10"
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Ban
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <UserDetailsDialog 
          userId={selectedUserId || ""} 
          open={!!selectedUserId} 
          onOpenChange={(open) => !open && setSelectedUserId(null)} 
        />
      </CardContent>
    </Card>
  )
}
