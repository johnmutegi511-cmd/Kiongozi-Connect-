import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler, successResponse, errorResponse, getPaginationParams } from '@/lib/api-helpers'
import { getLeaders } from '@/lib/queries'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHandler(req, res, async () => {
    if (req.method === 'GET') {
      const { page, limit } = getPaginationParams(req)
      const verified = req.query.verified ? req.query.verified === 'true' : null

      const { leaders, total } = await getLeaders(page, verified)

      return successResponse(res, {
        leaders,
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
