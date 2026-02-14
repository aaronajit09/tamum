# New Supabase Project Setup Guide

Follow these steps to create your new Supabase project and connect it to the MSFC site. This setup includes **newsletter cover images** in addition to the existing features (newsletters, subscribers, admin).

---

## Step 1: Create a new Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose your organization, set a **Project name** (e.g. `msfc-website`), set a **Database password** (save it somewhere safe), and pick a region.
4. Click **Create new project** and wait for it to finish provisioning.

---

## Step 2: Get your API keys

1. In the left sidebar, go to **Project Settings** (gear icon) → **API**.
2. Copy and save:
   - **Project URL** (e.g. `https://txkkrcpcwgwgehogwisx.supabase.co`)
   - **anon public** (sb_publishable_CfWcrYO5PbZ15FdyLOItww_hOY6HpIA)key (under "Project API keys") — this is the publishable/client-safe key; do *not* use the `service_role` secret key.

You will paste these into `script.js` (see Step 6).

---

## Step 3: Create the database tables

1. In the left sidebar, open **SQL Editor**.
2. Click **New query** and run the following SQL (you can run it in one go):

```sql
-- Subscribers (email signups in the footer)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletters (title, date, preview, PDF link, and optional cover image)
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  preview TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: allow anonymous inserts for subscribers (for the footer form)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert on subscribers"
  ON subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous select on subscribers"
  ON subscribers FOR SELECT TO anon USING (true);

-- Newsletters: allow anonymous read (so the site can show them)
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous select on newsletters"
  ON newsletters FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert on newsletters"
  ON newsletters FOR INSERT TO anon WITH CHECK (true);

-- Events (upcoming events on homepage; create/delete when logged in as admin)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  description TEXT NOT NULL,
  link_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous select on events"
  ON events FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert on events"
  ON events FOR INSERT TO anon WITH CHECK (true);
```

3. Click **Run**. You should see success messages.

**If you already ran the SQL before:** run this in a new query to add the events table only:

```sql
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  description TEXT NOT NULL,
  link_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous select on events" ON events FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert on events" ON events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on events" ON events FOR DELETE TO anon USING (true);
```

---

## Step 4: Create storage buckets

1. In the left sidebar, go to **Storage**.
2. Click **New bucket** and create:
   - **Name:** `newsletters`  
     **Public bucket:** ON (so PDF links work).  
     Create the bucket.
   - **Name:** `newsletter-covers`  
     **Public bucket:** ON (so cover images can be shown on the site).  
     Create the bucket.

3. For each bucket (`newsletters` and `newsletter-covers`):
   - Open the bucket → click **Policies** (or "New policy").
   - Add a policy so the app can upload and read:
     - **Policy name:** e.g. `Allow public read and anon upload`
     - **Allowed operation:** check **SELECT** and **INSERT**
     - **Target roles:** `anon`
     - **Policy definition:** In the SQL box, enter only this (no extra text):
       ```text
      true
       ```
       That single expression applies to both read and upload. Do *not* paste "For SELECT" or "For INSERT" — those were labels, not SQL.
   - Or use the template "Allow public read and anon upload" if your dashboard offers it.

---

## Step 5: (Optional) Restrict newsletter uploads

If you want only authenticated users to upload newsletters, you would use Supabase Auth. The current site uses a simple password in the browser (admin login). So for now, the policies above allow anonymous insert; the app itself restricts the upload form to “logged-in” admins via the existing admin flow.

---

## Step 6: Connect the site to your new project

1. Open **script.js** in your project.
2. Find the Supabase configuration block (near the top). It looks like:

   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

3. Replace the placeholders:
   - `YOUR_SUPABASE_PROJECT_URL` → your **Project URL** from Step 2.
   - `YOUR_SUPABASE_ANON_KEY` → your **anon public** key from Step 2.

4. Save the file.

---

## Features you have after setup

- **Newsletters:** Admin can upload a PDF plus an optional **cover image**. The latest newsletter’s cover appears on the homepage; all newsletters (with covers) appear on the Newsletters page.
- **Subscribers:** Footer email form saves to the `subscribers` table.
- **Latest newsletter:** Homepage “Our Latest Newsletter” section shows the most recent newsletter’s cover image and links to its PDF.
- **Events:** Homepage “Upcoming events” are stored in Supabase. When logged in as admin, you can **add** events (title, date/time, description, optional link, optional image URL) and **delete** events. Create/delete options are only visible when logged in.

All of this uses only **HTML, CSS, and JavaScript** with the Supabase JS client; no backend server required.
