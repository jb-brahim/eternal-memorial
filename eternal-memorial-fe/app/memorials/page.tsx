"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MemorialCard } from "@/components/memorial-card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { apiCall, getUser, clearAuth } from "@/lib/auth"
import { Plus, LogOut, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { AdminButton } from "@/components/admin-button"

interface Memorial {
  id: string
  name: string
  story: string
  photos?: string[]
  candleCount: number
  createdAt: string
}

function MemorialsContent() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setUser(getUser())
    const fetchMemorials = async () => {
      try {
        const data = await apiCall("/api/memorials")
        // Transform the data to match our interface
        const transformedData: Memorial[] = data.map((memorial: any) => {
          const photos = memorial.photos?.map((photo: string) => 
            photo.startsWith('http') 
              ? photo 
              : `${process.env.NEXT_PUBLIC_API_URL}${photo}`
          ) || [];
          
          return {
            id: memorial._id,
            name: memorial.name,
            story: memorial.story,
            photos: photos.length > 0 ? photos : ["/placeholder.svg"],
            candleCount: memorial.candleCount || 0,
            createdAt: memorial.createdAt
          };
        });
        setMemorials(transformedData);
      } catch (err) {
        console.error("Failed to fetch memorials:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMemorials()
  }, [])

  const filteredMemorials = memorials.filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  return (
    <main className="gradient-daylight dark:gradient-candlelight min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Logo className="w-[200px] hover:opacity-80 transition-opacity" />
            <div suppressHydrationWarning>
              {user?.name && (
                <p className="text-muted-foreground mt-2">
                  Welcome, {user.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <AdminButton />
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full hover:bg-destructive/10"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search memorials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-lg border border-border/50 bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {user ? (
            <Link href="/memorials/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Memorial
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign in to Create Memorial
              </Button>
            </Link>
          )}
        </div>

        {/* Memorials Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading memorials...</p>
            </div>
          </div>
        ) : filteredMemorials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No memorials found</p>
            <Link href="/memorials/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create the first memorial
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Memorial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {filteredMemorials.map((memorial, index) => (
                <MemorialCard 
                  key={memorial.id} 
                  {...memorial} 
                  isFirst={index === 0}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default function MemorialsPage() {
  return <MemorialsContent />
}
