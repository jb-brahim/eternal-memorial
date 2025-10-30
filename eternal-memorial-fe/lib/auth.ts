// Authentication utilities for JWT token management
const TOKEN_KEY = "eternal-token"
const USER_KEY = "eternal-user"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

export interface AuthResponse {
  token: string
  user: User
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getAuthHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  // If the body is a FormData instance, do not set Content-Type and let
  // the browser/node runtime set the correct multipart boundary header.
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData

  const rawHeaders = {
    ...getAuthHeader(),
    ...(options.headers as Record<string, string> | undefined),
  } as Record<string, string | undefined>

  if (!isFormData) {
    rawHeaders['Content-Type'] = 'application/json'
  }

  // Remove undefined values (e.g., when no auth header is present)
  const headers = Object.fromEntries(Object.entries(rawHeaders).filter(([, v]) => v !== undefined)) as Record<string, string>

  // If body is a plain object and not FormData, stringify it for JSON requests
  const body = !isFormData && options.body && typeof options.body === 'object' ? JSON.stringify(options.body) : options.body

  // Force console log to debug the API URL
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  console.log('Making request to:', `${apiUrl}${endpoint}`);
  
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    body,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}
