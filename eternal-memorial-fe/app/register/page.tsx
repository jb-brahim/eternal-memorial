import { AuthForm } from "@/components/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RegisterPage() {
  return (
    <main className="gradient-daylight dark:gradient-candlelight min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">Eternal Memorial</h1>
        <p className="text-muted-foreground">Join our community of remembrance</p>
      </div>
      <AuthForm mode="register" />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </a>
      </p>
    </main>
  )
}
