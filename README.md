# Content Tracker 📱

אפליקציית ניהול תוכן לסושיאל מדיה. RTL מלא, זמן אמת, מותאמת לאייפון.

## הגדרה מהירה

### 1. הכן את Supabase

1. צור פרויקט ב-[supabase.com](https://supabase.com)
2. פתח את **SQL Editor** והרץ את הקובץ `supabase/migration.sql`
3. העתק את ה-**Project URL** וה-**anon public key** מ-Settings → API

### 2. הגדר משתני סביבה

```bash
cp .env.local.example .env.local
```

ערוך את `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 3. הרץ

```bash
npm install
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000)

---

## Deploy ל-Vercel

1. דחוף לגיטהאב
2. [vercel.com/new](https://vercel.com/new) → Import
3. הוסף את משתני הסביבה ב-Settings → Environment Variables
4. Deploy ✅

---

## מבנה הפרויקט

```
src/
├── app/           # עמודים (Next.js App Router)
├── components/    # קומפוננטות UI
├── context/       # NotificationContext (ריאלטיים + טוסטים)
├── hooks/         # usePosts, useNotes
├── lib/           # supabase client
└── types/         # Post, Note, PostStatus
```

## סטטוסים

| מפתח | עברית |
|------|-------|
| `missing` | חסר תוכן |
| `in_progress` | בתהליך |
| `pending_approval` | ממתין לאישור |
| `approved` | אושר |
| `published` | פורסם |
