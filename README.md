# Smart Bookmark App

A private bookmark manager built using Next.js and Supabase.
 Tech Stack

Next.js 14 (App Router)

React 18

Supabase

Google OAuth Authentication

Postgres Database

Row Level Security (RLS)

Realtime Subscriptions

Tailwind CSS

Vercel (Deployment)

## Features
 Google OAuth Authentication

Login using Google only (no email/password).

Secure session handling via Supabase Auth.

## Add Bookmarks

Users can add bookmarks with:

Title

URL

🗑 Delete Bookmarks

Users can delete only their own bookmarks.

## Private Per User (Database-Level Security)

Implemented Row Level Security (RLS).

Policy ensures:

auth.uid() = user_id


Prevents cross-user data access at the database level.

 ## Real-Time Updates

Implemented using Supabase Postgres change subscriptions.

Updates sync instantly across multiple browser tabs.

No manual refresh required.

 Search Functionality

Client-side filtering by bookmark title.

 Security Implementation

Security is enforced at the database level, not just in the frontend.

Each bookmark row stores user_id.

## RLS policies restrict:

SELECT

INSERT

DELETE

Users cannot access or modify other users' bookmarks.

## Environment Variables

The following environment variables are required:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

## Local Setup Instructions

## Clone the repository:

git clone https://github.com/Yaduvamsikrishna123/smart-bookmark-app.git


Install dependencies:

npm install


Create .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key


Start development server:

npm run dev


App runs at:

http://localhost:3000

## Deployment

Deployed on Vercel

Environment variables configured in Vercel dashboard

Supabase Site URL and Redirect URLs configured for production domain

## Challenges Faced & Solutions
1. OAuth Redirect Issue

Problem: After clicking Google login, redirect went to localhost instead of Vercel.
Solution: Updated Supabase Authentication → URL Configuration with correct production domain.

2. Realtime Sync Issue

Problem: Deleted bookmarks required refresh in some cases.
Solution: Added user-specific filtering in both realtime subscription and fetch query.

3. Git Push Rejection

Problem: Remote repository contained changes not available locally.
Solution: Resolved using:

git pull origin main --rebase

## Future Improvements

Edit bookmark functionality

Server-side search using .ilike

Bookmark categories/folders

Pagination for large datasets

UI enhancements

## Final Notes

This project demonstrates:

Authentication flow implementation

Secure multi-user data handling

Real-time database updates

Production deployment workflow

Built with focus on clean architecture, security, and real-time user experience.
