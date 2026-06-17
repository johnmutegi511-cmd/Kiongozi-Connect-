import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function apiHandler<T>(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<T>>,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    // Add caching headers for GET requests
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    }

    await handler(req, res)
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}

export function successResponse<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  statusCode: number = 200
) {
  res.status(statusCode).json({
    success: true,
    data,
  })
}

export function errorResponse<T>(
  res: NextApiResponse<ApiResponse<T>>,
  error: string,
  statusCode: number = 400
) {
  res.status(statusCode).json({
    success: false,
    error,
  })
}

// Pagination helper
export function getPaginationParams(req: NextApiRequest) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
  return { page, limit }
}

// Authentication middleware
export async function requireAuth(req: NextApiRequest) {
  const token = req.headers.authorization?.split('Bearer ')[1]

  if (!token) {
    throw new Error('Unauthorized')
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    throw new Error('Invalid token')
  }

  return user
}
