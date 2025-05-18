## 💬 Challenges Faced During Development

## ⚠️ Database Integration Challenges (Pglite + App Router)

While setting up the local Pglite database for our Patient Registration App (built with Next.js App Router), I encountered a few notable challenges related to path handling and environment configuration.

### 🐛 The Problem

While trying to initialize a local file-based database `(/db/patients)` within the project directory using `PGlite`.

```
TypeError: The "path" argument must be of type string or an instance of Buffer or URL. Received an instance of URL
```

This occurred because in a **Next.js App Router** environment, modules can behave differently due to the mixed execution contexts (edge/server/browser), especially when working with filesystem modules like `path`, `fs`, and custom native packages.

The `PGlite` package requires a valid file path to store the database locally. However, by default, when using `process.cwd()` and `path.join`, Next.js failed to interpret this correctly in the new server context.

### ✅ The Solution

To resolve this, I had to inform Next.js explicitly to allow server-only packages like `@electric-sql/pglite` by configuring `next.config.ts` as follows:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
```

This directive ensures that Next.js handles the Pglite package as a server-side dependency only, and does not try to bundle or evaluate it in environments where filesystem access is restricted (like the Edge runtime).

### 📁 Additional Safeguard

I also added a filesystem check to create the DB directory if it doesn’t exist:

```ts
if (!existsSync(dbpath)) {
  mkdirSync(dbpath, { recursive: true });
}
```

With this in place, the DB now initializes correctly without runtime errors, and I can safely persist patient data locally using Pglite.

---

This setup proved essential in enabling a fast and reliable local-first database experience in a modern hybrid-rendered React application.

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
