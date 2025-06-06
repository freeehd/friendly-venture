import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { defaultMetadata } from "./metadata"
import { ThemeProvider } from "@/components/theme-provider"
import { OrganizationJsonLd } from "@/components/json-ld"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
