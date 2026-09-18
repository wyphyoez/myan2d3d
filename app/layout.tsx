import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = { title: "Myan2D3D", description: "SET-powered Myanmar 2D market results." }
export const viewport: Viewport = { themeColor: "#f6efe1", width: "device-width", initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
