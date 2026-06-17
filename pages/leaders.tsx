import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import LeaderCard from '@/components/LeaderCard'
import Pagination from '@/components/Pagination'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import type { Leader } from '@/lib/types'

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaders()
  }, [page])

  const fetchLeaders = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/leaders?page=${page}&limit=20`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch leaders')
      }

      setLeaders(result.data.leaders)
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
        <title>Leaders - Kiongozi Connect</title>
        <meta name="description" content="Browse and discover leaders on Kiongozi Connect" />
      </Head>

      <div className="leaders-page">
        <h1>Leaders</h1>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <LoadingSkeleton count={6} height="200px" />
        ) : (
          <>
            <div className="leaders-grid">
              {leaders.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} />
              ))}
            </div>

            {leaders.length === 0 && (
              <div className="no-results">
                <p>No leaders found.</p>
              </div>
            )}
          </>
        )}

        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </Layout>
  )
}
