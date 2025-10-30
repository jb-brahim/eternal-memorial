"use client"

import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-primary/10"
      aria-label={`Switch to ${theme === "daylight" ? "Candlelight" : "Daylight"} mode`}
    >
      {theme === "daylight" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
    </Button>
  )
}
