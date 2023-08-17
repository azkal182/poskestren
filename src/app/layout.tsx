import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
 
import TopBar from '@/components/layouts/top-bar'
import FloatingNavbar from '@/components/layouts/floating-navbar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  applicationName:"UKS",
  title: 'POSKESTREN MANAGEMENT',
  description: 'management for poskestren amtsilati',
  manifest: "/manifest.json",
  themeColor: "#FFFFFF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: 'POSKESTREN MANAGEMENT',
    // startUpImage: [],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <TopBar/>
      <main className="p-2 pb-14 md:pb-0">{children}
      
      </main>
      <Toaster />
      <FloatingNavbar />
      </body>
    </html>
  )
}
