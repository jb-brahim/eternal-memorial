"use client"

import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image
        src="/images/logo.png"
        alt="Eternal Memories - Honor. Remember. Connect."
        width={200}
        height={80}
        style={{ height: 'auto' }}
        priority
      />
    </Link>
  )
}