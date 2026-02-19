"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Home() {
  
  const [user, setUser] = useState<any>(null)

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [search, setSearch] = useState("")


  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
    }

    getSession()
  }, [])

 useEffect(() => {
  if (!user) return

  fetchBookmarks()

  const channel = supabase
    .channel("realtime-bookmarks")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
        filter: `user_id=eq.${user.id}`,
      },
      () => {
        fetchBookmarks()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [user])


 const fetchBookmarks = async () => {
  if (!user) return

  const { data } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  setBookmarks(data || [])
}


 const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error("Google login error:", error.message);
  }
};


  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }
const addBookmark = async () => {
  if (!title || !url || !user) return

  const { data, error } = await supabase
    .from("bookmarks")
    .insert([
      {
        user_id: user.id,
        title,
        url,
      },
    ])
    .select()

  if (!error && data) {
    setBookmarks((prev) => [data[0], ...prev])
  }

  setTitle("")
  setUrl("")
}


  if (user) {
    return (
      <div className="flex flex-col items-center min-h-screen gap-4 p-6">
        <h1 className="text-2xl font-bold">Welcome {user.email}</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL"
            className="border p-2 rounded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={addBookmark}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

  <input
  type="text"
  placeholder="Search bookmarks..."
  className="border p-2 rounded w-full max-w-md"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

       <div className="w-full max-w-md">
  {bookmarks
  .filter((bookmark) =>
    bookmark.title.toLowerCase().includes(search.toLowerCase())
  )
  .map((bookmark) => (

    <div
      key={bookmark.id}
      className="border p-2 rounded mb-2 flex justify-between items-center"
    >
     <a
  href={bookmark.url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 hover:underline"
>
  {bookmark.title}
</a>

      <button
        onClick={async () => {
          await supabase
            .from("bookmarks")
            .delete()
            .eq("id", bookmark.id)

          fetchBookmarks()
        }}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  ))}
</div>


        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
  <h1 className="text-3xl font-bold">Smart Bookmark App</h1>

  {!user ? (
    <button
  onClick={handleLogin}
  className="bg-black text-white px-6 py-2 rounded"
>
  Login with Google
</button>

  ) : (
    <>
      <h2 className="text-lg">
        Welcome {user.email}
      </h2>

      {/* Bookmark form + list here */}
    </>
  )}
</div>
  )
}

