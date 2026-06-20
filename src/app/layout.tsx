import type { Metadata, Viewport } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import { NotificationProvider } from '@/context/NotificationContext'
import { Navigation } from '@/components/Navigation'
import { ToastContainer } from '@/components/ToastContainer'
import { OneSignalInit } from '@/components/OneSignalInit'

const rubik = Rubik({
  subsets: ['latin', 'hebrew'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Content Tracker',
  description: 'ניהול תוכן לסושיאל מדיה',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Content Tracker',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  formatDetection: { telephone: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${rubik.className} bg-slate-50 text-gray-900 antialiased`}>
        <NotificationProvider>
          <OneSignalInit />
          {/* Desktop: flex row — sidebar right, main left (RTL) */}
          <div className="flex h-screen overflow-hidden">
            <Navigation />
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
              {children}
            </main>
          </div>
          <ToastContainer />
        </NotificationProvider>
      </body>
    </html>
  )
}
