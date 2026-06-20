'use client'
import { useEffect } from 'react'

// Augment window with OneSignal deferred queue
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OneSignalDeferred?: ((onesignal: any) => Promise<void>)[]
  }
}

export function OneSignalInit() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    if (!appId) return

    // Avoid loading the script twice (e.g. React StrictMode double-invoke)
    if (document.getElementById('onesignal-sdk')) return

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.init({
        appId,
        // We show our own "אפשר התראות" button — disable OneSignal's built-in widget
        notifyButton: { enable: false },
        welcomeNotification: { disable: true },
        // Allow HTTP localhost for development
        allowLocalhostAsSecureOrigin: true,
      })
    })

    const script = document.createElement('script')
    script.id = 'onesignal-sdk'
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
    script.defer = true
    document.head.appendChild(script)
  }, [])

  return null
}
