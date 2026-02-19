"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Home() {
  const [email, setEmail] = useState("")
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
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    })

    if (error) {
      alert("Error sending login link")
    } else {
      alert("Check your email for login link!")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from("bookmarks").insert([
      {
        user_id: user.id,
        title,
        url,
      },
    ])

    setTitle("")
    setUrl("")
    fetchBookmarks()
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Smart Bookmark App</h1>

      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  )
}
