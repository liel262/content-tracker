import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { author, content } = await request.json()

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    const apiKey = process.env.ONESIGNAL_REST_API_KEY

    if (!appId || !apiKey) {
      // OneSignal not configured — silently skip (don't break the app)
      return NextResponse.json({ skipped: true })
    }

    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ['All'],
        headings: { he: `💬 הערה חדשה מ-${author}` },
        contents: { he: String(content).slice(0, 100) },
      }),
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
