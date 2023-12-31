import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function hanlder(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== 'GET') {
        return res.status(405).end()
    }

    const reviews = await prisma.rating.findMany({
        orderBy: {
            created_at: 'desc'
        },
        include: {
            book: true,
            user: true
        },
        take: 10
    })

    return res.json({ reviews })
}