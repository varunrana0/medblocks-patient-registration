## 💬 Challenges Faced During Development

## ⚠️ Database Integration Challenges (Pglite + App Router)

While setting up the local Pglite database for our Patient Registration App (built with Next.js App Router), I encountered a few notable challenges related to path handling and environment configuration.

### 🐛 The Initial Problem

While trying to initialize a local file-based database (`/db/patients`) within the project directory using `PGlite`, the following error was thrown:

```
TypeError: The "path" argument must be of type string or an instance of Buffer or URL. Received an instance of URL
```

This occurred because in a **Next.js App Router** environment, modules can behave differently due to mixed execution contexts (Edge/Server/Browser), especially when working with filesystem modules like `path`, `fs`, and custom native packages.

The `PGlite` package requires a valid file path to store the database locally. However, by default, when using `process.cwd()` and `path.join`, Next.js failed to interpret this correctly in the new server context.

### ✅ Local Development Fix

To resolve this locally, I had to inform Next.js explicitly to treat server-only packages like `@electric-sql/pglite` correctly by configuring `next.config.ts` as follows:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
```

This directive ensures that Next.js handles the Pglite package as a server-side dependency only, and does not try to bundle or evaluate it in environments where filesystem access is restricted (like the Edge runtime).

Additionally, to avoid any runtime errors, I added a safeguard check:

```ts
if (!existsSync(dbpath)) {
  mkdirSync(dbpath, { recursive: true });
}
```

This ensured the DB directory exists before attempting to initialize the database.

### 🚨 New Problem on Vercel Deployment

While everything worked fine locally, the Vercel deployment failed with this error:

```
Error: ENOENT: no such file or directory, mkdir '/var/task/db/patients'
```

### 🧠 Root Cause

Vercel runs applications in a **read-only serverless environment** where you can only write to `/tmp`. Our code used `process.cwd()` to build the DB path, which resolved to `/var/task`, a read-only directory.

Attempting to create or write to any path under this root caused runtime errors.

### 🛠️ Final Fix for Vercel Compatibility

To solve this, I implemented a conditional path based on the environment:

```ts
const isProd = process.env.NODE_ENV === "production";
let dbDir = path.join(isProd ? "/tmp" : process.cwd(), "db", "patients");

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

db = new PGlite(dbDir);
```

### 🎯 Result

- ✅ Local development uses `process.cwd()` to store DB files.
- ✅ Vercel production uses `/tmp`, the only writable location.
- ✅ Resolved deployment crash caused by file system restrictions.

---

This journey served as a solid reminder that **serverless platforms like Vercel require special attention for file-system dependent features** like local SQLite (Pglite). Thankfully, a small tweak in environment handling was enough to make our app portable and production-ready.

---

## 🔄 Search Filter Sync Issue Across Tabs

While building the `PatientsTable` component, I wanted the search input to stay in sync across all open browser tabs using the `BroadcastChannel` API. This means if I type something in one tab, the same search and table data should show up in all other tabs too.

### ❌ What Was Going Wrong?

- When I searched for something like `rs` in one tab, it filtered the table correctly.
- But in other tabs, either the input didn’t update or the table data stayed the same.
- If I deleted a letter (like from `rs` to `r`), then no tab was in sync anymore.

### 🧠 Why This Happened

- Every tab had its own local `search` state.
- When one tab sent a message, others received it and updated their `search`, but then **they sent messages again**, causing a loop or mismatch.
- Sometimes messages came in too quickly, so tabs didn't update in time.

### ✅ How I Fixed It

- I used a `isRemoteUpdate` ref to know if the update came from another tab.
- If yes, I just updated the input and stopped there (no need to send the message again).
- If the user typed in the input (not a broadcast), then I sent the message to other tabs.

```tsx
if (!isRemoteUpdate.current) {
  channelRef.current?.postMessage({
    type: FILTER_PATIENTS,
    payload: search,
  });
} else {
  isRemoteUpdate.current = false;
}
```

```tsx
channel.onmessage = (event) => {
  if (event.data.type === FILTER_PATIENTS) {
    isRemoteUpdate.current = true;
    setSearch(event.data.payload);
  }
};
```

### 🎉 Result

Now, search input and table data stay in sync across all tabs. Everything updates instantly and correctly.
