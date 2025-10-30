"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiCall, getUser } from "@/lib/auth"
import { Image as ImageIcon, X, Upload } from "lucide-react"

export function CreateMemorialForm() {
  const router = useRouter()
  const user = getUser()
  const [name, setName] = useState("")
  const [story, setStory] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    
    if (images.length + newFiles.length > 5) {
      setError("Maximum 5 images allowed")
      return
    }

    setError("")
    setImages(prev => [...prev, ...newFiles])
    
    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      processFiles(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files) {
      processFiles(files)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreview(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!user) throw new Error("User not authenticated")

      const formData = new FormData()
      formData.append("userId", user.id)
      formData.append("name", name)
      formData.append("story", story)
      images.forEach(image => {
        // Backend expects field name 'photos' (array)
        formData.append("photos", image)
      })

      const data = await apiCall("/api/memorials", {
        method: "POST",
        body: formData,
        headers: {
          // Remove Content-Type to let the browser set it with boundary
        },
      })

      if (!data?.id) {
        throw new Error("Server did not return a memorial ID")
      }

      // Wait for navigation to complete before continuing
      await router.push(`/memorials/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create memorial")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Create a Memorial</CardTitle>
        <CardDescription className="text-muted-foreground">
          Honor and remember a loved one with a lasting memorial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Full name of the person"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-border/50 bg-card text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="story" className="text-sm font-medium text-foreground">
              Story & Memories
            </label>
            <textarea
              id="story"
              placeholder="Share memories, achievements, and what made this person special..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              required
              rows={6}
              className="w-full rounded-md border border-border/50 bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="photos" className="text-sm font-medium text-foreground">
              Photos (Optional, up to 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <div
              onClick={openFileDialog}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg hover:border-primary transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border/50"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload
                  className={`w-6 h-6 text-muted-foreground mb-2 transition-transform ${
                    isDragging ? "scale-110" : ""
                  }`}
                />
                <p className="text-sm text-muted-foreground">
                  {isDragging ? "Drop images here" : "Click or drag images here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum 5 images allowed
                </p>
              </div>
            </div>
            {preview.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {preview.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-xs text-destructive-foreground hover:bg-destructive/90"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Selected: {images.length}/5 images
            </p>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Creating..." : "Create Memorial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
