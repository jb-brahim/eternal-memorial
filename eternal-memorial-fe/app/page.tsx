import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { FeatureSection } from "@/components/feature-section"
import { Flame, ScrollText, MessageCircle } from "lucide-react"

export default function HomePage() {
  return (
    <main className="gradient-daylight dark:gradient-candlelight min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-8">
          <Logo className="w-[300px]" />
        </div>
        <p className="text-xl text-muted-foreground mb-8">
          A sacred space to honor and remember the lives of those we cherish. Create lasting memorials, light candles,
          and share memories with a community of remembrance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg bg-transparent"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <FeatureSection
          icon={<Flame className="w-12 h-12 text-amber-500" />}
          title="Light Candles"
          description="Honor loved ones by lighting virtual candles in remembrance"
          type="candle"
        />
        <FeatureSection
          icon={<ScrollText className="w-12 h-12 text-primary" />}
          title="Share Stories"
          description="Create beautiful memorials with photos and cherished memories"
          type="story"
        />
        <FeatureSection
          icon={<MessageCircle className="w-12 h-12 text-primary" />}
          title="Connect"
          description="Leave comments and support others in the community"
          type="comment"
        />
      </div>
    </main>
  )
}
