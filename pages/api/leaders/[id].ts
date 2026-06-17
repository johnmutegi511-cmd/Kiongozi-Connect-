import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler, successResponse, errorResponse } from '@/lib/api-helpers'
import { getLeader } from '@/lib/queries'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiHandler(req, res, async () => {
    const { id } = req.query

    if (typeof id !== 'string') {
      return errorResponse(res, 'Invalid leader ID', 400)
    }

    if (req.method === 'GET') {
      const leader = await getLeader(id)

      if (!leader) {
        return errorResponse(res, 'Leader not found', 404)
      }

      return successResponse(res, leader)
    }

    errorResponse(res, 'Method not allowed', 405)
  })
}
