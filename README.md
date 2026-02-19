# Smart Bookmark App

A private bookmark manager built using Next.js and Supabase.

##  Live Demo
(Will update after Vercel deployment)

##  Tech Stack

- Next.js 14
- React 18
- Supabase (Auth + Postgres + Realtime)
- Tailwind CSS
- Vercel (Deployment)

##  Features

- Email OTP authentication
- Secure per-user data isolation using Row Level Security (RLS)
- Add bookmarks (title + URL)
- Delete bookmarks
- Realtime updates across multiple tabs
- Search functionality
- Responsive UI

##  Security

User data isolation is enforced at the database level using Supabase Row Level Security policies:
- Users can only read, insert, and delete their own bookmarks.
- Prevents cross-user data access.

##  Realtime Implementation

Used Supabase Postgres change subscriptions to listen for changes in the bookmarks table.
Filtered by user_id to ensure only relevant updates are received.

##  Installation (Local Setup)

1. Clone the repository:

git clone https://github.com/Yaduvamsikrishna123/smart-bookmark-app.git


2. Install dependencies:

npm install


3. Create `.env.local` file in root:

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key


4. Start development server:

npm run dev


App will run at:
http://localhost:3000


## Future Improvements

- Edit bookmark feature
- Pagination
- Folder/category grouping
- Server-side search
- Improved UI styling

---

Built as part of a screening task to demonstrate fullstack development skills using modern web technologies
