"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"

interface MemorialCardProps {
  id: string
  name: string
  story: string
  photos?: string[]
  candleCount: number
  createdAt: string
  isFirst?: boolean
}

export function MemorialCard({ id, name, story, photos, candleCount, createdAt, isFirst }: MemorialCardProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Link href={`/memorials/${id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border/50 bg-card hover:bg-card/80">
        {(
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
            <Image 
              src={photos?.length ? photos[0] : "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover"
              loading={isFirst ? "eager" : "lazy"}
              onError={(e) => {
                // @ts-ignore
                e.target.src = "/placeholder.svg";
              }}
              unoptimized={process.env.NODE_ENV === 'development'}
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl text-foreground line-clamp-2">{name}</CardTitle>
          <CardDescription className="text-muted-foreground">{date}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground line-clamp-3">{story}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary">
              <Flame className="h-3 w-3" />
              {candleCount} candles
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
