import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler, successResponse, errorResponse, getPaginationParams } from '@/lib/api-helpers'
import { getPosts } from '@/lib/queries'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHandler(req, res, async () => {
    if (req.method === 'GET') {
      const { page, limit } = getPaginationParams(req)
      const userId = req.query.user_id as string | undefined

      const { posts, total } = await getPosts(page, userId)

      return successResponse(res, {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    }

    errorResponse(res, 'Method not allowed', 405)
  })
}
