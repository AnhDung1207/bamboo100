"use client"

import Footer from "@/components/Footer"
import ZaloButton from "@/components/ZaloButton"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Footer />
      <ZaloButton />
    </>
  )
}