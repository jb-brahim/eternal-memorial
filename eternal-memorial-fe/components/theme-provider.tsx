"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "daylight" | "candlelight"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("daylight")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get theme from localStorage or system preference
    const stored = localStorage.getItem("eternal-theme") as Theme | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const initialTheme = stored || (prefersDark ? "candlelight" : "daylight")
    setTheme(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement
    if (newTheme === "candlelight") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
    localStorage.setItem("eternal-theme", newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === "daylight" ? "candlelight" : "daylight"
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  // Always provide the ThemeContext to children. The initial theme value is
  // 'daylight' until we read from localStorage in useEffect. Returning the
  // provider immediately prevents child components from calling useTheme
  // without a provider during the first render.
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
