import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import type { Post } from '@/lib/types'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [page])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/posts?page=${page}&limit=10`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch posts')
      }

      setPosts(result.data.posts)
      setPages(result.data.pagination.pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Home - Kiongozi Connect</title>
        <meta name="description" content="Stay updated with what your leader is doing" />
      </Head>

      <div className="home-page">
        <div className="hero">
          <h1>Jua Kiongozi Wako Amefanya Nini Leo</h1>
          <p>Know what your leader has done today</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <LoadingSkeleton count={3} height="250px" />
        ) : (
          <>
            <div className="posts-feed">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {posts.length === 0 && (
              <div className="no-results">
                <p>No posts yet. Check back soon!</p>
              </div>
            )}
          </>
        )}

        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </Layout>
  )
}
